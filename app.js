const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require("express-session");

require('dotenv').config();

// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE (ORDER MATTERS)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "fundraising-secret",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

// ✅ ROUTES IMPORT
const authRoutes = require("./routes/auth");
const dashboardRoutes = require('./routes/dashboard');
const donationRoutes = require('./routes/donations');
const transactionRoutes = require('./routes/transactions');
const campaignRoutes = require('./routes/campaigns');
const publicCampaignRoutes = require('./routes/publicCampaign');

// ✅ ROUTES USE
app.use("/", authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/donations', donationRoutes);
app.use('/transactions', transactionRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/c', publicCampaignRoutes);

// ✅ HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// ✅ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ 404 CATCH-ALL
app.use((req, res, next) => {
    res.status(404).render('404', { user: req.session ? req.session.user : null });
});

// ✅ 500 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.message);
    res.status(500).render('500', { user: req.session ? req.session.user : null });
});

// ✅ SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});