const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post } = require("../models");
const { isLoggedIn } = require('./is_logged_in');
const { hash } = require('bcrypt');
const { post } = require('./page');
const { title } = require('process');

const router = express.Router();

const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const title = req.body.title.replace(/<[^>]*>/g, '');
        const description = req.body.description;
        const category = req.body.category;
        const content = req.body.content;

        const fileName = title + ".html";
        const filePath = path.join(__dirname, '../views/posts', fileName);

        console.log('title: ', title, description, category, fileName, filePath, content);

        fs.writeFile(filePath, content, (err) => {
            if (err) throw err;
            console.log('HTML file was saved!');
        });
        
        /*
        const post = await Post.create({
            title: title,
            description: description,
            path: filePath,
            Category_2Id: category,
            UserId: req.user.id,
        });
        */
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