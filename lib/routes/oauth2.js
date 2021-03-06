// oauth2.js

// Mainly borrowed from http://aleksandrov.ws/2013/09/12/restful-api-with-nodejs-plus-mongodb/
// Used previous in a project to provide oauth access/refresh tokens

var oauth2orize    = require('oauth2orize');
var passport       = require('passport');
var crypto         = require('crypto');
var config         = require('../services/config');
var mongoose       = require('mongoose');
var User           = require('../models/user');
var Client         = require('../models/client');
var AccessToken    = require('../models/accesstoken');
var RefreshToken   = require('../models/refreshtoken');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshToken.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }

        User.findById(token.user_id, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            RefreshToken.remove({ user_id: user.userId, client_id: client.clientId }, function (err) {
                if (err) return done(err);
            });
            AccessToken.remove({ user_id: user.userId, client_id: client.clientId }, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');
            var token = new AccessToken({ token: tokenValue, client_id: client.clientId, user_id: user.userId });
            var refreshToken = new RefreshToken({ token: refreshTokenValue, client_id: client.clientId, user_id: user.userId });
            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });
            var info = { scope: '*' }
            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
            });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['basic'], { session: false }),
    server.token(),
    server.errorHandler()
]
