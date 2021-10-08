const Product = require('../../models/product');

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
  const product = new Product({
    title: t,
    imageUrl: img,
    price: p,
    description: desc, 
    userId: req.user
  });
  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('pages/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(id)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  })
  .then(result => {
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('pages/admin/products', {
        prods: products,
        pageTitle: 'Admin',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteById(id)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}