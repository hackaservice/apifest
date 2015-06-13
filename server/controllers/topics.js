var interfaces = require('../interfaces.js'),
  Joi = require('joi'),
  Topics = require('../models/Topics'),
  _ = require('lodash');

var db = require('../db.js');
var routes = module.exports.routes = [];

var Topic = Joi.object({
  name: Joi.string().required(),
  img: Joi.string(),
  data: Joi.array(),
  description: Joi.string()
});

routes.push({
  method: 'GET',
  path: '/topics',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topics:list'
    },
    description: 'get available topics for calling user',
    response: {
      schema : Joi.array().items({
        name: Joi.string().required()
      })
    }
  },
  handler: function (req, reply) {
    console.log('topics:list');
    return Topics.listTopics(reply);
  }
});

routes.push({
  method: 'GET',
  path: '/topics/{name}',
  config: {
    tags: ['api'],
    description: 'get topics for calling user: {name}',
    validate: {
      params: {
        name: Joi.string().required()
      }
    },
    response: {
      schema : Joi.array()
    }
  },
  handler: function (req, reply) {
    console.log('topics:mine');

    var user = (req.params || req.payload).name
    var channels = _.keys(db.userTopics[user]);

    var answer = _.map(channels, function(channel) {
      name: channel
    });

    return reply(answer);
  }
});

