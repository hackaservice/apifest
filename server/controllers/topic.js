var  _ = require('lodash'),
  async = require('async'),
  Joi = require('joi'),
  db = require('../db.js'),
  User = require('../models/User'),
  Message = require('../models/Message');

var routes = module.exports.routes = [];

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

    var topicName = payload.topic;

    return User.createOrUpdate(user, function(err, user) {
      console.log('User.createOrUpdate', err, user);

      // 1# mark user as online
      user.online();

      // 2# add topic to user
      user.addTopic(topicName);

      // 3# deja a este gallo en los usuarios del canal
      db.addUserToTopic(topicName, user.name);

      return db.countUsersByTopic(topicName, function(err, count) {
        if (err) return reply(err);

        return reply({
          topic: topicName,
          users: count
        });
      });
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
    validate: {
      payload: {
        name: Joi.string().required(),
        message: Joi.string().required(),
        topic: Joi.string().required()
      }
    },
    response: {
      schema : {
        name: Joi.string().required(),
        image: Joi.string().required(),
        topic: Joi.string().required(),
        message: Joi.string().required(),
        date: Joi.date()
      }
    },
    description: 'posts a message into a topic'
  },
  handler: function (req, reply) {
    console.log('topic:message', req.payload);

    // socket io (for broadcast)
    var io = req.server.plugins['hapi-io'].io;

    return async.waterfall([
      function getUser(callback) {
        var userName = req.payload.name;

        return User.findByName(userName, callback);
      },
      function saveMessage(user, callback) {
        if (!user) {
          return callback(new Error('no such user'));
        }

        var message = {
          message: req.payload.message,
          topic: req.payload.topic,
          creator: user._id
        };

        return Message.create(message, callback);
      }
    ], function(err, message) {
      if (err) return reply(err);

      return message.populate('creator', function(err, message) {
        if (err) return reply(err);


        var answer = {
          name: message.creator.name,
          image: message.creator.image,
          topic: message.topic,
          message: message.message,
          date: message.date
        };

        io.emit('topic:message:new', answer);
        return reply(answer);

      });
    });
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
    validate: {
      params: {
        topic: Joi.string().required()
      }
    },
    response: {
      schema : Joi.array().items({
        name: Joi.string().required(),
        image: Joi.string().required()
      })
    },
    description: 'logs you into a topic'
  },
  handler: function (req, reply) {
    console.log('topic:list:users', req.params || req.payload);

    var topicName = req.params.topic || req.payload.topic;

    return db.getUsersByTopic(topicName, function(err, users) {
      if (err) return reply(err);

      var where = {
        name: { $in : users }
      };

      return User.find(where, function(err, users) {
        if (err) return callback(err);

        var answer = _.map(users, function(user) {
          return user.toJSON();
        });

        return reply(answer);
      });
    });
  }
});
