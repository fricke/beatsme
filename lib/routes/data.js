var request = require('request');

module.exports = function(router) {

  require('./game')(router);
  require('./music')(router);

}
