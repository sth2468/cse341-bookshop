const Product = require('../../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('pages/shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('pages/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};