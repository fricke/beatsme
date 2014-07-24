// api.js

// Takes care of the oauth availability for the beatsme api

var passport = require('passport');

module.exports = function(app) {
  app.use(passport.initialize());
  var oauth2 = require('../lib/routes/oauth2');
  app.post('/oauth/token', oauth2.token);
}
