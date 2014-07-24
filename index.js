// index.js

// main entry point for app.  opens mongoose and starts the server


var server = require('./server');
var mongoose = require('mongoose');
var mongoUrl = require('./lib/services/config').getMongoUrl();

console.log('WE ARE WAKING UP, mongoUrl: %s', mongoUrl);

mongoose.connect(mongoUrl, function(e) {
  server(mongoose, true, false);
});
