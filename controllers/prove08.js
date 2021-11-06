const https = require('https');

const ITEMS_PER_PAGE = 10;

const renderIndex = (req, res, json) => {

  let searchedValue = req.body.searchValue || req.query.searchValue || ''; 
  let page = parseInt(req.query.page || 1);

  const indexStart = (page - 1) * ITEMS_PER_PAGE;
  const indexEnd = page * ITEMS_PER_PAGE;

  const filteredData = global.jsonResponse.filter((x) =>
    x.name.toLowerCase().includes(searchedValue.toLowerCase())
  );

  let data = '';
  if (!filteredData) {
    data = global.jsonResponse;
  } else {
    data = filteredData.slice(indexStart, indexEnd) 
  }

  let content = {
    data: data, 
    path: '/prove08',
    pageTitle: 'Prove 08',
    searchedValue: searchedValue,
    page: page,
    numPages: Math.ceil(filteredData.length / ITEMS_PER_PAGE),
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < filteredData.length,
    hasPreviousPage: page > 1,
    nextPage: (page + 1),
    previousPage: page - 1,
    lastPage: Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  };

  res.render('pages/proveAssignments/prove08', content);
};

exports.processJson = (req, res, next) => {
  var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json';

  https
    .get(url, function (response) {
      var body = '';

      response.on('data', function (chunk) {
        body += chunk;
      });

      response.on('end', function () {
        global.jsonResponse = JSON.parse(body);
        renderIndex(req, res, global.jsonResponse);
      });
    })
    .on('error', function (e) {
      console.log('Got an error: ', e);
    });
};

exports.getIndex = (req, res, next) => {
  renderIndex(req, res, global.jsonResponse);
};
