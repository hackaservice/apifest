var interfaces = require('../interfaces.js');

var routes = module.exports.routes = [];

routes.push({
  method: 'GET',
  path: '/topics',
  config: {
    tags: ['api'],
    description: 'get available topics for calling user',
    response: {
      schema : interfaces.topics
    }
  },
  handler: function (req, reply) {
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
        return reply(null,null);
    };
    var success = function (data) {
        return reply(null,req.server._
          .chain(JSON.parse(data)[0]['trends'])
          .map(function(trend){return {name:trend.name};}).value());
    };
    req.server.twitter.getCustomApiCall('/trends/place.json',{ id: '1'}, error, success);
  }
});

