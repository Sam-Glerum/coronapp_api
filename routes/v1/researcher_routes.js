const express = require('express');
const router = express.Router();
const authentication = require('../../authentication/authentication');
const jsonModel = require('../../models/response/JsonModel');
const User = require('../../schema/User');

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
                user.messages.push({
                    from: researcher.sub,
                    subject: "Two factor code",
                    content: random2fCode
                })
            }
        })
        .catch((error) => {
            res.send(error);
        })
});

module.exports = router;
