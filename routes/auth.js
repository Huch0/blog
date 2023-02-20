const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./is_logged_in');
const User = require('../models/user');

const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

router.get('/user_table', async (req, res) => {
    const users = await User.findAll();
    const user_table = {};
    users.forEach(user => {
        user_table[user.id] = user.nick;
    });
    res.json(user_table);
});

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);



module.exports = router;