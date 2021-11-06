const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 10;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  let message = req.flash('success');
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      res.render('pages/shop/product-list', {
        prods: products,
        pageTitle: 'JP Ceramics - All Products',
        path: '/products', 
        successMessage: message, 
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  let message = req.flash('success');
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  const id = req.params.productId;
  Product.findById(id)
    .then(product => {
      res.render('pages/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products', 
        successMessage: message
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  let message = req.flash('success');
  if (message) {
    message = message[0];
  } else {
    message = null;
  }

  Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })
    .then(products => {
      res.render('pages/shop/index', {
        prods: products,
        pageTitle: 'JP Ceramics - Shop',
        path: '/', 
        successMessage: message, 
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      let subtotal = 0;
      user.cart.items.map(cartEntry => {
        for (i = 0; i < cartEntry.quantity; i++) {
          subtotal += cartEntry.productId.price;
        }
      });
      subtotal = (parseInt(subtotal * 100) / 100).toFixed(2);
      res.render('pages/shop/cart', {
        path: '/cart',
        pageTitle: 'JP Ceramics - Cart',
        products: products, 
        subtotal: subtotal
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;
  let path = req.body.path;
  path = path.toString();
  Product.findById(id)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    req.flash('success', 'Item has been successfully added to your cart.');
    return res.redirect(path);
  })
  .catch(err => console.log(err));
};

exports.postCartDecrementQty = (req, res, next) => {
  const id = req.body.productId;
    Product.findById(id)
    .then(product => {
      return req.user.removeOneFromCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
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

exports.postOrder = (req, res, next) => {
  let subtotal = req.body.subtotal;
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products,
        purchaseTotal: subtotal
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

exports.getWishList = (req, res, next) => {
  let message = req.flash('success');
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  req.user
    .populate('wishlist.items.productId')
    .then(user => {
      const products = user.wishlist.items;
      res.render('pages/shop/wishlist', {
        path: '/wishlist',
        pageTitle: 'JP Ceramics - Wishlist',
        products: products, 
        successMessage: message
      });
    })
    .catch(err => console.log(err));
};

exports.postWishList = (req, res, next) => {
  const id = req.body.productId;
  Product.findById(id)
  .then(product => {
    return req.user.addToWishList(product);
  })
  .then(result => {
    res.redirect('/wishlist');
  })
  .catch(err => console.log(err));
};

exports.postWishListDeleteItem = (req, res, next) => {
  const id = req.body.productId;
  req.user
    .removeFromWishList(id)
    .then(result => {
      res.redirect('/wishlist');
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('pages/shop/checkout', {
//     pageTitle: 'JP Ceramics - Checkout',
//     path: '/checkout'
//   });
// };