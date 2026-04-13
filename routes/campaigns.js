const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Donation = require('../models/donation');

// Middleware to ensure authentication for protected routes
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    next();
}

// Create Campaign
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { title, description, goalAmount } = req.body;
        
        // Validation Checks
        if (!title || !title.trim() || !description || !description.trim() || !goalAmount) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        if (isNaN(goalAmount) || goalAmount < 100) {
            return res.status(400).json({ success: false, message: "Goal amount must be at least ₹100." });
        }

        let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = "campaign";
        let slug = baseSlug;
        let isUnique = false;
        
        while (!isUnique) {
            const existing = await Campaign.findOne({ slug });
            if (existing) {
                const shortId = Math.random().toString(36).substring(2, 6);
                slug = `${baseSlug}-${shortId}`;
            } else {
                isUnique = true;
            }
        }

        const campaign = new Campaign({
            userId: req.session.user._id,
            title: title.trim(),
            description: description.trim(),
            goalAmount,
            slug,
            isActive: true
        });

        await campaign.save();
        res.status(200).json({ success: true, message: "Campaign created successfully!", slug });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error creating campaign. Please try again." });
    }
});

// Analytics Endpoint
router.get('/analytics/:id', requireAuth, async (req, res) => {
    try {
        const campaignId = req.params.id;
        
        // Verify ownership
        const campaign = await Campaign.findOne({ _id: campaignId, userId: req.session.user._id });
        if (!campaign) return res.status(403).json({ success: false, message: "Forbidden. Campaign not found or you don't own it." });

        // Aggregate donations grouped by day
        const analytics = await Donation.aggregate([
            { $match: { campaignId: campaign._id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$donationDate" } },
                    totalAmount: { $sum: "$donationAmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.status(200).json({ success: true, analytics });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error fetching analytics." });
    }
});

module.exports = router;
