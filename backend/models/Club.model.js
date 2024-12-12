const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    clubUniqueName: {
        type: String,
    },   
    name: {
        type: String,
    },
    clubType: {
        type: Boolean, // true: public, false: private
        default: false
    },
    clubDescription: {
        type: String,
        default: 'No Value or error in fetching'
    },
    universityName: {
        type: String,
        required: true
    },
    members: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Msg'
    }],
    supremeAdmin: {
        type: String, // Email of the supreme admin
        required: true
    },
    admins: [{
        type: String // List of emails of other admins
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

clubSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Club', clubSchema);
