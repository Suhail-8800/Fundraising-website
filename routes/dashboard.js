const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Fetch user data and render dashboard
    const user = {
        name: 'John Doe',
        referralCode: 'REF123'
    };
    res.render('dashboard', { user });
});

module.exports = router;