const Product = require('../../models/product');
const Cart = require('../../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id, product => {
    res.render('pages/shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('pages/shop/cart', {
        path: '/cart',
        pageTitle: 'Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    Cart.addProduct(id, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
};

exports.getOders = (req, res, next) => {
  res.render('pages/shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('pages/shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};