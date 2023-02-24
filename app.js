const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 5000, // 5 seconds  
});
redisClient.connect();

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});


const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const post_db_Router = require('./routes/post_db');
const category_db_Router = require('./routes/category_db');
const uploadsRouter = require("./routes/uploads")
const tableRouter = require('./routes/tables');
//const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const User = require('./models/user');
const Post = require('./models/post');
const Maincategory = require('./models/main_category');
const Subcategory = require('./models/sub_category');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 3000);
//app.set('port', 8001);
app.set('view engine', 'html');
nunjucks.configure('./views', {
    express: app,
    watch: true,
});
sequelize.sync({ force: false })
    .then(() => {
        logger.info('Successful DB Connection');
    })
    .catch((err) => {
        logger.error(err.message);
    });
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
    }));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
}
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post_db', post_db_Router);
app.use('/category_db', category_db_Router);
app.use('/uploads', uploadsRouter);
app.use('/tables', tableRouter);
//app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} There is no router`);
    error.status = 404;
    logger.error(error.message);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    logger.info(app.get('port'), 'waiting...');
});