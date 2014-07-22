require('./lib/logging');

var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var http = require('http');
var ejs = require('ejs');
var winston = require('winston');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('favicon');
var methodOverride = require('method-override');
var expressWinston = require('express-winston');
var passport = require('passport');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({colorize:true}) ] });
var config = require('./lib/services/config');
var responder = require('./lib/responder');
var port = config.get('port');
var mongoUrl = config.getMongoUrl();

var app = express();

mongoose.connect(mongoUrl);

app.set('port', process.env.BEATSME_PORT || 8080);

app.use(require('winston-request-logger').create(logger, {
    'responseTime': ':responseTime ms',
    'url': ':url[path]'
}));

app.use(passport.initialize());

if(process.env.BEATSME_API_PROCESS == "on") {
  var oauth2 = require('./lib/routes/auth/oauth2');
  app.post('/oauth/token', oauth2.token);
} else {
  // STATIC Routes
  require('./lib/routes/static')(app);
  app.set('views', './dist/html');
  app.set('view engine', 'html');
  app.engine('html', ejs.renderFile);

  //app.use(favicon('dist/favicon.ico'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    secret: config.get('session:secret'),
    store: new MongoStore({
      url: mongoUrl
    })
  }));
  app.use(passport.session());

debugger;
  app.get('/', function(req, res){

    var apiConfig = config.get('beatsmusic:apiConfig');
    responder(req, res, {
      template: 'index',
      data: {
        game: req.session.game || {},
        user: req.user || {},
        players: req.session.players || [],
        clientId: apiConfig.clientID
      }
    });
  });
}


//Logs errors as json and colors the out to console
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));


require('./lib/routes/auth/main')(app);

// REST Routes
require('./lib/routes/api')(express.Router());

http.createServer(app).listen(app.get('port'), 'www.beatsme.com', function () {
  console.log('Express server listening on port ' + app.get('port'));
});
