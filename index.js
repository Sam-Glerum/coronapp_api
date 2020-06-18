require('dotenv').config(); // Load dotenv for using environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // If set, set PORT to env variable. Otherwise set to 3000

app.use(cors());
app.use(bodyParser.json());

// Connect to DB
try {
    let CONNECTION_STRING = "mongodb+srv://baseuser:" + process.env.DB_PASS +"@coronapp-c4dvi.mongodb.net/" + process.env.DB_NAME + "?retryWrites=true&w=majority";
    mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true})
} catch (error) {
    console.log(error)
}

// app.get("*", (req, res) => {
//     res.send("Welcome to the Coronapp API!");
// });

app.use('/api', require('./routes/v1/authentication_routes'));
app.use('/api/user', require('./routes/v1/user_routes'));

app.listen(PORT, () => {
    console.log("API is listening on port " + PORT);
});

