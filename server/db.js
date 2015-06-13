var redis = require('./config/redis');

var db = {
  topics: {},
  users: {},
  userTopics: {}
};

module.exports = {

  addUserToTopic: function(topicName, userName) {
    var key = "topic:" + topicName +":users";
    redis.sadd([key, userName]);
  },

  addTopicToUser: function(userName, topicName) {
    var key = "user:" + userName + ":topics";
    redis.sadd([key, topicName]);
  },

  getTopicsByUser: function(userName, callback) {
    var key = "user:" + userName + ":topics";
    redis.smembers(key, callback);
  },


  topics: db.topics,
  users: db.users,
  userTopics: db.userTopics
};
