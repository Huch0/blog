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
  
  async function find_and_make_category_2(Category1Id) {
    //console.log('find_and_make_category_2 : ', Category1Id);
    const categories2 = await Category_2.findAll({ where: { Category1Id } });
  
    let category_2_options = [];
    for (const category2 of categories2) {
      category_2_options.push(make_category2_option(category2));
    }
  
    return category_2_options;
  }
  
  function make_category1_option(category1) {
    const option = `<li class="dropdown-item">${category1.name}</li>`;
    return option;
  }
  
  function make_category2_option(category2) {
    const option = `<li><a class="dropdown-item" href="#" onclick="changeValue('${category2.name}')">- ${category2.name}</a></li>`;
    return option;
  }
  
  router.get('/category_dropdown', async (req, res) => {
    try {
      const categories1 = await Category_1.findAll();
      let generated_menu = '';
  
      for (const category1 of categories1) {
        generated_menu += make_category1_option(category1);
        generated_menu += (await find_and_make_category_2(category1.id)).join('');
      }
  
      res.json({ generated_menu });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to create Category');
    }
  });

module.exports = router;
