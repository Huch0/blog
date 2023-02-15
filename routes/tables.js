const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");


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
    const deleted_posts = await Post.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null
        }
      },
      paranoid: false
    });

    
    let test = '';
    
    //console.log(category);
    

    res.render('tables', { users, posts, categories_1, categories_2, deleted_posts, test });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



router.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;
