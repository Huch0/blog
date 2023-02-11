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

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const title = req.body.title.replace(/<[^>]*>/g, '');
        const description = req.body.description;
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

        console.log('title: ', title, description, category2_id, fileName, filePath, content);

        fs.writeFile(filePath, content, (err) => {
            if (err) throw err;
            console.log('HTML file was saved!');
        });

        try {
            const post = await Post.create({
                title: title,
                description: description,
                path: relativeFilePath,
                Category2Id: category2_id,
                UserId: req.user.id,
                UserNick: req.user.nick,
            });

            res.redirect('/');
        } catch (error) {
            // handle the error
            console.error(error);
            res.redirect('/');
        }
        /*
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
        */
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = router;