const products = [];

exports.getAddProductPg = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProductPg = (req, res, next) => {
  products.push({ title: req.body.title, price: req.body.price, description: req.body.description });
  res.redirect('/');
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex(book => book.title === req.body.title);
  products.splice(index, 1);
  res.redirect('/');
}

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true
  });
};