# 🚀 Fundraising Website

A full-stack **Fundraising Platform** that allows users to create personalized donation links, track contributions, and receive payments via Razorpay.

---

## 📌 Overview

This project enables users to:

* Supports multi user
* Generate a unique fundraising link
* Share it with others (WhatsApp)
* Accept secure payments via Razorpay
* Track total donations and donors in a dashboard

---

## 🛠️ Tech Stack

### 🔹 Frontend

* HTML
* CSS (TailwindCSS)
* JavaScript
* EJS (Embedded JavaScript Templates)

### 🔹 Backend

* Node.js
* Express.js

### 🔹 Database

* MongoDB (MongoDB Atlas)

### 🔹 Payment Gateway

* Razorpay API

### 🔹 Deployment (Previously)

* AWS EC2 (Free Tier - Experimental)

---

## 📂 Project Structure

```
Fundraising-website/
│
├── models/
│   └── donation.js
│
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── donations.js
│   └── transactions.js
│
├── views/
│   ├── dashboard.ejs
│   ├── index.ejs
│   ├── login.ejs
│   └── register.ejs
│
├── public/
│   └── (static files)
│
├── app.js
├── package.json
└── .env
```

---

## ⚙️ Features

### ✅ User Authentication

* Register & Login system
* Session-based authentication

### ✅ Dashboard

* View total donations
* View total donors
* Personalized referral link generation

### ✅ Fundraising Link

* Unique link per user
* Shareable via WhatsApp

### ✅ Payment Integration

* Razorpay payment gateway
* Secure payment handling

### ✅ Transactions

* Track all donations made through referral link

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
BASE_URL=http://localhost:3000
SESSION_SECRET=your_secret
PORT=3000
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Suhail-8800/Fundraising-website.git
cd Fundraising-website
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Setup environment variables

Create `.env` file (see above)

### 4️⃣ Run the application

```
node app.js
```

### 5️⃣ Open in browser

```
http://localhost:3000
```

---

## 💳 Payment Flow

1. User generates referral link
2. Donor opens link
3. Razorpay popup opens
4. Payment is completed
5. Donation is stored in MongoDB
6. Dashboard updates automatically

---

## 🌐 Deployment

Previously deployed on AWS EC2 (Free Tier).
Can be deployed on:

* Render (Recommended - Free)
* Railway
* AWS EC2

---

## 🧠 Learning Outcomes

* Full-stack web development
* Payment gateway integration
* Session-based authentication
* Cloud deployment (AWS)
* Debugging real-world production issues

---

## 📌 Future Improvements

* Email notifications
* Admin panel
* Campaign customization
* Leaderboard for top donors
* Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

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
