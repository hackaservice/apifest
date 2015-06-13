var twitter = require('../config/twitter'),
  _ = require('lodash'),
  cached;

module.exports = {
  listTopics: function listTopics(callback) {
    // if cached, answer from here
    if (cached) {
      return callback(null, cached);
    }

    // produce cache
    var world = { id: '1' };
    var santiago = { id: '23424782'};

    var onError = function(err) {
      console.log('on error', arguments);
      return callback(err);
    };

    var onSuccess = function(results) {
      var result = _.first((JSON.parse(results)));
      var trends = result.trends || [];

      cached = _.map(trends, function(trend) {
        return {
          name: trend.name
        }
      });

      return listTopics(callback);
    };

    twitter.getCustomApiCall('/trends/place.json', santiago, onError, onSuccess);
  }

};


