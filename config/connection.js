const mongoose = require('mongoose');

// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/usersDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose.connection;