// npm start (in terminal)
// http://localhost:5000/ (in browser)
/* From Academind - Maximillian
 * NodeJS - The Complete Guide 
 * (incl. Deno.js, REST APIs, GraphQL) 
*/
const path = require('path');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URL = process.env.MONGODB_URL;

const PORT = process.env.PORT || 5000

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/proveRoutes/admin');
const shopRoutes = require('./routes/proveRoutes/shop');
const authRoutes = require('./routes/proveRoutes/auth');
const prove08Routes = require('./routes/proveRoutes/prove08');

const corsOptions = {
    origin: "https://cse341-e-commerce.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    family: 4
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(prove08Routes);

app.use(errorController.get404pg);
app.use(errorController.get500pg);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => console.log(err)
);
