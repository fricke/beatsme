require('./lib/logging');

var express = require('express');
var http = require('http');
var winston = require('winston');
var expressWinston = require('express-winston');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });
var config = require('./lib/services/config');
var responder = require('./lib/responder');

var start = function(mongoose, isOauth, isSession) {
  //defaults to isSession
  if(!isOauth && !isSession) {
    isSession = true;
  }
  var app = express();
  var router = express.Router();
  var domain, port;

  if(isSession) {
    domain = config.get('webapp:domain');
    port = config.get('webapp:port');
  } else {
    domain = config.get('api:domain');
    port = config.get('api:port');
  }

  var useApi = config.get('oauth');


  app.set('port', process.env.BEATSME_PORT || port);
  app.set('domain', process.env.BEATSME_DOMAIN || domain);

  app.use(require('winston-request-logger').create(logger, {
      'responseTime': ':responseTime ms',
      'url': ':url[path]'
  }));


  if(isSession) {
    require('./servers/webapp')(app, router, mongoose);
  } else {
    require('./servers/api')(app);
  }


  app.use('/', router);

  require('./lib/routes/auth')(app);

  // REST Routes
  require('./lib/routes/data')(router);

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
  app.use(function(err, req, res, next) {
    responder(res, {
      template: isSession ? err.statusCode : null,
      error: err
    });
  });

  var server = app.listen(app.get('port'), app.get('domain'), function () {
    console.log('Express server listening at: %s on port: %s ', app.get('domain'), app.get('port'));
  });
  return server;
}

module.exports = start;
