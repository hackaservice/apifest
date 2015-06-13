var interfaces = require('../interfaces.js');
var routes = module.exports.routes = [];

routes.push({
  method: 'GET',
  path: '/user',
  config: {
    tags: ['api'],
    description: 'get current user',
    response: {
      schema : interfaces.user
    }
  },
  handler: function (request, reply) {
    return reply({
      id: "super-id-1234",
      name: "Eugenio Yarad"
    });
  }
});

routes.push({
  method: 'GET',
  path: '/user/topics',
  config: {
    tags: ['api'],
    description: 'get topics selected by current user',
    response: {
      schema : interfaces.topics
    }
  },
  handler: function (request, reply) {
    var mock = [
      {
        name: "tema A" + request.params.userId
      },
      {
        name: "tema B" + request.params.userId
      },
      {
        name: "tema C" + request.params.userId
      }
    ];

    return reply(mock);
  }
});
