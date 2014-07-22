require('./lib/logging');

var express = require('express');
var http = require('http');
var winston = require('winston');
var expressWinston = require('express-winston');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });
var config = require('./lib/services/config');
var mongoose = require('mongoose');
var mongoUrl = config.getMongoUrl();
var responder = require('./lib/responder');

var app = express();
var router = express.Router();

mongoose.connect(mongoUrl);

app.set('port', process.env.BEATSME_PORT || 8080);

app.use(require('winston-request-logger').create(logger, {
    'responseTime': ':responseTime ms',
    'url': ':url[path]'
}));

if(process.env.BEATSME_API_PROCESS == "on") {
  require('./servers/api')(app);
} else {
  require('./servers/webapp')(app, router);
}

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

app.use('/', router);

require('./lib/routes/auth')(app);

// REST Routes
require('./lib/routes/data')(router);

app.use(function(err, req, res, next) {
  responder(res, { error: err });
});

http.createServer(app).listen(app.get('port'), 'www.beatsme.com', function () {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
