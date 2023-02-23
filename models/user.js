const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(24),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            profile_url: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            introduction: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
        }, {
            sequelize,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post, { onDelete: 'SET NULL' });
    }
};