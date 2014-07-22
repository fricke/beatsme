var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('favicon');
var ejs = require('ejs');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('../lib/services/config');
var responder = require('../lib/responder');

module.exports = function(app, router, mongoose) {
  // STATIC Routes
  require('../lib/routes/static')(app);
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
      url: config.getMongoUrl()
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function(req, res){
    var apiConfig = config.get('beatsmusic:apiConfig');
    responder(res, {
      template: 'index',
      data: {
        game: req.session.game || {},
        user: req.user || {},
        players: req.session.players || [],
        clientId: apiConfig.clientID
      }
    });
  });

  app.get('/play', function(req, res){
    res.json({});
  });

}
