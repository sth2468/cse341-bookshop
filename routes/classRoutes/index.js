// ta
const classRoutes = require('express').Router();

classRoutes.use('/02', require('./w02'))
           .get('/', (req, res, next) => {
             res.render('pages/classActivities/', {
               pageTitle: 'Class Activities', 
               path: '/classActivities'});
           });

module.exports = classRoutes;