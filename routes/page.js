const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./is_logged_in');
const { Post, User, Category_2 } = require('../models');
const { Op } = require('sequelize');

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

router.get('/home/:category', async (req, res) => {
    category = req.params.category;
    const { subcategory, page, search_type, search_term } = req.query;
    console.log("\nLOG / subcategory, page, search_type, search_term : ", subcategory, page, search_type, search_term);

    const limit = 8; // number of posts to retrieve per page
 

    const offset = page ? (parseInt(page) - 1) * limit : 0;

    // define the where clause based on the subcategory
    let where = { deletedAt: null };
    // db 구조 바꾸고나서 maincategory도 where에 포함 시켜야됨.

    let subcategory_id = null;
    if (subcategory) {
        const data = await Category_2.findOne({
            where: {
                name : subcategory
            }
        });
        if (data) 
            subcategory_id = data.id;
        //console.log('hey I am activated', subcategory, subcategory_id);
    };
    if (subcategory_id) {
        //where.subcategory = subcategory;
        where.Category2Id = subcategory_id;
    }

    if (search_type && search_term) {
        if (search_type === '제목') {
            where.title = { [Op.like]: `%${search_term}%` };
        } else if (search_type === '작성자') {
            const user = await User.findOne({
                where: {
                    nick: { [Op.like]: `%${search_term}%` }
                }
            });
            if (user)
                where.UserId = user.id;
        }
    }

    console.log('LOG / where : ', where);
    const posts = await Post.findAll({
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        include: [{ model: User }],
    });
    const res_posts = JSON.stringify(posts);

    const post_count = await Post.count({ where });

    res.render('category_home', { category, res_posts, post_count, subcategory, page });
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

router.get('/post/:id', async (req, res) => {
  const post_id = req.params.id;
  console.log('GET /post/:id ROUTER STARTED', post_id);

  try {
    // Find the post in the database using the "id" value
    const post = await Post.findOne({ where: { id: post_id } });
    console.log('/post/' + post_id);

    // Find the previous post
    const previousPost = await Post.findOne({ where: { id: { [Op.lt]: post_id } }, order: [['id', 'DESC']] });

    // Find the next post
    const nextPost = await Post.findOne({ where: { id: { [Op.gt]: post_id } }, order: [['id', 'ASC']] });

    const user = await User.findOne({ where: { id: post.UserId } });

    res.render('post', { 
      id: post.id, 
      author_id: post.UserId, 
      author: user.nick, 
      date: format_date(post.createdAt), 
      title: post.title, 
      description: post.description, 
      thumbnail_url: post.thumbnail_url, 
      post_path: './posts/' + post_id + '.html',
      prev_id: previousPost ? previousPost.id : null,
      prev_title: previousPost ? previousPost.title : null,
      prev_description: previousPost ? previousPost.description : null,
      prev_author: previousPost ? previousPost.UserId : null,
      prev_date: previousPost ? format_date(previousPost.createdAt) : null,
      next_id: nextPost ? nextPost.id : null,
      next_title: nextPost ? nextPost.title : null,
      next_description: nextPost ? nextPost.description : null,
      next_author: nextPost ? nextPost.UserId : null,
      next_date: nextPost ? format_date(nextPost.createdAt) : null,
    });
  } catch (error) {
    console.error(error);
  }
});




router.get('/', async (req, res, next) => {
    console.log('\nhome Router Activated');
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
