//TA03 PLACEHOLDER : Tom drove, Brent big help
const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/', (req, res, next) => {
  https.get('https://byui-cse.github.io/cse341-course/lesson03/items.json', 
  myRes => {
    let data = '';

    myRes.on('data', chunk => {
      data += chunk;
    });

    myRes.on('end', () => {
      let items = JSON.parse(data);
      const query = req.query.query;
      if (query) {
        items = items.filter(item => {
          return item.tags.some(tag => {
            return tag.toUpperCase().includes(query.toUpperCase());
          }) ||
          item.name.toUpperCase().includes(query.toUpperCase());
        });
      }

      res.render('pages/ta03', {
        title: 'Team Activity 03',
        path: '/ta03', // For pug, EJS
        items: items, 
        query: query, 
        activeTA03: true, // For HBS
        contentCSS: true, // For HBS
      });
    });
  });
});

module.exports = router;

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
