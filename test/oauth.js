var testGames = require('./tests/games');
var mongoose = require('mongoose');
var mongoUrl = require('../lib/services/config').getMongoUrl();

describe('Oauth Mode Tests', function(){
  before(function(done){
    mongoose.connect(mongoUrl, function(e) {
      if(e) throw e;
      done();
    });
  });

  after(function(done){
    mongoose.disconnect(function(){
      done();
    })
  });

  describe('iphone', function(){
    testGames(mongoose, true, false, 'iphone');
  });

});
