const express = require('express');
const router = express.Router();

const Maincategory = require('../models/main_category');
const Subcategory = require('../models/sub_category');


const createMaincategory = async (name) => {
  try {
    await Maincategory.create({
      name: name
    });
    console.log('Maincategory created successfully');
  } catch (error) {
    console.error(error);
  }
};

router.post('/createMaincategory', async (req, res) => {
  try {
    createMaincategory(req.body.name);
    res.redirect('/tables/database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});

router.delete('/deleteMaincategory/:id', async (req, res, next) => {
  const MaincategoryId = req.params.id;

  try {
    const result = await Maincategory.destroy({ where: { id: MaincategoryId } });
    if (result) {
      return res.status(200).json({
        message: 'The Maincategory was deleted successfully.'
      });
    } else {
      return res.status(404).json({
        message: 'The Maincategory could not be found.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while trying to delete the Maincategory.'
    });
  }
});

const createSubcategory= async (parent_category_id, name) => {
  try {
    await Subcategory.create({
      MaincategoryId: parent_category_id,
      name: name
    });
    console.log('Subcategory created successfully');
  } catch (error) {
    console.error(error);
  }
};

router.post('/createSubcategory', async (req, res) => {
  try {
    createSubcategory(req.body.parent_category_id, req.body.name);
    res.redirect('/tables/database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Subcategory');
  }
});

router.delete('/deleteSubcategory/:id', async (req, res, next) => {
  const SubcategoryId = req.params.id;

  try {
    const result = await Subcategory.destroy({ where: { id: SubcategoryId } });
    if (result) {
      return res.status(200).json({
        message: 'The Subcategory was deleted successfully.'
      });
    } else {
      return res.status(404).json({
        message: 'The Subcategory could not be found.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while trying to delete the Subcategory.'
    });
  }
});

router.get('/category_table', async (req, res) => {
  try {
    const main_categories = await Maincategory.findAll();
    const sub_categories = await Subcategory.findAll();

    const all_categories = {};

    main_categories.forEach(main_category => {
      const sub_category_table = {};

      sub_categories.forEach(sub_category => {
        if (sub_category.MaincategoryId === main_category.id) {
          sub_category_table[sub_category.id] = sub_category.name;
        }
      });

      all_categories[main_category.id] = {
        name: main_category.name,
        sub_category_table
      };
    });

    // Send the response in JSON format
    res.json(all_categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get all main_category');
  }
});

router.get('/category_dropdown', async (req, res) => {
  try {
    console.log('Category_dropdown router');
    const main_categories = await Maincategory.findAll();
    let generated_menu = '';
    let generated_ids = {};

    for (const main_category of main_categories) {
      generated_menu += make_main_category_option(main_category);

      const sub_categories = await Subcategory.findAll({ where: { MaincategoryId: main_category.id } });

      let sub_category_options = [];
      for (const sub_category of sub_categories) {
        sub_category_options.push(make_sub_category_option(sub_category));
        generated_ids[sub_category.name] = sub_category.id;
      }
      generated_menu += sub_category_options.join('');
    }

    res.json({ generated_menu, generated_ids });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create Category');
  }
});


function make_main_category_option(main_category) {
  const option = `<li class="dropdown-item">${main_category.name}</li>`;
  return option;
}

function make_sub_category_option(sub_category) {
  const option = `<li><a class="dropdown-item" href="#" onclick="changeValue('${sub_category.name}')">- ${sub_category.name}</a></li>`;
  return option;
}

module.exports = router;
