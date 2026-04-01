const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: {
        type: String,
        required: true
    },
    donationAmount: {
        type: Number,
        required: true
    },
    donationDate: {
        type: Date,
        default: Date.now
    },
    referralCode: {
        type: String,
        required: true
    },
    paymentId: {
        type: String, // for Razorpay later
        default: null
    }
});

module.exports = mongoose.model('Donation', donationSchema);