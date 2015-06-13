var redis = require('redis'),
  Config = require('getconfig');

var redisConfig = Config.redis
var client = redis.createClient(redisConfig.port, redisConfig.host);

client.on("error", function(err) {
  console.log("error in redis connection", err);
});

client.on("ready", function() {
  console.log("redis is ready!");
});

module.exports = client;

