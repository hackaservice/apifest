// Libs
var Mongoose = require('mongoose');

// Config
var Config = require('getconfig');

// Connect to database
Mongoose.connect(Config.mongo.url);

if (process.env.NODE_ENV === 'development') {
  Mongoose.set('debug', true);
}

var db = Mongoose.connection;

db.on('error', function(err) {
  console.log('error in mongoose connection', err);
});

db.once('open', function callback() {
  console.log("mongoose is ready!");
});

module.exports = function(callback) {
  if (callback) {
    db.once('open', callback);
  }
};
