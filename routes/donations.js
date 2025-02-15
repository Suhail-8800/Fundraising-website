const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

router.get('/:referralCode', (req, res) => {
    const { referralCode } = req.params;
    res.render('donation', { referralCode });
});

router.post('/', (req, res) => {
    const { donorName, donationAmount, referralCode } = req.body;
    const newDonation = new Donation({ donorName, donationAmount, referralCode });
    newDonation.save()
        .then(() => res.redirect(`/transactions/${referralCode}`))
        .catch(err => console.log(err));
});

module.exports = router;