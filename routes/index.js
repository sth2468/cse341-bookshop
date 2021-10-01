// ta code example
const routes = require('express').Router();
const classActivities = require('./classRoutes');
const teamActivities = require('./teamRoutes');
const proveActivities = require('./proveRoutes');

routes.use('/classActivities', classActivities)
      .use('/teamActivities', teamActivities)
      .use('/proveAssignments', proveActivities)
      .get('/', (req, res, next) => {
          res.render('pages/index', 
          {title: 'Welcome to my CSE341 repo', path: '/'});
      })
      .use((req, res, next) => {
        res.render('pages/404', {title: '404 - Page Not Found', path: req.url});
      });

module.exports = routes;