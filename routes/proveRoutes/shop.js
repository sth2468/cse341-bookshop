const express = require('express');

const productsController = require('../controllers/w03/products');

const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;
