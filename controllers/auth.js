const bcrypt = require('bcryptjs');
//const nodemailer = require('nodemailer');
//const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key: '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'
//     }
//   })
// );

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('pages/auth/login', {
    path: '/login',
    pageTitle: 'JP Ceramics - Login',
    errorMessage: message
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
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
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
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // check if these match, if not send an error message
  const confirmPassword = req.body.confirmPassword;
  if (!email || !password) {
    req.flash('error', 'Please enter an email and password.');
    return res.redirect('/signup');
  }
  if (confirmPassword !== password) {
    req.flash('error', 'Your passwords do not match. Please try again.');
    return res.redirect('/signup');
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
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        // .then(result => {
        //   res.redirect('/login');
        //   return transporter.sendMail({
        //     to: email,
        //     from: 'customerservice@jpceramics.com',
        //     subject: 'Successful account creation!',
        //     html: '<h1>Thank you for creating an account with Jilyn Potter Ceramics! You can start shopping by clicking HERE.</h1>' 
        //     // add a link to the store login page
        //   });
        // })
        // .catch(err => {
        //   console.log(err);
        // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
