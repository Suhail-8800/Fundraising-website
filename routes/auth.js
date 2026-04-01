const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Generate referral code
function generateReferralCode(name) {
    return name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
}

// 🔹 Signup Page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// 🔹 Signup Logic
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, referral } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ No referral code generated here
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // 🔹 If user came via referral link
        if (referral) {
            console.log("User signed up via referral:", referral);

            // 👉 Future: reward system / tracking can be added here
        }

        req.session.user = user;

        res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Error in signup");
    }
});

// 🔹 Generate Referral Code ONLY when user wants to share
router.get("/generate-referral", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        let user = await User.findById(req.session.user._id);

        // Generate only if not exists
        if (!user.referralCode) {
            const referralCode = generateReferralCode(user.name);
            user.referralCode = referralCode;
            await user.save();
        }

        // Update session
        req.session.user = user;

        res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Error generating referral");
    }
});

// 🔹 Login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Invalid credentials");
        }

        req.session.user = user;

        const redirectTo = req.session.redirectTo || "/dashboard";
        delete req.session.redirectTo;

        res.redirect(redirectTo);
    } catch (err) {
        console.log(err);
        res.send("Error in login");
    }
});

// 🔹 Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;