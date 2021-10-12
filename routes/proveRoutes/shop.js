const path = require('path');

const express = require('express');

const shopController = require('../../controllers/shop');
const isAuth = require('../../middleware/is-authorized');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOders);

router.post('/create-order', isAuth, shopController.postOrder);

//router.get('/checkout', shopController.getCheckout);

module.exports = router;
