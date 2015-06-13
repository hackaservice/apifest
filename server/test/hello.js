(function () {

  'use strict';

  var code = require('code');
  var Lab = require('lab');
  var server = require('../server.js');
  var lab = exports.lab = Lab.script();

  lab.experiment('Hello Tests', function() {

    lab.test('main endpoint says \'Hello World!\'', function(done) {
      var options = {
        method: 'GET',
        url: '/'
      };

      server.inject(options, function(res) {
        code.expect(res.statusCode).to.equal(200);

        code.expect(res.result).to.equal("hello world!");

        done();
      });
    });

  });

}());