const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const messageSchema = new Schema({
    content: {type: String, required: true},
    sentBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
