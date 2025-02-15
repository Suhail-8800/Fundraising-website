const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

router.get('/:referralCode', (req, res) => {
    const { referralCode } = req.params;
    Donation.find({ referralCode })
        .then(donations => res.render('transactions', { donations }))
        .catch(err => console.log(err));
});

module.exports = router;