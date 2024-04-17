const express = require('express');
const router = express.Router();
const {  
    fetchAllCarts,
    fetchCart,
    fetchCartProducts,
    fetchUserCart,
    createCartProduct,
    deleteCartProduct
} = require('../db');

// Get route for all carts
router.get('/', async (req, res, next) => {
  try {
    const allCarts = await fetchAllCarts();
    res.send(allCarts);
  } catch (error) {
    next(error);
  }
});

// Get route for a single cart
router.get('/:cartId', async (req, res, next) => {
  try {
    const cart = await fetchCart(req.params.cartId);
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

// Get route for carts by user ID
router.get('/user/:userId', async (req, res, next) => {
  try {
    const userCart = await fetchUserCart(req.params.userId);
    res.send(userCart);
  } catch (error) {
    next(error);
  }
});

// Get route for cart products
router.get('/:cartId/cart_products', async (req, res, next) => {
  try {
    const cartProducts = await fetchCartProducts(req.params.cartId);
    res.send(cartProducts);
  } catch (error) {
    next(error);
  }
});

// POST route for creating a cart product
router.post('/:cartId/cart_products/:productId', async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;
    const { qty } = req.body;
    const createdCartProduct = await createCartProduct(cartId, productId, qty);
    res.status(201).send(createdCartProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE route for deleting a cart product
router.delete('/:cartId/cart_products/:productId', async (req, res, next) => {
  try {
    const { cartId, productId } = req.params;
    await deleteCartProduct(cartId, productId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
