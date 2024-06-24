const express = require('express');
const router = express.Router();

// Define routes
router.get('/products', (req, res) => {
    res.send('This is the product route');
});

module.exports = router;
