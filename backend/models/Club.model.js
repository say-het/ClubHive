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



// const mongoose = require('mongoose');
// const Msg = require("../models/Msg.model");

// const clubSchema = new mongoose.Schema({
//     clubUniqueName: {
//         type: String,
//         // required: true,
//         // unique: true
//     },
//     name: {
//         type: String,
//         // required: true,
//         // unique: true
//     },
//     universityName: {
//         type: String,
//         required: true
//     },
//     members: [
//         {
//             name: {
//                 type: String,
//                 required: true
//             },
//             email: {
//                 type: String,
//                 required: true
//             },
//             role: {
//                 type: String,
//                 enum: ['admin', 'member', 'moderator'],  // Possible roles
//                 default: 'member'
//             },
//             tags: {
//                 type: [String],  // Tags for special members
//                 default: []
//             }
//         }
//     ],
//     creator: {
//         name: {
//             type: String,
//             required: true
//         },
//         email: {
//             type: String,
//             required: true
//         }
//     },
//     messages: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Msg'
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Set the updatedAt field before saving the document
// clubSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// // Method to add a new admin
// clubSchema.methods.addAdmin = function (email) {
//     const member = this.members.find(m => m.email === email);
//     if (member) {
//         member.role = 'admin';  // Change member's role to admin
//         this.updatedAt = Date.now(); // Update timestamp
//         return this.save();
//     } else {
//         throw new Error('Member not found');
//     }
// };

// // Method to remove admin role
// clubSchema.methods.removeAdmin = function (email) {
//     const member = this.members.find(m => m.email === email);
//     if (member && member.role === 'admin') {
//         member.role = 'member';  // Change admin's role to member
//         this.updatedAt = Date.now(); // Update timestamp
//         return this.save();
//     } else {
//         throw new Error('Admin not found');
//     }
// };

// // Method to assign tags to a member
// clubSchema.methods.assignTags = function (email, tags) {
//     const member = this.members.find(m => m.email === email);
//     if (member) {
//         member.tags = tags;  // Assign tags to member
//         this.updatedAt = Date.now(); // Update timestamp
//         return this.save();
//     } else {
//         throw new Error('Member not found');
//     }
// };

// module.exports = mongoose.model('Club', clubSchema);
