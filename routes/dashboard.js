

const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');


// 🔹 Dashboard Route
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const user = req.session.user;

        let totalDonations = 0;
        let totalDonors = 0;
        let referralLink = "";

        // ✅ Generate referral link
        if (user.referralCode) {
            const baseUrl = process.env.BASE_URL || "http://localhost:3000";
            referralLink = `${baseUrl}/donations/${user.referralCode}`;

            const donations = await Donation.find({
                referralCode: user.referralCode
            });

            totalDonations = donations.reduce((sum, d) => sum + d.donationAmount, 0);
            totalDonors = donations.length;
        }

        res.render('dashboard', {
            user,
            totalDonations,
            totalDonors,
            referralLink   // ✅ send to frontend
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading dashboard");
    }
});

module.exports = router;