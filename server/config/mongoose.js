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

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

module.exports = function(callback) {
  db.once('open', callback);
};
