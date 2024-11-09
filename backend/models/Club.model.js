const mongoose = require('mongoose');
const Club = require("../models/Club.model");



const clubSchema = new mongoose.Schema({
    clubUniqueName: {
        type: String,
        // required: true,
        // unique: true
    },
    name: {
        type: String,
        // required: true,
        // unique: true
    },
    universityName: {
        type: String,
        required: true
    },
    members:[
        {
        name: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          },}
    ],
      
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Msg'
    }],  
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

clubSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Club', clubSchema);