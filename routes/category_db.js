const express = require('express');
const router = express.Router();

const Category_1 = require('../models/category_1');
const Category_2 = require('../models/category_2');


const createCategory_1 = async (name) => {
  try {
    await Category_1.create({
      name: name
    });
    console.log('Category_1 created successfully');
  } catch (error) {
    console.error(error);
  }
};

router.post('/createCategory_1', async (req, res) => {
  try {
    createCategory_1(req.body.name);
    res.redirect('/tables/database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});

router.delete('/deleteCategory_1/:id', async (req, res, next) => {
  const category_1Id = req.params.id;

  try {
    const result = await Category_1.destroy({ where: { id: category_1Id } });
    if (result) {
      return res.status(200).json({
        message: 'The category1 was deleted successfully.'
      });
    } else {
      return res.status(404).json({
        message: 'The category1 could not be found.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while trying to delete the category1.'
    });
  }
});

const createCategory_2 = async (parent_category_id, name) => {
  try {
    await Category_2.create({
      Category1Id: parent_category_id,
      name: name
    });
    console.log('Category_2 created successfully');
  } catch (error) {
    console.error(error);
  }
};

router.post('/createCategory_2', async (req, res) => {
  try {
    createCategory_2(req.body.parent_category_id, req.body.name);
    res.redirect('/tables/database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});

router.delete('/deleteCategory_2/:id', async (req, res, next) => {
  const category_2Id = req.params.id;

  try {
    const result = await Category_2.destroy({ where: { id: category_2Id } });
    if (result) {
      return res.status(200).json({
        message: 'The category2 was deleted successfully.'
      });
    } else {
      return res.status(404).json({
        message: 'The category2 could not be found.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while trying to delete the category2.'
    });
  }
});

router.get('/category_table', async (req, res) => {
  try {
    const categories_1 = await Category_1.findAll();
    const categories_2 = await Category_2.findAll();

    const all_categories = {};

    categories_1.forEach(category_1 => {
      const category2_table = {};

      categories_2.forEach(category_2 => {
        if (category_2.Category1Id === category_1.id) {
          category2_table[category_2.id] = category_2.name;
        }
      });

      all_categories[category_1.id] = {
        name: category_1.name,
        category2_table: category2_table
      };
    });

    // Send the response in JSON format
    res.json(all_categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get all category1');
  }
});

router.get('/category_dropdown', async (req, res) => {
  try {
    console.log('Category_dropdown router');
    const categories1 = await Category_1.findAll();
    let generated_menu = '';
    let generated_ids = {};

    for (const category1 of categories1) {
      generated_menu += make_category1_option(category1);

      const categories2 = await Category_2.findAll({ where: { Category1Id: category1.id } });

      let category_2_options = [];
      for (const category2 of categories2) {
        category_2_options.push(make_category2_option(category2));
        generated_ids[category2.name] = category2.id;
      }
      generated_menu += category_2_options.join('');
    }

    res.json({ generated_menu, generated_ids });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});

function make_category1_option(category1) {
  const option = `<li class="dropdown-item">${category1.name}</li>`;
  return option;
}

function make_category2_option(category2) {
  const option = `<li><a class="dropdown-item" href="#" onclick="changeValue('${category2.name}')">- ${category2.name}</a></li>`;
  return option;
}

module.exports = router;
