var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

schema.static('createOrUpdate', function (user, callback) {
  var model = this;

  var userName = user.name;
  var where = { name: userName };

  return model.findOne(where, function(err, foundUser) {
    if (err) return callback(err);
    if (foundUser) return callback(null, foundUser);

    model.create(user, callback);
  });
});

schema.options.toJSON = {
  transform: function(doc, ret, options) {
    return  {
      name: ret.name,
      image: ret.image
    };
  }
};

module.exports = mongoose.model('users', schema);