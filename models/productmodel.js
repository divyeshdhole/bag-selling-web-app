const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    bgcolor: String,
    panelColor: String,
    textColor: String


});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;