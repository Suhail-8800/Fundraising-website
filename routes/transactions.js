const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const Campaign = require('../models/Campaign');

// 🔹 Transactions Page (All Campaigns)
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const user = req.session.user;

        // Fetch all campaigns owned by the user
        const campaigns = await Campaign.find({ userId: user._id }).select('_id');
        const campaignIds = campaigns.map(c => c._id);

        // Fetch donations belonging to this user's campaigns (or legacy referral code)
        const query = [];
        if (campaignIds.length > 0) query.push({ campaignId: { $in: campaignIds } });
        if (user.referralCode) query.push({ referralCode: user.referralCode });

        let donations = [];
        if (query.length > 0) {
            donations = await Donation.find({ $or: query })
                .populate('campaignId', 'title') // populate title if needed
                .sort({ donationDate: -1 }); // latest first
        }

        res.render('transactions', { donations, user });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading transactions");
    }
});

module.exports = router;