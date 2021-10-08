const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/w03/error');
const User = require('./models/user');

//const mongoConnect = require('./util/database');

const PORT = process.env.PORT || 5000

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/proveRoutes/admin');
const shopRoutes = require('./routes/proveRoutes/shop');

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

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://s_humann:oBT37HEWqVLEKQ6o@clustercse341.vl2yx.mongodb.net/shop?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5bab316ce0a7c75f783cb8a8')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404pg);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 's_humann',
          email: 's@email.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch(err => console.log(err)
);

// mongoConnect((client) => {
//   console.log(client);
//   app.listen(process.env.PORT || 5000);
// });

// app.listen(process.env.PORT || 5000);