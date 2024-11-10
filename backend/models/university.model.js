const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    univesity:{
        type:String,
        unique:true,
        required:true,
    },
    users: [{ type: String }],
    clubs: [{ type: String }],
});
module.exports = mongoose.model('University', universitySchema);
