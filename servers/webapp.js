/*
  webapp.js
  The hook in for the webapp endpoints
*/

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('favicon');
var ejs = require('ejs');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('../lib/services/config');
var gameService = require('../lib/services/game');
var responder = require('../lib/responder');
var Q = require('q');

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
      url: config.getMongoUrl(),
      auto_reconnect: true
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // main entry of single page webapp
  app.get('/', function(req, res){
    var apiConfig = config.get('beatsmusic:apiConfig');
    var user = req.user;
    var userId = user ? user._id : null;
    Q.fcall(function(){
      if(!userId) return null;
      return gameService.getMostRecentGame(userId);
    })
      .then(function(game){
        responder(res, {
          template: 'index',
          data: {
            game: game,
            user: user || {},
            clientId: apiConfig.clientID
          }
        });
      })
      .fail(function(err){
        responder(res, {
          error: err
        });
      });
  });


  app.get('/play', function(req, res){
    res.json({});
  });

}
