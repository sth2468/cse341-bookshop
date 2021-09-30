const Product = require('../../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/admin/products', {
      prods: products,
      pageTitle: 'Admin',
      path: '/admin/products'
    });
  });
};

exports.getAddProductPg = (req, res, next) => {
  res.render('pages/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProductPg = (req, res, next) => {
  const t = req.body.title;
  const img = req.body.imageUrl;
  const p = req.body.price;
  const desc = req.body.description;
  const product = new Product(null, t, img, p, desc);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('pages/admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const newTitle = req.body.title;
  const newPrice = req.body.price;
  const newImageUrl = req.body.imageUrl;
  const newDesc = req.body.description;
  const newProd = new Product(
    id,
    newTitle,
    newImageUrl,
    newDesc,
    newPrice
  );
  newProd.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteById(id);
  res.redirect('/admin/products');
}