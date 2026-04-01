const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
const Razorpay = require('razorpay');
const crypto = require("crypto");

// 🔹 Init Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// 🔹 Show Donation Page (Login Required)
router.get('/:referralCode', (req, res) => {

    if (!req.session.user) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/login');
    }

    res.render('donation', {
        referralCode: req.params.referralCode,
        key: process.env.RAZORPAY_KEY_ID,
        user: req.session.user
    });
});


// 🔹 Create Razorpay Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;

        // 🔒 Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

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


// 🔹 Verify Payment & Save Donation
router.post('/verify', async (req, res) => {
    try {
        const {
            donorName,
            donationAmount,
            referralCode,
            paymentId,
            orderId,
            signature
        } = req.body;

        // 🔒 Validate all fields
        if (!donorName || !donationAmount || !referralCode || !paymentId || !orderId || !signature) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        // 🔐 Generate expected signature
        const body = orderId + "|" + paymentId;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        // ❌ If signature invalid
        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid payment" });
        }

        // 🚫 Prevent duplicate entries
        const existingDonation = await Donation.findOne({ paymentId });

        if (existingDonation) {
            return res.json({ success: true, message: "Already recorded" });
        }

        // ✅ Save donation
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
        res.status(500).send("Error verifying payment");
    }
});


module.exports = router;