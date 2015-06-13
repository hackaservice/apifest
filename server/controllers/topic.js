var interfaces = require('../interfaces.js'),
  Joi = require('joi');

var routes = module.exports.routes = [];

routes.push({
  method: 'POST',
  path: '/topic/login',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topics:login'
    },
    description: 'logs you into a topic'
  },
  handler: function (req, reply) {
    console.log("topic, login", req.payload);
    return reply("this is ok");
  }
});

routes.push({
  method: 'POST',
  path: '/topic/message',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topics:message'
    },
    description: 'posts a message into a topic'
  },
  handler: function (req, reply) {
    console.log("topic, message", req.payload);

    return reply("this is ok");
  }
});

