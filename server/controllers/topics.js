var interfaces = require('../interfaces.js'),
  Topics = require('../models/Topics'),
  _ = require('lodash');

var routes = module.exports.routes = [];

routes.push({
  method: 'POST',
  path: '/listTopics',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topics:list'
    },
    description: 'get available topics for calling user',
    response: {
      schema : interfaces.topics
    }
  },
  handler: function (req, reply) {
    return Topics.getTopics(reply);
  }
});

