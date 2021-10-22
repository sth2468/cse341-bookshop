exports.get404pg = (req, res, next) => {
  res.status(404).render('pages/404', { 
    pageTitle: 'Page Not Found', 
    path: '/404',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.get500pg = (req, res, next) => {
  res.status(500).render('pages/500', { 
    pageTitle: 'Server Error', 
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
};