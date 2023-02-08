const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            path: {
                type: Sequelize.STRING(200),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsTo(db.Category_2);
    }
};