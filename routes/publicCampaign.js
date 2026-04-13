const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Donation = require('../models/donation');

router.get('/:slug', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ slug: req.params.slug, isActive: true });
        
        if (!campaign) {
            return res.status(404).send("Campaign not found or is inactive.");
        }

        // Fetch recent messages for Wall of Support
        const recentDonations = await Donation.find({ campaignId: campaign._id })
            .sort({ donationDate: -1 })
            .limit(20)
            .select('donorName donationAmount message donationDate');

        // Calculate current progress
        const totals = await Donation.aggregate([
            { $match: { campaignId: campaign._id } },
            { $group: { _id: null, total: { $sum: "$donationAmount" }, count: { $sum: 1 } } }
        ]);

        const totalRaised = totals.length > 0 ? totals[0].total : 0;
        const totalDonors = totals.length > 0 ? totals[0].count : 0;

        res.render('donation', {
            campaign,
            totalRaised,
            totalDonors,
            recentDonations,
            key: process.env.RAZORPAY_KEY_ID,
            user: req.session.user || null // Keep track if they are logged in globally
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading campaign");
    }
});

module.exports = router;
