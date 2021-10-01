// ta code example
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const PORT = process.env.PORT || 5000

const app = express();

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser({extended: false})) // for parsing the body of a POST
   .use('/', routes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
