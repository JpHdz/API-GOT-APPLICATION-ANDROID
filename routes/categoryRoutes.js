const express = require('express');
const categoryController = require('./../controllers/categoryController');

const categoriesRouter = express.Router();

categoriesRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

categoriesRouter
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,
    categoryController.updateCategory,
  )
  .delete(categoryController.deleteCategory);

module.exports = categoriesRouter;
