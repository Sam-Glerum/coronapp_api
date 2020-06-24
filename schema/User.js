const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    "username": {type: String, required: true, unique: true},
    "password": {type: String, required: true},
    "firstName": {type: String, required: true},
    "lastName": {type: String, required: true},
    "dateOfBirth": {type: Date, required: true},
    "isResearcher": {type: Boolean, required: true, default: false},
    "isInfected": {type: Boolean, required: true, default: false},
    "hasBeenInContactWith": [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    "messages": [{
        "from": "",
        type: String
    }],
    "publicKey": String,
    "checkSum": String
});

let User = mongoose.model('User', userSchema);

module.exports = User;
