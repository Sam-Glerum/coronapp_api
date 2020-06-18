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

router.post("/getAllInfectedUsers", (req, res) => {
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
                            if (updatedUser.isInfected) {
                                userList.push(updatedUser);
                            }
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

// Send userID to other user
router.put('/addToHasBeenInContactWith', (req, res) => {
    let sentByUserId = req.body.sentByUserId;
    let sentToUserId = req.body.sentToUserId;

    User.findOne({_id: sentToUserId})
        .then((user) => {
            User.findOne({_id: sentByUserId})
                .then((requestedBy) => {
                    if (user.hasBeenInContactWith.includes(sentByUserId)) {
                        console.log("contact exists already");
                        res.status(409).json(new jsonModel("/api/addToHasBeenInContactWith", "PUT", 409, "User is already present in the list of contacts"))
                    } else {
                        user.hasBeenInContactWith.push(sentByUserId);
                        user.save();
                        requestedBy.hasBeenInContactWith.push(sentToUserId);
                        requestedBy.save();
                        res.status(200).json({
                            response: new jsonModel("/api/addToHasBeenInContactWith", "PUT", 200, "User has been added to contact list")
                        })
                    }
                })
        })
        .catch((error) => {
            res.json(error);
        })
});

// Add infected status to user
router.put('/setInfectedStatus', (req, res) => {
    let username = req.body.username; // The user who's status should be changed
    let requestedBy = req.body.requestedBy; // The user who requested the statuschange
    let isInfected = req.body.isInfected;


    User.findOne({username: requestedBy})// Find researcher
        .then((requestedByUser) => {
            User.findOne({username: username}) // Find user that is or is not infected
                .then((user) => {
                    if (isInfected) {
                        if (user.isInfected) {
                            res.status(409).json({
                                response: new jsonModel("/api/setInfectedStatus", "PUT", 409, "User is already marked as infected")
                        });
                        } else {
                            user.isInfected = isInfected;
                            user.save();
                            res.status(200).json({
                                response: new jsonModel("/api/setInfectedStatus", "PUT", 200, "User is succesfully  marked as infected")
                            })
                        }
                    } else if (!isInfected && requestedByUser.isResearcher) {
                        user.isInfected = isInfected;
                        user.save();
                        res.status(200).json({
                            response: new jsonModel("/api/setInfectedStatus", "PUT", 200, "User is succesfully  marked as not infected")
                        })
                    } else if (!isInfected && !requestedByUser.isResearcher) {
                        res.status(403).json({
                            response: new jsonModel("/api/setInfectedStatus", "PUT", 403, "You do not have permissions to change your infection status")
                        })
                    }
                })
                .catch((error) => {
                    res.status(404).json({
                        response: new jsonModel("/api/setInfectedStatus", "PUT", 404, "User "+ username +" does not exist")
                    })
                })
                .catch((error) => {
                    res.status(404).json({
                        response: new jsonModel("/api/setInfectedStatus", "PUT", 404, "Researcher "+ requestedByUser +" does not exist")
                    })
                })
        })




});

// Add infected status to user
// router.put('/setInfectedStatus', (req, res) => {
//     let username = req.body.username; // The user who's status should be changed
//     let requestedBy = req.body.requestedBy; // The user who requested the statuschange
//     let isInfected = req.body.isInfected;
//     console.log("isresearcher: " + requestedBy.isResearcher);
//
//     User.findOne({username: username})
//         .then((user) => {
//             if (isInfected) { // Check if user is already infected
//                 if (user.isInfected) { // If he is, give a conflict error
//                     res.status(409).json({
//                         response: new jsonModel("/api/setInfectedStatus", "PUT", 409, "User is already marked as infected")
//                     });
//                 } else { // If user is not already set to infected, set to isInfected to true
//                     user.isInfected = isInfected;
//                     user.save();
//                     res.status(200).json({
//                         response: new jsonModel("/api/setInfectedStatus", "PUT", 200, "User is succesfully  marked as infected")
//                     })
//                 }
//             } else if(!isInfected && requestedBy.isResearcher) {
//                 user.isInfected = isInfected;
//                 user.save();
//                 res.status(200).json({
//                     response: new jsonModel("/api/setInfectedStatus", "PUT", 200, "User is succesfully  marked as not infected")
//                 })
//             }
//         })
//         .catch((error) => {
//             res.status(500).json("Something went wrong");
//         })
//
// });
module.exports = router;
