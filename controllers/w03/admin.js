const Product = require('../../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.getAddProductPg = (req, res, next) => {
  res.render('pages/admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

// make sure book title is unique? So delete works correctly?
exports.postAddProductPg = (req, res, next) => {
  const t = req.body.title;
  const img = req.body.imageUrl;
  const p = req.body.price;
  const desc = req.body.description;
  const product = new Product(t, img, p, desc);
  product.save();
  res.redirect('/');
};

exports.deleteProduct = (req, res, next) => {
  const products = Product.fetchAll();
  const i = products.findIndex(book => book.title === req.body.title);
  Product.delete(i-1);
  res.redirect('/');
}