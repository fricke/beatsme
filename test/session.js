var testGames = require('./tests/games');
var mongoose = require('mongoose');
var mongoUrl = require('../lib/services/config').getMongoUrl();


  describe('Session Mode Tests', function(){
    before(function(done){
      mongoose.connect(mongoUrl, function(e) {
          // If error connecting
        if(e) throw e;
        done();
      });
    });

    describe('webapp', function(){
      testGames(mongoose, false, true, 'webapp');
    });

  });
