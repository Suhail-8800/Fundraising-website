const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const Razorpay = require('razorpay');

// 🔹 Init Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 🔹 Show Donation Page
router.get('/:referralCode', (req, res) => {
    res.render('donation', {
        referralCode: req.params.referralCode,
        key: process.env.RAZORPAY_KEY_ID
    });
});

// 🔹 Create Razorpay Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // ₹ to paise
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating order");
    }
});

// 🔹 Verify Payment & Save
router.post('/verify', async (req, res) => {
    try {
        const { donorName, donationAmount, referralCode, paymentId } = req.body;

        const donation = new Donation({
            donorName,
            donationAmount,
            referralCode,
            paymentId
        });

        await donation.save();

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving donation");
    }
});

module.exports = router;