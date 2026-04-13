const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Donation = require('../models/donation');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const user = req.session.user;

        // Perform aggressive aggregation to fetch all campaigns and their stats simultaneously
        const campaignsData = await Campaign.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(user._id) } },
            {
                $lookup: {
                    from: 'donations',
                    localField: '_id',
                    foreignField: 'campaignId',
                    as: 'donations'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    goalAmount: 1,
                    slug: 1,
                    isActive: 1,
                    createdAt: 1,
                    totalDonors: { $size: "$donations" },
                    totalRaised: { $sum: "$donations.donationAmount" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        // Calculate global amounts from aggregated campaigns
        const totalDonations = campaignsData.reduce((sum, c) => sum + c.totalRaised, 0);
        const totalDonors = campaignsData.reduce((sum, c) => sum + c.totalDonors, 0);
        const baseUrl = process.env.BASE_URL || "http://localhost:3000";

        res.render('dashboard', {
            user,
            totalDonations,
            totalDonors,
            campaigns: campaignsData,
            baseUrl
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading dashboard");
    }
});

module.exports = router;