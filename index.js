require('dotenv').config(); // Load dotenv for using environment variables
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // If set, set PORT to env variable. Otherwise set to 3000

app.get("*", (req, res) => {
    res.send("Welcome to the Coronapp API!");
});

app.listen(PORT, () => {
    console.log("API is listening on port " + PORT);
});

