const Sequelize = require('sequelize');

module.exports = class Subcategory extends Sequelize.Model {
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
            modelName: 'Subcategory',
            tableName: 'sub_category',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Subcategory.belongsTo(db.Maincategory);
        db.Subcategory.hasMany(db.Post, { onDelete: 'SET NULL' });
    }
};