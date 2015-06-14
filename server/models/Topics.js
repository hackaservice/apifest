var twitter = require('../config/twitter'),
  async = require('async'),
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

      async.map(trends, function(trend, callback) {
        var onError = function(err) { return callback(err); };

        var onSuccess = function(results) {
          var sdf = JSON.parse(_.first(arguments));
          if(sdf.statuses[0]){
            var t = {
              name: trend.name,
              text: sdf.statuses[0].text || "",
              image: sdf.statuses[0].user.profile_image_url || "",
              user: sdf.statuses[0].user.name || "",
              timestamp: sdf.statuses[0].created_at || ""
            };
            console.log(t);
            return callback(null, t);
          }else{
              return callback(null, {name:trend.name});
          }
        };

        return twitter.getSearch({'q':trend.name,'count': 1,'lang': 'es','result_type':'popular'}, 
          onError, 
          onSuccess);

      }, function(err, _cached) {
        if (err) return callback(err);

        cached = _cached;

        listTopics(callback);
      });
    };

    twitter.getCustomApiCall('/trends/place.json', santiago, onError, onSuccess);
  }

};


