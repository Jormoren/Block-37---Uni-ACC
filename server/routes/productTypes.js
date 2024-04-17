const express = require('express');
const router = express.Router();
const { fetchProduct_Types, fetchProductsOfType } = require('../db');

// Get route for product types
router.get('/', async (req, res, next) => {
  try {
    const productTypes = await fetchProduct_Types();
    res.send(productTypes);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// Get route for products of a specific product type
router.get('/:id', async (req, res, next) => {
  try {
    const productsOfType = await fetchProductsOfType(req.params.id);
    res.send(productsOfType);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;
