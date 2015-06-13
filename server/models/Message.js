var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  creator : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  message: {
    type: String,
    required: true
  },

  topic: {
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
    var result = {
      id: ret._id.toString(),
      creator: ret.creator,
      message: ret.message,
      date: ret.date
    };

    return result;
  }
};

module.exports = mongoose.model('Message', schema);