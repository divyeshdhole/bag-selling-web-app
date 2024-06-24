const express = require('express');
const router = express.Router();

// Define routes
router.get('/users', (req, res) => {
    res.send('This is the users route');
});

module.exports = router;
