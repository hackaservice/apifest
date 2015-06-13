var Joi = require('joi');

var Topic = Joi.object({
  name: Joi.string().required()
});

var User = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required()
});

var Message = Joi.object({
  user: Joi.string().required(),
  content: Joi.string().required(),
  timestamp: Joi.date()
});

module.exports = {
  topic: Topic,
  user: User,
  message: Message
};


