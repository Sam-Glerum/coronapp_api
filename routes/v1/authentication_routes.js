const express = require('express');
const router = express.Router();
const authentication = require('../../authentication/authentication');
const checkObjects = require('../../models/CheckObjects');
const apiErrors = require('../../models/error/apiErrors');
const jsonModel = require('../../models/response/JsonModel');
const User = require('../../schema/User');

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.all(new RegExp("^(?!\/login$|\/register$).*"), (req, res, next) => {
    // Get token from headers
    const token = req.header('X-Access-Token');
    authentication.decodeToken(token, (error, payload) => {
        if (error) {
            console.log('Error: ' + error.message);

            res.status((error.status || 401)).json("Not Authorised");
        } else {
            req.user = {
            username: payload.sub,
            role: payload.role
        };
        next();
    }
    })
});

// Register route
router.post('/register', (req, res) => {
    const registerInfo = req.body;

    const newUser = new User({
        username: registerInfo.username.trim().toLowerCase(),
        password: "",
        firstName: registerInfo.firstName.trim(),
        lastName: registerInfo.lastName.trim(),
        dateOfBirth: registerInfo.dateOfBirth,
        isResearcher: registerInfo.isResearcher,
        isInfected: registerInfo.isInfected,
        TwoFactorCode: ""
    });

    User.findOne({username: req.body.username})
        .then((user) => {
            if (user === null) {
                bcrypt.hash(req.body.password, saltRounds)
                    .then((hashedPassword) => {
                        newUser.password = hashedPassword;
                        newUser.save()
                    })

                    .then((user) => {
                        res.status(201).json({
                            response: new jsonModel("/api/register", "POST", 201, "User " + newUser.username + " has been created")
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json(error);
                    })
            } else {
                res.status(409).json(new jsonModel("/api/register", "POST", 409, "User " + req.body.username + " already exists"));
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(new jsonModel("/api/register", "POST", 500, "Something went wrong. Please try again"));
        })
});

router.post('/login', (req, res) => {
    const loginInfo = req.body;

    const username = loginInfo.username;
    const password = loginInfo.password;
    let isResearcher = null;
    let userObject = null;
    let userID = "";

    User.findOne({username: username})
        .then((user) => {
            userObject = user;
            userID = user._id;
            return bcrypt.compare(password, user.password);
        })
        .catch((error) => {
            res.send(error);
        })
        .then((samePassword) => {
            if (samePassword) {
                isResearcher = userObject.isResearcher;
                let token = authentication.encodeToken(username, userID, isResearcher);
                res.status(200).json({
                    response: new jsonModel("/api/login", "POST", 200, "You have succesfully logged in"),
                    token: token
                })
            }
        }).catch((error) => {
            res.send(error);
    })
});

module.exports = router;
