
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    order: {
        type: Array,
        default: []
    },
    
    contact: String,
    picture: String


});

const User = mongoose.model('User', userSchema);

module.exports = User;