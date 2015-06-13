var interfaces = require('../interfaces.js'),
  _ = require('lodash'),
  Joi = require('joi');

var routes = module.exports.routes = [];

// diccionario de topics y todos sus participanes (set de parcipantes)
var db = require('../db.js');

routes.push({
  method: 'POST',
  path: '/topic/login',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topic:login'
    },
    response: {
      schema : {
        topic: Joi.string().required(),
        users: Joi.number()
      }
    },
    validate: {
      payload: {
        name: Joi.string().required(),
        image: Joi.string().required(),
        topic: Joi.string().required()
      }
    },
    description: 'logs you into a topic'
  },
  handler: function (req, reply) {
    console.log('topic:login', req.payload);

    var payload = req.payload;

    var user = {
      name: payload.name,
      image: payload.image
    };

    // 1) deja a este gallo en el set general de usuarios
    db.users[payload.name] = db.users[payload.name] || {};
    db.users[payload.name] = user;

    db.userTopics[payload.name] = db.userTopics[payload.name] || {}
    db.userTopics[payload.name][payload.topic] = true;
    db.addTopicToUser(user.name, payload.topic);


    // 2) deja a este gallo en los usuarios del canal
    db.topics[payload.topic] = db.topics[payload.topic] || {};
    db.topics[payload.topic][payload.name] = db.topics[payload.topic][payload.name] || user;
    db.addUserToTopic(payload.topic, user.name);

    return reply({
      topic: payload.topic,
      users: _.size(db.topics[payload.topic])
    });
  }
});

routes.push({
  method: 'POST',
  path: '/topic/message',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topic:message'
    },
    response: {
      schema : {
        name: Joi.string().required(),
        image: Joi.string().required(),
        topic: Joi.string().required(),
        message: Joi.string().required(),
      }
    },
    validate: {
      payload: {
        name: Joi.string().required(),
        message: Joi.string().required(),
        topic: Joi.string().required()
      }
    },
    description: 'posts a message into a topic'
  },
  handler: function (req, reply) {
    console.log('topic:message', req.payload);

    var answer = _.extend(req.payload, db.users[req.payload.name]);

    var io = req.server.plugins['hapi-io'].io;
    io.emit('topic:message:new', answer);

    return reply(answer);
  }
});

routes.push({
  method: 'GET',
  path: '/topic/{topic}/users',
  config: {
    tags: ['api'],
    plugins: {
      'hapi-io': 'topic:list:users'
    },
    response: {
      schema : Joi.array().items({
        name: Joi.string().required(),
        image: Joi.string().required()
      })
    },
    validate: {
      params: {
        topic: Joi.string().required()
      }
    },
    description: 'logs you into a topic'
  },
  handler: function (req, reply) {
    console.log('topic:list:users', req.params || req.payload);

    var topicName = req.params.topic || req.payload.topic;
    var answer = _.values(db.topics[topicName]);

    return reply(answer);
  }
});
