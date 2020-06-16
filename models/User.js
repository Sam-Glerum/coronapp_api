const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    "firstName": {type: String, required: true},
    "lastName": {type: String, required: true},
    "dateOfBirth": {type: Date, required: true},
    "isInfected": {type: Boolean, required: true},
    "hasBeenInContactWith": [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    "isResearcher": {type: Boolean, required: true}
});

let User = mongoose.model('User', userSchema);

module.exports = User;
