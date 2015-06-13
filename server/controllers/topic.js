var interfaces = require('../interfaces.js'),
  Joi = require('joi');
var routes = module.exports.routes = [];

routes.push({
  method: 'GET',
  path: '/topic/{topicName}',
  config: {
    tags: ['api'],
    description: 'Get messages in topicName',
    validate: {
      params: {
        topicName: Joi.string().required()
      }
    },
    response: {
      schema : interfaces.messages
    }
  },
  handler: function (req, reply) {
    return reply([
      {
        user: "daplay",
        content: req.params.topicName + " me parece bkn"
      },
      {
        user: "dapollo",
        content: req.params.topicName + " me parece horrible"
      }
    ]);
  }
});

routes.push({
  method: 'POST',
  path: '/topic/{topicName}',
  config: {
    tags: ['api'],
    description: 'Adds a message to {topicName}',
    validate: {
      payload: interfaces.message,
      params: {
        topicName: Joi.string().required()
      }
    },
    response: {
      schema : interfaces.result
    }
  },
  handler: function (req, reply) {
    return reply({
      successful: true
    });
  }
});
