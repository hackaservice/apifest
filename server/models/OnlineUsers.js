var redis = require('../config/redis');

function add(userName) {
  var key = "online-users";
  redis.sadd([key, userName]);
}

function get(callback) {
  var key = "online-users";
  redis.smembers(key, callback);
}

module.exports = {
  add: add,
  get: get
};

