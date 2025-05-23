const mongoose = require('mongoose');

// Define the schema for a User
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
    trim: true,
    minlength: 3 // Minimum length for username
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures emails are unique
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  message: { // In a real app, you'd hash this!
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model from the schema
const User = mongoose.model('message', messageSchema);

// Export the User model so it can be imported and used in other files
module.exports = User;
