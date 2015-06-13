var Joi = require('joi');


var User = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required()
});

var Message = Joi.object({
  name: Joi.string().required(),
  content: Joi.string().required(),
  timestamp: Joi.date()
});

module.exports = {
  user: User,
  message: Message
};


