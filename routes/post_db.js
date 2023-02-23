const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const url = require('url');
const querystring = require('querystring');

const { Post, User, Category_1, Category_2 } = require("../models");
const { isLoggedIn } = require('./is_logged_in');
const { hash } = require('bcrypt');
const { post } = require('./page');
const { title } = require('process');

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
    const latestPostId = await Post.max('id', { paranoid: false });

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

router.get('/edit/:id', async (req, res, next) => {
  const id = req.params.id;

  console.log('post-id Router activated : ', id);

  Post.findOne({ where: { id } })
    .then((post) => {
      const fileName = `./views/posts/${post.id}.html`;
      // Check if file exists
      fs.access(fileName, fs.F_OK, (err) => {
        if (err) {
          console.log(fileName, "file doesn't exist");
          // If file doesn't exist, render edit page using nunjucks template
          res.render('editor', { title: 'edit' });
        } else {
          // If file exists, read the file and send its contents to the client
          fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: 'Error retrieving post' });
            } else {
              const responseObj = {
                post: post,
                fileContents: data
              };
              // Send the response in JSON format
              res.json(responseObj);
              //res.send(data);
              //res.json(post);
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving post' });
    });
});

router.get('/search', async (req, res, next) => {
  const request_url = url.parse(req.url);
  const query = querystring.parse(request_url.query);

  const searchType = query.searchType;
  const searchTerm = query.searchTerm;
  const numberOfResults = parseInt(query.numberOfResults, 10);
  const page = parseInt(query.page, 10);

  //console.log('post-search Router activated : ', searchType, searchTerm, numberOfResults, page);

  try {
    let posts;

    if (searchType === 'All') {
      //console.log('searchType : All');
      // Find all posts, ordered by id in descending order
      posts = await Post.findAll({
        order: [['id', 'DESC']],
        limit: numberOfResults,
        offset: (page - 1) * numberOfResults
      });
    } else if (searchType === 'User') {

      console.log('searchType : User', searchTerm);
      // Find the user with the name equal to searchTerm
      User.findOne({ where: { nick: searchTerm } })
        .then((user) => {
          console.log('User Found : ', user);
          // Find all posts that belong to the found user
          Post.findAll({
            where: { UserId: user.id },
            limit: numberOfResults,
            offset: (page - 1) * numberOfResults
          })
            .then((posts) => {
              console.log(posts);

            }).catch((error) => {
              console.error(error);

            });

        }).catch((error) => {
          console.error(error);
          res.status(404).json({
            message: 'User not found.'
          });
        });


    } else if (searchType === 'Title') {
      posts = await Post.findAll({
        where: { title: { [Op.like]: `%${searchTerm}%` } },
        limit: numberOfResults,
        offset: (page - 1) * numberOfResults
      });
    } else if (searchType === 'Category') {
      console.log('searchType : Category', searchTerm);

      const category = await Category_2.findOne({
        where: { name: 'TOEFL' }
      }).catch(error => {
        console.error(error);
        throw error;
      });
      console.log(category, category.id);

      if (!category) {
        return res.status(404).json({
          message: 'Category not found.'
        });
      }

      // Find all posts that belong to the found category_2
      posts = await Post.findAll({
        where: { Category2Id: category.id },
        limit: numberOfResults,
        offset: (page - 1) * numberOfResults
      });
    } else {
      return res.status(400).json({
        message: 'Invalid search type.'
      });
    }

    //console.log(posts);
    res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while trying to search for posts.'
    });
  }
});



//Update
router.put('/update/:postId', async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title.replace(/<[^>]*>/g, '');
  const description = req.body.description;
  const thumbnail_url = req.body.thumbnail_url;
  const category2_id = req.body.category2_id;
  const content = req.body.content;

  const fileName = postId + ".html";
  const filePath = path.join(__dirname, '../views/posts', fileName);
  console.log(postId, title, description, thumbnail_url, category2_id, content, fileName, filePath);

  try {
    // 1. Update the values in the database
    const result = await Post.update({
      title: title,
      description: description,
      thumbnail_url: thumbnail_url,
      Category2Id: category2_id,
    }, {
      where: {
        id: postId
      }
    });
    console.log('result : ', result);
    if (!result[0]) {
      return res.status(404).json({
        message: 'The post could not be found.'
      });
    }

    console.log('updated contents : ', content);

    // Write the updated contents back to the file
    fs.writeFileSync(filePath, content);

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