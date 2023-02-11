const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Category_1 = require('../models/category_1');
const Category_2 = require('../models/category_2');

router.get('/database', async (req, res) => {
  try {
    const users = await User.findAll();
    const posts = await Post.findAll();
    const categories_1 = await Category_1.findAll();
    const categories_2 = await Category_2.findAll();

    //console.log(posts);

    res.render('tables', { users: users, posts: posts, categories_1: categories_1, categories_2: categories_2 });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const createCategory_2 = async (name) => {
  try {
    await Category_2.create({
      name: name
    });
    console.log('Category_2 created successfully');
  } catch (error) {
    console.error(error);
  }
};

router.post('/createCategory_2', async (req, res) => {
  try {
    createCategory_2(req.body.name);
    res.redirect('/tables/database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});


router.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;
