const path = require('path');

const express = require('express');

const adminController = require('../../controllers/w03/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProductPg);

// /admin/add-product => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProductPg);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
