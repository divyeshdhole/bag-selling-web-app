const express = require('express');
const router = express.Router();
const Owner = require('../models/ownermodel');
// Define routes
router.post('/owners', (req, res) => {
    
    const createOwner = new Owner({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password

    })
    res.send(createOwner.save());
    // res.send('This is the owners route');
});
router.get("/owners", function(req, res) {
    Owner.find()
    .then(function(owners) {
        if (owners) return res.status(404).send('No owners found');
    
        res.send(owners);
    })
})

module.exports = router;
