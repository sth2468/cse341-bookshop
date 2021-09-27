const Product = require('../../models/product');

exports.getAddProductPg = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

// make sure book title is unique? So delete works correctly?
exports.postAddProductPg = (req, res, next) => {
  const product = new Product(req.body.title, 
    req.body.price, req.body.description);
  product.save();
  res.redirect('/');
};

exports.deleteProduct = (req, res, next) => {
  const products = Product.fetchAll();
  const i = products.findIndex(book => book.title === req.body.title);
  Product.delete(i);
  res.redirect('/');
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
};