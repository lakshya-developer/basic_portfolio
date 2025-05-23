
// External Module
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Message = require("./models/message");
const session = require('express-session');
const password = require('./password')


const mongoURL = 'mongodb://localhost:27017/portfolio_contact';


mongoose.connect(mongoURL)
  .then(() => console.log('MongoDB connected successfully from app.js!'))
  .catch(err => console.error('MongoDB connection error from app.js:', err));



// Example usage of the User model:
async function createMessage(name, email, message) {
  try {
    const newMessage = new Message({
      name,
      email,
      message
    });
    await newMessage.save();
    console.log('New user saved:', newMessage);
    return newMessage;
  } catch (error) {
    console.error('Error saving user:', error.message);
    // Handle specific validation errors
    if (error.code === 11000) { // Duplicate key error (for unique fields like username, email)
      console.error('Duplicate user/email found.');
    }
    throw error; // Re-throw to propagate the error
  }
}

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Adding middleware 
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());

app.post('/submit-contact', (req, res) => {
  const { name, email, message } = req.body; // Extract data from the request body

  console.log('--- New Contact Form Submission ---');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log('-----------------------------------');

  createMessage(name, email, message);

  // Send a success response back to the client
  res.status(200).json({ success: true, message: 'Message received successfully!' });

  // In case of an error (e.g., database save failed), you would send:
  // res.status(500).json({ success: false, message: 'Failed to send message.' });
});

// Using session to protect admin.html

app.use(
  session({
    secret: 'KaKaShI@106_JiraiyA',
    resave: false,
    saveUninitialized: false
  })
)

// server login page.
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

// Handle login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded auth check (use DB in real apps)
  if (username == 'admin' & password === password) {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.send('Invalid credentials. <a href="/login">Try again</a>');
  }

});

// Middleware to protect admin route
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/admin', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
})

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});