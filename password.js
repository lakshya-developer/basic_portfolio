const bcrypt = require('bcrypt');

// Store this securely in a database
const hashedPassword = '$2b$10$E9e5hIfJXeW9ALYV9aFcuuFi3bUokRQYmEzZ0YlymrT6MnlvAOZbW'; // hash of 'admin123'

module.exports = hashedPassword;