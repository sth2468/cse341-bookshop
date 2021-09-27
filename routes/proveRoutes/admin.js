const express = require('express');

const productsController = require('../controllers/w03/products');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProductPg);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProductPg);

// /admin/delete-product => POST
router.post('/delete-product', productsController.deleteProduct);

module.exports = router;
