var redis = require('./config/redis');

var db = {
  topics: {},
  users: {},
  userTopics: {}
};

module.exports = {

  addOnlineUser: function(userName) {
    var key = "online-users";
    redis.sadd([key, userName]);
  },

  getOnlineUsers: function(callback) {
    var key = "online-users";
    redis.smembers(key, callback);
  },

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
  },

  addTopicToUser: function(userName, topicName) {
    var key = "user:" + userName + ":topics";
    redis.sadd([key, topicName]);
  },

  getTopicsByUser: function(userName, callback) {
    var key = "user:" + userName + ":topics";
    redis.smembers(key, callback);
  }
};
