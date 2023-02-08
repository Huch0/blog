const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./is_logged_in');
const { Post, User } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.message = "Test message"
    res.locals.user = req.user;
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    // 프로필 페이지
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입' });
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', { title: '로그인' });
});

router.get('/getLicenseKey', isLoggedIn, (req, res) => {
    res.json({ licenseKey: process.env.CKEDITOR_LICENSE });
});

router.get('/programming_home', (req, res) => {
    res.render('programming_home', { title: '프로그래밍' });
});

router.get('/post', (req, res) => {
    //DB 구현 후 , DB에서 게시글 경로를 불러옴.
    post_path = "./posts/1.html"
    
    res.render('post', { title: '게시글', post_path: post_path });
});

router.get('/editor', isLoggedIn,  (req, res) => {
    res.render('editor', { title: '글작성' });
});

router.get('/:id', (req, res) => {
    post_id = req.params.id;

    //DB 구현 후 , DB에서 게시글 경로를 불러옴.
    post_path = "./posts/programming/1.html"
    
    res.render('post', { title: '게시글', post_path: post_path });
});



router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('home', {
            title: 'LiFE',
            posts: posts,
        });
    } catch (errror) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
