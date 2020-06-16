require('dotenv').config(); // Load dotenv for using environment variables
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; // If set, set PORT to env variable. Otherwise set to 3000

try {
    let CONNECTION_STRING = "mongodb+srv://baseuser:" + process.env.DB_PASS +"@coronapp-c4dvi.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority";
    mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true})
} catch (error) {
    console.log(error)
}

app.get("*", (req, res) => {
    res.send("Welcome to the Coronapp API!");
});

app.listen(PORT, () => {
    console.log("API is listening on port " + PORT);
});

