// Set configuration root directory
process.env.GETCONFIG_ROOT = './config';

// Configure default environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load modules
var _ = require('lodash');
var Hapi = require('hapi');
var Glob = require('glob');
var ip = require('ip').address();

var hapiSwaggered = require('hapi-swaggered')
var hapiSwaggeredUi = require('hapi-swaggered-ui')

// Load configuration
var Config = require('getconfig');

// Load database configuration
var mongooseLoader = require('./config/mongoose');

// Instantiate server
var server = new Hapi.Server();

// Establish connection
server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || Config.api.port || 3000,
  routes: {
    cors: {
      origin: ['*']
    }
  },
  labels: ['api']
});

server.connection({
  host: ip,
  port: (process.env.PORT + 1) || Config.socket.port || 3001,
  routes: {
    cors: {
      origin: ['*']
    }
  },
  labels: ['socket']
});

// Load controllers
var controllers = Glob.sync('controllers/*.js', {});

_.forEach(controllers, function (controller) {
  var routes = require(__dirname + '/' + controller).routes;

  if (_.isEmpty(routes)) {
    console.log('- no routes from %s', controller);
  } else {
    console.log('- loading %d routes from %s', routes.length, controller);
    server.route(routes);
  }
});

// Load models
mongooseLoader(function() {
  var models = Glob.sync('models/*.js', {});
  _.forEach(models, function (model) {
    require(__dirname + '/' + model);
    console.log('- Loaded model from %s', model);
  });
});

// socket.io
server.select('socket').register({
  register: require('hapi-io')
}, function(err) {
  if (err) throw err;
});

server.register({
  register: hapiSwaggered,
  options: {
    tags: {
      '/foobar': 'Example foobar description'
    },
    info: {
      title: 'Example API',
      description: 'Tiny hapi-swaggered example',
      version: '1.0'
    }
  }
}, {
  select: 'api',
  routes: {
    prefix: '/swagger'
  }
}, function (err) {
  if (err) throw err;
});

server.register({
  register: hapiSwaggeredUi,
  options: {
    title: 'Example API',
    authorization: {
      field: 'apiKey',
      scope: 'query' // header works as well
    }
  }
}, {
  select: 'api',
  routes: {
    prefix: '/docs'
  }
}, function (err) {
  if (err) throw err;
});

server.route({
  path: '/',
  method: 'GET',
  handler: function (request, reply) {
    reply.redirect('/docs')
  }
});

if (!module.parent) {
  server.start(function () {
    console.info('Server started at ' + server.info.uri);
  });
}

module.exports = server;
