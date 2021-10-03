const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/w03/error');
const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/proveRoutes/admin');
const shopRoutes = require('./routes/proveRoutes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404pg);

mongoConnect((client) => {
  console.log(client);
  app.listen(process.env.PORT || 5000);
});

app.listen(process.env.PORT || 5000);
