var passport = require('passport');
var BeatsMusicStrategy = require('passport-beatsmusic').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var oauth2 = require('./oauth2');
var config = require('../services/config');
var responder = require('../responder');

module.exports = function(app) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new BeatsMusicStrategy(config.get('beatsmusic:apiConfig'),
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'external_ids': 'beatsmusic_' + profile.id }, function (err, user) {
          if (err) { return done(err); }
          var beatsMusicId = 'beatsmusic_' + profile.id;
          var providerJson = {
            beatsmusic: {
              id: profile.id,
              access_token: accessToken,
              refresh_token: refreshToken,
              json: profile._json
            }
          };
          if (!user) {
              user = new User({
                  displayName: profile.displayName,
                  username: profile.username,
                  external_ids: [beatsMusicId],
                  provider: providerJson
              });
              user.save(function(err, result) {
                return done(err, result);
              });
          } else {
              if(!user.provider.beatsmusic) {
                user.update({
                  $addToSet: {
                    external_ids: beatsMusicId
                  },
                  provider: providerJson
                }, function(err, result) {
                  return done(err, user);
                });
              } else {
                return done(err, user);
              }
          }
      });
    }
  ));
  passport.use(new BearerStrategy(
      function(accessToken, done) {
        AccessToken.findOne({ token: accessToken }, function(err, token) {
            if (err) { return done(err); }
            if (!token) { return done(null, false); }

            if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {
                AccessToken.remove({ token: accessToken }, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, { message: 'Token expired' });
            }

            User.findById(token.user_id, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false, { message: 'Unknown user' }); }

                var info = { scope: '*' }
                done(null, user, info);
            });
        });
      }
  ));

  app.get('/auth/beatsmusic',
    passport.authenticate('beatsmusic')
  );

  app.get('/auth/beatsmusic/callback',
    passport.authenticate('beatsmusic', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

}
