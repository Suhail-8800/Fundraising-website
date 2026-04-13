require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Donation = require('./models/donation');
const Campaign = require('./models/Campaign');

async function runMigration() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Starting migration...");

        const users = await User.find();
        let migratedCount = 0;

        for (const user of users) {
            if (user.referralCode) {
                // Check if default campaign already exists
                const existing = await Campaign.findOne({ slug: user.referralCode });
                let campaignId;

                if (!existing) {
                    const defaultCampaign = new Campaign({
                        userId: user._id,
                        title: `${user.name}'s Fundraiser`,
                        description: `Support ${user.name}'s fundraising campaign. Every contribution helps make a difference!`,
                        goalAmount: 100000, // Default 1 lakh
                        slug: user.referralCode,
                        isActive: true
                    });
                    const saved = await defaultCampaign.save();
                    campaignId = saved._id;
                    console.log(`Created campaign for ${user.name}`);
                } else {
                    campaignId = existing._id;
                }

                // Update donations
                const res = await Donation.updateMany(
                    { referralCode: user.referralCode, campaignId: { $exists: false } },
                    { $set: { campaignId: campaignId } }
                );
                migratedCount += res.modifiedCount;
            }
        }

        console.log(`Migration completed. Updated ${migratedCount} donations.`);
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        mongoose.connection.close();
    }
}

runMigration();
