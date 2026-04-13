const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Donation = require('../models/donation');

// Middleware to ensure authentication for protected routes
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

// Create Campaign
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { title, description, goalAmount } = req.body;
        
        let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
            title,
            description,
            goalAmount,
            slug,
            isActive: true
        });

        await campaign.save();
        res.status(200).json({ success: true, slug });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating campaign" });
    }
});

// Analytics Endpoint
router.get('/analytics/:id', requireAuth, async (req, res) => {
    try {
        const campaignId = req.params.id;
        
        // Verify ownership
        const campaign = await Campaign.findOne({ _id: campaignId, userId: req.session.user._id });
        if (!campaign) return res.status(403).json({ error: "Forbidden" });

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

        res.json(analytics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching analytics" });
    }
});

// Public Campaign Router Handled elsewhere or here?
// Actually, I'll mount this router on /campaigns. 
// Public url will be handled in app.js natively or a separate router.

module.exports = router;
