const mongoose = require('mongoose');


// Define schema

const ownerSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    
    contact: String,
    picture: String,
    gstin: Number

});

const Owner = mongoose.model('Owner', userSchema);

module.exports = Owner;