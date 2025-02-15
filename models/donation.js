const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: String,
    donationAmount: Number,
    donationDate: { type: Date, default: Date.now },
    referralCode: String
});

module.exports = mongoose.model('Donation', donationSchema);