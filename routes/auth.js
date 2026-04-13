const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔹 Response Helper
const sendResponse = (req, res, success, message, redirectUrl = null) => {
    const isAjax = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
    if (isAjax) {
        return res.status(success ? 200 : 400).json({ success, message, redirect: redirectUrl });
    }
    if (!success) {
        return res.status(400).send(`Error: ${message}. <a href="javascript:history.back()">Go back</a>`);
    }
    if (redirectUrl) return res.redirect(redirectUrl);
    res.redirect("/");
};

// 🔹 Signup Page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// 🔹 Signup Logic
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, referral } = req.body;

        // Backend Validation
        if (!name || !name.trim() || !email || !email.trim() || !password) {
            return sendResponse(req, res, false, "All fields are required.");
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return sendResponse(req, res, false, "Invalid email address format.");
        }
        if (password.length < 6) {
            return sendResponse(req, res, false, "Password must be at least 6 characters.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(req, res, false, "Email is already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword
        });

        await user.save();

        if (referral) console.log("User signed up via referral:", referral);

        req.session.user = user;
        return sendResponse(req, res, true, "Account created successfully", "/dashboard");

    } catch (err) {
        console.error(err);
        return sendResponse(req, res, false, "Internal server error during signup");
    }
});

// 🔹 Login
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(req, res, false, "Email and password are required.");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(req, res, false, "Invalid email or password.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(req, res, false, "Invalid email or password.");
        }

        req.session.user = user;

        const redirectTo = req.session.redirectTo || "/dashboard";
        delete req.session.redirectTo;

        return sendResponse(req, res, true, "Logged in successfully", redirectTo);
    } catch (err) {
        console.error(err);
        return sendResponse(req, res, false, "Internal server error during login");
    }
});

// 🔹 Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;