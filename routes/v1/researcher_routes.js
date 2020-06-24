const express = require('express');
const router = express.Router();
const authentication = require('../../authentication/authentication');
const jsonModel = require('../../models/response/JsonModel');
const User = require('../../schema/User');

router.post("/send2fCodeToUser", (req, res) => {
});

module.exports = router;
