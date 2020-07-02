const express = require('express');
const router = express.Router();
const authentication = require('../../authentication/authentication');
const jsonModel = require('../../models/response/JsonModel');
const User = require('../../schema/User');

router.post("/validateUserByCode", (req, res) => {
    let twoFactorCode = req.body.twoFactorCode.trim();
    User.findOne({twoFactorCode: twoFactorCode})
        .then((user) => {
            if (user === null) {
                res.status(404).json("The supplied code is not valid")
            } else {
                res.status(200).json({
                    userID: user._id,
                    username: user.username,
                    twoFactorCode: twoFactorCode
                })
            }
        })
        .catch((error) => {
            res.send(error);
        })
});

router.post("/send2fCodeToUser", (req, res) => {
    const token = req.header('X-Access-Token');

    let researcher = "";
    let userID = req.body.userID;
    authentication.decodeToken(token, (error, payload) => {
        researcher = payload.sub;
    });
    let random2fCode = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
    User.findOne({_id: userID})
        .then((user) => {
            if (user === null) {
                res.send("User does not exist");
            } else {
                
                user.twoFactorCode = random2fCode.trim();
                user.save()
                    .then(() => {
                        res.status(200).json("okay");
                    });
            }
        })
        .catch((error) => {
            res.send(error);
        })
});

router.delete("/deleteTwoFactorCode", (req, res) => {
    let userID = req.body.userID;

    User.findById(userID)
        .then((user) => {
            if (user === null) {
                res.status(404).json("User " + userID + " does not exist");
            } else {
                user.twoFactorCode = "";
                user.save();
                res.status(200).json("Two Factor code has been succesfully deleted!")
            }
        }).catch((error) => {
            res.send(error);
    })
});

module.exports = router;
