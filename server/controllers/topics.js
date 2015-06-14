var interfaces = require('../interfaces.js'),
  Joi = require('joi'),
  Topics = require('../models/Topics'),
  User = require('../models/User'),
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
    description: 'get available topics for calling user',
    response: {
      schema : Joi.array().items({
        name: Joi.string().required(),
        text: Joi.string(),
        image: Joi.string(),
        user: Joi.string(),
        timestamp: Joi.string()
      })
    }
  },
  handler: function (req, reply) {
    console.log('GET /topics', req.params);
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
    console.log('topics:mine', req.params);

    var userName = req.params.name;
    if (!userName) {
      return reply([]);
    }

    return User.findByName(userName, function(err, user) {
      if (err) return reply(err);
      if (!user) return reply([]);

      return user.getTopics(reply);
    });
  }
});

