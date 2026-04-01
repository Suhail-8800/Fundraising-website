const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

// 🔹 Transactions Page
router.get('/:referralCode', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const { referralCode } = req.params;

        // 🔒 Security: ensure user can only see their own data
        if (req.session.user.referralCode !== referralCode) {
            return res.send("Unauthorized access");
        }

        const donations = await Donation.find({ referralCode })
            .sort({ donationDate: -1 }); // latest first

        res.render('transactions', { donations });

    } catch (err) {
        console.log(err);
        res.send("Error loading transactions");
    }
});

module.exports = router;