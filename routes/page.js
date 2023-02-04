const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./is_logged_in');

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
    // 회원가입 페이지
});

router.get('/getLicenseKey', isLoggedIn, (req, res) => {
    res.json({ licenseKey: process.env.CKEDITOR_LICENSE });
});

router.get('/programming_home', (req, res) => {
    res.render('programming_home', { title: '프로그래밍' });
});

router.get('/post', (req, res) => {
    //DB 구현 후 , DB에서 게시글 경로를 불러옴.
    post_path = "./posts/programming/1.html"
    
    res.render('post', { title: '게시글', post_path: post_path });
});

router.get('/editor',  (req, res) => {
    res.render('editor', { title: '글작성' });
});

router.get('/:id', (req, res) => {
    post_id = req.params.id;

    //DB 구현 후 , DB에서 게시글 경로를 불러옴.
    post_path = "./posts/programming/1.html"
    
    res.render('post', { title: '게시글', post_path: post_path });
});



router.get('/', (req, res, next) => {
    const posts = [];
    res.render('home', {
        title: 'LiFE',
        posts,
    });
});

module.exports = router;
