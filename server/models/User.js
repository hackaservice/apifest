var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  redis = require('../config/redis'),
  OnlineUsers = require('./OnlineUsers.js');

var schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

schema.static('createOrUpdate', function (user, callback) {
  var model = this;

  var userName = user.name;
  var where = { name: userName };

  return model.findOne(where, function(err, foundUser) {
    if (err) return callback(err);
    if (foundUser) return callback(null, foundUser);

    model.create(user, callback);
  });
});

// static methods
schema.static('findByName', function (userName, callback) {
  var model = this;
  var where = { name: userName };

  return model.findOne(where, callback);
});
// end static methods

// instance methods
schema.method('online', function () {
  OnlineUsers.add(this.name);
});

schema.method('addTopic', function (topicName) {
  var key = "user:" + this.name + ":topics";
  redis.sadd([key, topicName]);
});

schema.method('getTopics', function (callback) {
  var key = "user:" + this.name + ":topics";
  redis.smembers(key, callback);
});
// end instance methods

// serialization
schema.options.toJSON = {
  transform: function(doc, ret, options) {
    return  {
      name: ret.name,
      image: ret.image
    };
  }
};

module.exports = mongoose.model('User', schema);