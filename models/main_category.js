const Sequelize = require('sequelize');

module.exports = class Maincategory extends Sequelize.Model {
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
            modelName: 'Maincategory',
            tableName: 'main_category',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Maincategory.hasMany(db.Subcategory, { onDelete: 'SET NULL' });
        db.Maincategory.hasMany(db.Post, { onDelete: 'SET NULL' });
    }
};