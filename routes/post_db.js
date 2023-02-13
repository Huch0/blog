const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post } = require("../models");
const { isLoggedIn } = require('./is_logged_in');
const { hash } = require('bcrypt');
const { post } = require('./page');
const { title } = require('process');

const Category_2 = require('../models/category_2');

const router = express.Router();

const upload2 = multer();


//Create 
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const title = req.body.title.replace(/<[^>]*>/g, '');
        const description = req.body.description;
        const thumbnail_url = req.body.thumbnail_url;
        const category2_id = req.body.category2_id;
        const content = req.body.content;

        // Get the latest post from the database
        const latestPost = await Post.findOne({
            order: [['id', 'DESC']]
        });

        // Get the latest post id
        let latestPostId = 0;
        if (latestPost) {
            latestPostId = latestPost.id;
        }

        // Generate the file name using the latest post id
        const post_id = `${latestPostId + 1}`;
        const fileName = post_id + ".html";
        const filePath = path.join(__dirname, '../views/posts', fileName);
        const relativeFilePath = './post/' + post_id;

        console.log('title: ', title, description, thumbnail_url, category2_id, fileName, filePath, content);

        fs.writeFile(filePath, content, (err) => {
            if (err) throw err;
            console.log('HTML file was saved!');
        });

        try {
            const post = await Post.create({
                title: title,
                description: description,
                thumbnail_url: thumbnail_url,
                path: relativeFilePath,
                Category2Id: category2_id,
                UserId: req.user.id
            });

            res.redirect('/');
        } catch (error) {
            // handle the error
            console.error(error);
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//Read
router.get('/:searchType/:searchTerm/:numberOfResults', async (req, res, next) => {
    const searchType = req.params.searchType;
    const searchTerm = req.params.searchTerm;
    const numberOfResults = req.params.numberOfResults;

    try {
      let posts;
  
      if (searchType === 'All') {
        // Find all posts, ordered by id in descending order
        posts = await Post.findAll({
          order: [['id', 'DESC']],
          limit: numberOfResults
        });
      } else if (searchType === 'User') {
        // Find the user with the name equal to searchTerm
        const user = await User.findOne({ where: { name: searchTerm } });
  
        if (!user) {
          return res.status(404).json({
            message: 'User not found.'
          });
        }
  
        // Find all posts that belong to the found user
        posts = await Post.findAll({
          where: { UserId: user.id },
          limit: numberOfResults
        });
      } else if (searchType === 'Title') {
        // Find all posts with a title that includes the search term
        posts = await Post.findAll({
          where: { title: { [Op.like]: `%${searchTerm}%` } },
          limit: numberOfResults
        });
      } else if (searchType === 'Category') {
        // Find the category_2 with the name equal to searchTerm
        const category = await Category2.findOne({
          where: { name: searchTerm }
        });
  
        if (!category) {
          return res.status(404).json({
            message: 'Category not found.'
          });
        }
  
        // Find all posts that belong to the found category_2
        posts = await Post.findAll({
          where: { Category2Id: category.id },
          limit: numberOfResults
        });
      } else {
        return res.status(400).json({
          message: 'Invalid search type.'
        });
      }
  
      return res.status(200).json({
        posts: posts
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An error occurred while trying to search for posts.'
      });
    }
  });


//Update
router.put('/update/:postId', async (req, res, next) => {
    const postId = req.params.postId;
    const db_updates = req.body.db_updates;
    const content_updates = req.body.content_updates;
    const filePath = `./views/posts/${postId}.html`;
  
    try {
      // 1. Update the values in the database
      const result = await Post.update(db_updates, { where: { id: postId } });
      if (!result[0]) {
        return res.status(404).json({
          message: 'The post could not be found.'
        });
      }
  
      // 2. Update the HTML file
      // Read the current contents of the file
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      // Use the updates to update the file contents
      const updatedFileContents = fileContents.replace(content_updates);
      // Write the updated contents back to the file
      fs.writeFileSync(filePath, updatedFileContents);
  
      // 3. Send a response
      return res.status(200).json({
        message: 'The post was updated successfully.'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An error occurred while trying to update the post.'
      });
    }
  });
  

//Delete
router.delete('/delete/:postId', async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const result = await Post.destroy({ where: { id: postId } });
        if (result) {
            return res.status(200).json({
                message: 'The post was deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'The post could not be found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while trying to delete the post.'
        });
    }
});


router.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = router;