var server = require('./server');
var mongoose = require('mongoose');
var mongoUrl = require('./lib/services/config').getMongoUrl();

mongoose.connect(mongoUrl, function(e) {
  server(mongoose);
});
