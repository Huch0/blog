const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./is_logged_in');
const { Post, User, Category_2 } = require('../models');

function format_date(date_str) {
    let date = new Date(date_str);
    let formattedDate = date.getFullYear() + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
    return formattedDate;
}

const router = express.Router();

router.use((req, res, next) => {
    res.locals.message = "Test message";
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

router.get('/Code', async (req, res) => {
    const { subcategory, page } = req.query;
    // db 구조 바꾸고나서 main category = Code로 정해야됨.

    const limit = 8; // number of posts to retrieve per page
 

    const offset = page ? (parseInt(page) - 1) * limit : 0;

    // define the where clause based on the subcategory
    let where = { deletedAt: null };
    // db 구조 바꾸고나서 maincategory도 where에 포함 시켜야됨.

    let subcategory_id = null;
    if (subcategory && subcategory !== 'All') {
        const data = await Category_2.findOne({
            where: {
                name : subcategory
            }
        });
        subcategory_id = data.id;
        //console.log('hey I am activated', subcategory, subcategory_id);
    };
    if (subcategory_id) {
        //where.subcategory = subcategory;
        where.Category2Id = subcategory_id;
    }

    const posts = await Post.findAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        include: [{ model: User }],
    });
    const res_posts = JSON.stringify(posts);

    const post_count = await Post.count({ where });

    res.render('category_home', { category: 'Code', res_posts, post_count, subcategory, page });
});

router.get('/english_home', (req, res) => {
    res.render('category_home', { category: 'English' });
});
router.get('/math_home', (req, res) => {
    res.render('category_home', { category: 'Math' });
});
router.get('/toilet_home', (req, res) => {
    res.render('category_home', { category: 'Toilet' });
});


router.get('/editor/:type', isLoggedIn, (req, res) => {

    const type = req.params.type;
    if (type === 'edit') {
        res.render('editor', { title: 'edit' });
    } else {
        res.render('editor', { title: 'post' });
    };
    //res.render('editor', { title: '작성' });
});

router.get('/post/:id', (req, res) => {
    post_id = req.params.id;
    console.log('GET /post/:id ROUTER STARTED', post_id);


    // Find the post in the database using the "id" value
    Post.findOne({ where: { id: post_id } })
        .then((post) => {
            console.log('/post/' + post_id);


            User.findOne({ where: { id: post.UserId } })
                .then((user) => {
                    res.render('post', { id: post.id, author_id: post.UserId, author: user.nick, date: format_date(post.createdAt), title: post.title, description: post.description, thumbnail_url: post.thumbnail_url, post_path: './posts/' + post_id + '.html' });
                })
                .catch((error) => {
                    console.error(error);

                });


        })
        .catch((error) => {
            console.error(error);
        });
    // If the post is found, define the post path
});



router.get('/', async (req, res, next) => {
    try {
        /*
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        */
        res.render('home', {
            title: 'LiFE',
            //posts: posts,
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
