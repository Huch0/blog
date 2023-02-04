const Sequelize = require('sequelize');

module.exports = class Category_2 extends Sequelize.Model {
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
            modelName: 'Category_2',
            tableName: 'cateogry_2',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Category_2.belongsTo(db.Category_1);
        db.Category_2.hasMany(db.Post);
    }
};