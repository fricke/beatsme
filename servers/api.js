
module.exports = function(app) {
  app.use(passport.initialize());
  var oauth2 = require('../lib/routes/auth/oauth2');
  app.post('/oauth/token', oauth2.token);
}
