var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

schema.options.toJSON = {
  transform: function(doc, ret, options) {
    return  {
      id: ret._id.toString(),
      message: ret.message,
      date: ret.date
    };
  }
};

module.exports = mongoose.model('Message', schema);