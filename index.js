require('dotenv').config(); // Load dotenv for using environment variables
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;










app.listen(PORT, () => {
    console.log("API is listening on port " + PORT);
});

