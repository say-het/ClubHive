const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type:String,  
        required: true
    },
    name: {type: String},
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    _id: true 
});
module.exports = mongoose.model('Msg', messageSchema);