const Sequelize = require('sequelize');
const db = require('./models');

const categories = [
    { name: 'AI' },
    { name: 'Web' },
    { name: 'Database' },
];

const seed = async () => {
    await db.sequelize.sync({ force: true });
    await db.Category_2.bulkCreate(categories);
};

seed().then(() => {
    console.log('Categories seeded successfully!');
    process.exit();
}).catch(error => {
    console.error('An error occurred while seeding categories', error);
    process.exit();
});
