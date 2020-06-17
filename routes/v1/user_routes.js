const express = require('express');
const router = express.Router();
const authentication = require('../../authentication/authentication');
const jsonModel = require('../../models/response/JsonModel');
const User = require('../../schema/User');

router.post("/getAllUsers", (req, res) => {
   let requestedBy = req.body.username;
   let userList = [];

   User.findOne({username: requestedBy})
       .then((user) => {
           if (user.isResearcher) {
               User.find()
                   .then((users) => {
                       for (let i = 0; i < users.length - 1; i++) {
                           let updatedUser = {
                               "userID": users[i]._id,
                               "username": users[i].username,
                               "firstName": users[i].firstName,
                               "lastName": users[i].lastName,
                               "dateOfBirth": users[i].dateOfBirth,
                               "isInfected": users[i].isInfected,
                               "hasBeenInContactWith": users[i].hasBeenInContactWith
                           };
                           userList.push(updatedUser);
                       }

                       res.status(200).json({
                           response: new jsonModel("/api/user", "GET", 200, "Request succesful"),
                           users: userList
                       })
                   })
           } else {
               res.status(403).json({
                   response: new jsonModel("/api/user", "GET", 403, "Forbidden"),
               })
           }
       })
});


module.exports = router;
