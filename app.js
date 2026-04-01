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

// ✅ ROUTES USE
app.use("/", authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/donations', donationRoutes);
app.use('/transactions', transactionRoutes);

// ✅ HOME ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// ✅ MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});