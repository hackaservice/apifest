var interfaces = require('../interfaces.js'),
  Topics = require('../models/Topics'),
  _ = require('lodash');

var routes = module.exports.routes = [];

routes.push({
  method: 'POST',
  path: '/listTopics',
  config: {
    tags: ['api'],
    description: 'get available topics for calling user',
    response: {
      schema : interfaces.topics
    }
  },
  handler: function (req, reply) {
    var error = function (err, response, body) {
      return reply(err);
    };

    var success = function (results) {
      var result = _.first(results);
      var trends = result.trends || [];

      _.each(trends, function(trend, index) {
        console.log(index, trend)
      });


      return reply(null,req.server._
        .chain(JSON.parse(data)[0]['trends'])
        .map(function(trend){return {name:trend.name};}).value());
    };

    Topics.

    req.server.twitter.getCustomApiCall('/trends/place.json',{ id: '1'}, error, success);
  }
});

