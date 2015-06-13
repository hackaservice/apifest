var redis = require('./config/redis');

module.exports = {

  addUserToTopic: function(topicName, userName) {
    var key = "topic:" + topicName +":users";
    redis.sadd([key, userName]);
  },

  countUsersByTopic: function(topicName, callback) {
    var key = "topic:" + topicName +":users";
    return redis.scard(key, callback);
  },

  getUsersByTopic: function(topicName, callback) {
    var key = "topic:" + topicName +":users";
    return redis.smembers(key, callback);
  }
};
