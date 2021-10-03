const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://s_humann:oBT37HEWqVLEKQ6o@clustercse341.vl2yx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(client => {
    console.log('Connected');
    callback(client);
  })
  .catch(err => {
    console.log(err);
  });
}

module.exports = mongoConnect;

