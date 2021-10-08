const Product = require('../../models/product');
const Order = require('../../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('pages/shop/product-list', {
        prods: products,
        pageTitle: 'JP Ceramics - All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then(product => {
      res.render('pages/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('pages/shop/index', {
        prods: products,
        pageTitle: 'JP Ceramics - Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('pages/shop/cart', {
        path: '/cart',
        pageTitle: 'JP Ceramics - Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id)
    .then(product => {
      return req.user.addToCart(product);
  })
  .then(result => {
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  req.user
    .removeFromCart(id)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    //.execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('pages/shop/orders', {
        path: '/orders', 
        pageTitle: 'JP Ceramics - Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('pages/shop/checkout', {
//     pageTitle: 'JP Ceramics - Checkout',
//     path: '/checkout'
//   });
// };