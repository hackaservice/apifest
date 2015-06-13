var Twitter = require('twitter-node-client').Twitter,
  Config = require('getconfig');

module.exports = new Twitter(Config.twitter);