# Fundraising Website

A professional crowdfunding platform built with Node.js, Express, MongoDB and Razorpay.

This project enables campaign creators to launch fundraising campaigns, share donation pages, collect secure payments, and monitor donation activity via a dashboard.

---

## Problem Statement

Many individuals and small organizations need an easy-to-use platform to collect donations for causes, events, or campaigns without building payment and tracking workflows from scratch.

Existing tools can be expensive, difficult to manage, or lack campaign-level analytics, secure payment verification, and transparent donor history.

## Solution

This application delivers a full-stack fundraising experience with:

* User registration and session-based authentication
* Campaign creation with unique public donation pages
* Razorpay integration for secure Indian payments
* Donation verification and duplicate payment protection
* Donation history and campaign analytics

---

## Key Features

### Campaign & Fundraising

* Create fundraising campaigns with title, description, and target goal
* Automatically generate unique slugs for public campaign pages
* Public donation page for each active campaign
* Track campaign progress with raised amount and donor count

### Payment Workflow

* Razorpay order creation for each donation
* HMAC signature verification using secret key
* Persistent donation records stored in MongoDB
* Duplicate payment detection to prevent repeated recording

### User Experience

* Register / login with password hashing via `bcryptjs`
* Session management with `express-session`
* Personalized dashboard with campaign metrics
* Transactions page showing donation history
* Recent donor messages shown on campaign pages

### Analytics & Reporting

* Dashboard aggregates total donations and total donors
* Campaign-specific analytics endpoint for daily donation summaries
* Transaction listing for all donations across a user’s campaigns

---

## Tech Stack

* Node.js
* Express.js
* MongoDB with Mongoose
* EJS templating engine
* Razorpay payments
* bcryptjs for password hashing
* express-session for authentication state
* dotenv for environment configuration
* body-parser for form handling

---

## Project Structure

```
Fundraising-website/
├── app.js
├── package.json
├── README.md
├── .env
├── models/
│   ├── Campaign.js
│   ├── donation.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── campaigns.js
│   ├── dashboard.js
│   ├── donations.js
│   ├── publicCampaign.js
│   └── transactions.js
├── views/
│   ├── dashboard.ejs
│   ├── donation.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── transactions.ejs
│   └── partials/
├── public/
│   ├── css/
│   └── js/
└── migrate.js
```

---

## Implementation Details

### app.js

* Configures Express application and middleware
* Serves static assets from `public/`
* Uses `ejs` as the view engine
* Loads route modules for authentication, dashboard, donations, transactions, and campaigns
* Connects to MongoDB using `mongoose`

### Models

* `User` — stores user name, email, hashed password, and referral code
* `Campaign` — stores user-owned campaign metadata, target amount, slug, and active status
* `Donation` — stores donor name, amount, message, campaign reference, payment ID, and timestamp

### Routes

* `routes/auth.js` — signup, login, logout, session handling
* `routes/dashboard.js` — user dashboard with aggregated campaign stats
* `routes/campaigns.js` — campaign creation and analytics endpoints
* `routes/publicCampaign.js` — public donation page, order creation, and payment verification
* `routes/donations.js` — Razorpay order generation and donation verification
* `routes/transactions.js` — donation history listing for logged-in users

---

## Environment Variables

Create a `.env` file at the project root containing:

```env
MONGO_URI=<your_mongodb_connection_string>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
BASE_URL=http://localhost:3000
SESSION_SECRET=<your_session_secret>
PORT=3000
```

> `BASE_URL` is used to construct campaign share and redirect links. Adjust for production deployment.

---

## Installation & Run Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Fundraising-website.git
cd Fundraising-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create `.env` and add the required variables listed above.

### 4. Start the application

```bash
npm start
```

### 5. Open the web app

Visit:

```text
http://localhost:3000
```

---

## Usage Workflow

1. Open the app and sign up as a campaign creator
2. Create a campaign from the dashboard with title, description, and goal amount
3. Share the campaign URL with donors
4. Donors use the public donation page to complete payment via Razorpay
5. Donations are verified and stored in MongoDB
6. View totals, recent donors, and transaction history in the dashboard

---

## Future Goals

* Add email notifications and receipts for donors
* Build an admin interface for campaign moderation
* Add campaign categories and search filtering
* Improve analytics with charts and exportable reports
* Add mobile-first UI and PWA support
* Add automated tests for routes and payment validation

---

## Notes

* Payment signature verification is handled in `routes/publicCampaign.js`.
* Campaign slugs are generated uniquely using title normalization and collision handling.
* The app uses session authentication rather than JWT for simplicity and server-side security.

---

## Contribution

Contributions are welcome. Please fork the repository, make improvements, and open a pull request.

## License

This project is released under the ISC License.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Suhail Rajput**

* 📧 Email: [suhailrajput325@gmail.com](mailto:suhailrajput325@gmail.com)
* 💼 LinkedIn: https://www.linkedin.com/in/suhail-rajput-64158722b/
* 💻 GitHub: https://github.com/Suhail-8800

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it with others!
