var nconf = require('nconf');
var fs = require('fs');

nconf.env()
    .file({ file: './config/' + process.env.NODE_ENV + '.json' });

var mongoConfig = {
  username : nconf.get('mongodb:username'),
  password : nconf.get('mongodb:password'),
  database: nconf.get('mongodb:database')
}

var ConfigService = function() {};

ConfigService.prototype.get = function() {
  return nconf.get.apply(nconf, arguments);
}

// Responsible for building the various ways the mongo url can be setup
ConfigService.prototype.getMongoUrl = function() {
  console.log(process.env.NODE_ENV, mongoConfig);
  var host = nconf.get('mongodb:host') || { url: 'localhost', port: 27017 };
  var port = host.port || 27017;
  var database = mongoConfig.database || 'beatsme;'
  var options = mongoConfig.options;
  var username = mongoConfig.username;
  var password = mongoConfig.password;
  var constructHost = function(hostObj) {
    return hostObj.url + (hostObj.port ? ':' + hostObj.port : '');
  }

  var connectionString = ['mongodb://'];

  if(username && password) {
    connectionString.push(username + ':' + password);
    connectionString.push('@');
  }

  //If it's an array, then the user is specifying more than one connection
  if(host.push) {
    host.forEach(function(hostObj, index){
      //Don't need to add the comma on the first one.
      connectionString.push((index > 0 ? ',' : '') + constructHost(hostObj));
    });
  } else {
    connectionString.push(constructHost(host));
  }

  connectionString.push('/' + database);

  if(options) {
    connectionString.push('?' + options);
  }
  return connectionString.join("");
}

module.exports = new ConfigService();
