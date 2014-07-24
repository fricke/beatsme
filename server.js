// server.js

// main server setup, w/ toggle between oauth and session based end points.

require('./lib/logging');

var isSession = false;

var express = require('express');
var http = require('http');
var winston = require('winston');
var expressWinston = require('express-winston');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });
var config = require('./lib/services/config');
var responder = require('./lib/responder');

var start = function(mongoose) {

  var domain = config.get('webapp:domain');
  var port = process.env.PORT || config.get('webapp:port');
  var app = express();
  var router = express.Router();


  var useApi = config.get('oauth');


  app.set('port', process.env.BEATSME_PORT || port);
  app.set('domain', process.env.BEATSME_DOMAIN || domain);

  app.use(require('winston-request-logger').create(logger, {
      'responseTime': ':responseTime ms',
      'url': ':url[path]'
  }));

  require('./servers/webapp')(app, router, mongoose);


  // TODO: session/oauth
  // if(isSession) {
  //   require('./servers/webapp')(app, router, mongoose);
  // } else {
  //   require('./servers/api')(app);
  // }


  app.use('/', router);

  require('./lib/routes/auth')(app);

  // REST Routes
  require('./lib/routes/index')(router);

  // ERROR
  app.get('*', function(req, res, next) {
    var err = new Error();
    err.statusCode = 404;
    next(err);
  });

  app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }));


  var server = app.listen(port, app.get('domain'), function () {
    console.log('Express server listening at: %s on port: %s ', app.get('domain'), app.get('port'));
  });
  return server;
}

module.exports = start;
