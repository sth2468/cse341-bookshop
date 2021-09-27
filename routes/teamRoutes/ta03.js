/* // ta example code
const express = require('express');
const router = express.Router();
var jsonEngine = require('../../controllers/w03...fix this!!');

router.get('/', jsonEngine.processJson)
      .post('/', (req, res, next) => {
          let searchedValue = req.body.searchedValue;
          let filteredData = global.jsonRespo;//...
          console.log(filteredData);
          res.render('pages/teamActivitites/ta03...', (??) => {
            title: 'JSON Search', 
            data: filteredData,
            path: '/ta03', 
            searchedValue: searchedValue
          });
      });

module.exports = router;
*/