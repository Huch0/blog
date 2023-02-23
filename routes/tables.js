const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");


const User = require('../models/user');
const Post = require('../models/post');
const Maincategory = require('../models/main_category');
const Subcategory = require('../models/sub_category');


router.get('/database', async (req, res) => {
  try {
    const users = await User.findAll();
    const posts = await Post.findAll();
    const main_categories = await Maincategory.findAll();
    const sub_categories = await Subcategory.findAll();
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
    

    res.render('tables', { users, posts, main_categories, sub_categories, deleted_posts, test });
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
