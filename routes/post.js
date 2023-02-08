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

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('There was no uploads directory. Generated new dir.')
    fs.mkdirSync('uploads');
}


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },  
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
// /upload.array('img', 12),
router.post('/img', isLoggedIn, upload.array('img', 12), (req, res) => {
    console.log("POST /img successful");

    let imgUrls = [];
    req.files.forEach(img => {
        imgUrls.push(`/img/${img.filename}`);
    });

    res.json({ url: imgUrls });
    //console.log(req);
});

const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const content = req.body.content;
        const title = content.match(/<h1>(.*?)<\/h1>/)[1].replace(/<\/?h1>/g, '');
        const fileName = title + ".html";
        //const filePath = 
        console.log(title, fileName, content);

        fs.writeFile(fileName, content, (err) => {
            if (err) throw err;
            console.log('HTML file was saved!');
        });

        console.log(title, content);

        const post = await Post.create({
            title: title,
            path: './posts/' + fileName,
            UserId: 0,
            //UserId: req.user.id,
        });
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