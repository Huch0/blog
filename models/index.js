const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Maincategory = require('./main_category');
const Subcategory = require('./sub_category');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Maincategory = Maincategory;
db.Subcategory = Subcategory;

User.init(sequelize);
Post.init(sequelize);
Maincategory.init(sequelize);
Subcategory.init(sequelize);

User.associate(db);
Post.associate(db);
Maincategory.associate(db);
Subcategory.associate(db);

module.exports = db;