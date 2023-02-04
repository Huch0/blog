const Sequelize = require('sequelize');

module.exports = class Category_1 extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'Category_1',
            tableName: 'cateogry_1',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Category_1.hasMany(db.Category_2);
    }
};