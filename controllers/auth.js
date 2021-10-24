const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');
require('dotenv').config();

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY
    }
  })
);

exports.getLogin = (req, res, next) => {
  let success = req.flash('success');
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  if (success) {
    success = success[0];
  } else {
    success = null;
  }
  res.render('pages/auth/login', {
    path: '/login',
    pageTitle: 'JP Ceramics - Login',
    successMessage: success,
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/auth/signup', {
    path: '/signup',
    pageTitle: 'JP Ceramics - Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/login', {
      path: '/login',
      pageTitle: 'JP Ceramics - Login',
      successMessage: '',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('pages/auth/login', {
          path: '/login',
          pageTitle: 'JP Ceramics - Login',
          successMessage: '',
          errorMessage: "We're sorry, that email or password is invalid.",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(matching => {
          if (matching) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('pages/auth/login', {
            path: '/login',
            pageTitle: 'JP Ceramics - Login',
            errorMessage: "We're sorry, that email or password is invalid.",
            successMessage: '',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const favFood = req.body.favFood;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        firstName: firstName, 
        lastName: lastName,
        favFood: favFood, 
        email: email,
        password: password,
        confirmPassword: ''
      },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash(
          'error',
          'This email already exsists, please use a different one or login.'
        );
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            favFood: favFood,
            email: email,
            password: hashedPassword,
            cart: { items: [] }, 
            wishlist: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          req.flash('success', 'You have successfully signed up. Thank you! Please login to start shopping.');
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'sandybeach_21@hotmail.com',
            subject: 'Signup succeeded!',
            html: '<h1>Thank you for signing up with Jilyan Potter Ceramics!</h1>'
          });
        })
        .catch(err => { console.log(err); });
    })
    .catch(err => { console.log(err); });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/auth/reset', {
    path: '/reset',
    pageTitle: 'JP Ceramics - Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        req.flash('success', 'Success! Please check your email for a password reset link.');
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'sandybeach_21@hotmail.com',
          subject: 'Password reset',
          html: `
            <h1>Jilyan Potter Ceramics - Password reset</h1>
            <p>You requested a password reset</p>
            <p>Click this <a href="https://cse341-e-commerce.herokuapp.com/reset/${token}">link</a> to set a new password.</p>
          `
        }); // http://localhost:5000 <--to use email on local host
            // the sign-up and reset emails work great on localhost, but don't work with heroku.. perhaps because the api key is in an env file?
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('pages/auth/new-password', {
        path: '/new-password',
        pageTitle: 'JP Ceramics - New Password',
        errorMessage: message,
        validationErrors: [], 
        userId: user._id.toString(),
        passwordToken: token, 
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const inputOldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/auth/new-password', {
      path: '/new-password',
      pageTitle: 'Set New Password',
      userId: userId,
      passwordToken: passwordToken, 
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  User.findOne({ 
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
   })
    .then(user => {
      bcrypt
        .compare(inputOldPassword, user.password)
        .then(matching => {
          if (matching) {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
          }
          return res.status(422).render('pages/auth/new-password', {
            path: '/new-password',
            pageTitle: 'Set New Password',
            userId: userId,
            passwordToken: passwordToken, 
            errorMessage: "The old password you enter must match the current one on record.",
            validationErrors: []
          });
        })
        .then(hashedPassword => {
          resetUser.password = hashedPassword;
          resetUser.resetToken = undefined;
          resetUser.resetTokenExpiration = undefined;
          return resetUser.save();
        })
        .then(result => {
          req.flash('success', 'Your password has been successfully updated. Please login to start shopping.');
          res.redirect('/login');
        })
        .catch(err => { 
          console.log(err); 
          res.redirect('/new-password');
        });
    })
    .catch(err => console.log(err));
};