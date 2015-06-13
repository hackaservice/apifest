var twitter = require('../config/twitter'),
  _ = require('lodash');

module.exports = {
  getTopics: function(callback) {
    var world = { id: '1' };

    var onError = function(err) {
      console.log('on errro', arguments);
      return callback(err);
    };

    var onSuccess = function(results) {
      var result = _.first((JSON.parse(results)));
      var trends = result.trends || [];

      _.each(trends, function(trend, index) {
        console.log("index", index);
        console.log("trend", trend);
      });

      return callback(null, _.map(trends, function(trend) {
        return {
          name: trend.name
        }
      }));
    };

    twitter.getCustomApiCall('/trends/place.json', world,
      onError,
      onSuccess);
  }

};

