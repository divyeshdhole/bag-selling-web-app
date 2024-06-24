const express = require('express');
const router = express.Router();

// Define routes
router.get('/owners', (req, res) => {
    res.send('This is the owners route');
});

module.exports = router;
