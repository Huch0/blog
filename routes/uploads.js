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
router.post('/upload', isLoggedIn, upload.array('img', 12), (req, res) => {
    console.log("POST /img/upload successful");

    let imgUrls = [];
    req.files.forEach(img => {
        imgUrls.push(`/img/${img.filename}`);
    });

    res.json({ url: imgUrls });
    //console.log(req);
});

router.delete('/delete', isLoggedIn, async (req, res) => {
    console.log("DEL /img/delete successful");
    console.log(req.body);
    try {
        for (const img_url of req.body.urls) {
            // Parse the image filename from the URL
            const filename = img_url.substring(img_url.lastIndexOf('/') + 1);

            // Delete the file from the /uploads directory
            await new Promise((resolve, reject) => {
                fs.unlink(`./uploads/${filename}`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        }
    } catch (err) {
        console.error(`Error deleting files: ${err}`);
        return res.status(500).send({ message: `Error deleting files: ${err}` });
    }

    res.json({ status: 'success' });
});

router.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = router;