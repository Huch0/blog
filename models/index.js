const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Category_1 = require('./category_1');
const Category_2 = require('./category_2');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Category_1 = Category_1;
db.Category_2 = Category_2;

User.init(sequelize);
Post.init(sequelize);
Category_1.init(sequelize);
Category_2.init(sequelize);

User.associate(db);
Post.associate(db);
Category_1.associate(db);
Category_2.associate(db);

module.exports = db;