const mongoose = require('mongoose');

// Define the schema for a User
const messageSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: false,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    message: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model from the schema
const message = mongoose.model('message', messageSchema);

// Export the User model so it can be imported and used in other files
module.exports = message;