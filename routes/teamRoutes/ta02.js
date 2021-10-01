//TA02 PLACEHOLDER - Brent drove
// Remember, you can make more of these placeholders yourself!
const express = require('express');
const router = express.Router();

const users = new Set(['Tom', 'Brent', 'Sandy', 'Drew', 'Carlos']);
let errorMsg = null;

router.get('/', (req, res, next) => {
  res.render('pages/ta02', {
    title: 'Team Activity 02',
    path: '/ta02', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
    users: users,
    errorMsg
  });
});

router.post('/addUser', (req, res, next) => {
  const userName = req.body.username;
  if (!users.has(userName)) {
    users.add(userName);
    errorMsg = null;    
  } else {
    errorMsg = `The user, "${userName}", already exists.`
  }
  res.redirect('/ta02');
});

router.post('/removeUser', (req, res, next) => {
  const userName = req.body.userlist;
  if (users.has(userName)) {
    users.delete(userName);
    errorMsg = null;    
  } else {
    errorMsg = `The user, "${userName}", doesn't exist.`
  }
  res.redirect('/ta02');
});

module.exports = router;

/* // Tom's version
const users = new Set(['Tom', 'Brent', 'Sandy', 'Drew', 'Carlos']);

router.get('/', (req, res, next) => {
  res.render('pages/ta02', {
    title: 'Team Activity 02',
    path: '/ta02', // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
    users: users,
    error: req.query.error
  });
});

router.post('/addUser', (req, res, next) => {
  if (users.has(req.body.username)) {
    console.log('Duplicate user');
    res.redirect('/ta02?error=' + encodeURIComponent('DuplicateUser'));
    return res.end();
  }

  users.add(req.body.username);
  res.redirect('/ta02/');
});

router.post('/removeUser', (req, res, next) => {
  if (!users.has(req.body.usernameToRemove)) {
    console.log('User not found');
    res.redirect('/ta02?error=' + encodeURIComponent('UserNotFound'));
    return res.end();
  }

  users.delete(req.body.usernameToRemove);
  
  res.redirect('/ta02');
});
*/