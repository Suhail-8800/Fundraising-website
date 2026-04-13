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
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: false // Optional for legacy records
    },
    message: {
        type: String,
        default: "",
        maxlength: 300
    },
    referralCode: {
        type: String,
        required: false // Legacy
    },
    paymentId: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Donation', donationSchema);