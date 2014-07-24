var should = require('should');
var config = require('../../lib/services/config');
var User = require('../../lib/models/user');
var Game = require('../../lib/models/game');
var request = require('supertest');

var userId = "53c4eea2296c7000005459f7";

var user, game;

module.exports = function(mongoose, isOauth, isSession, whatClient) {

  var cookie;
  var app = require('../../server')(mongoose, isOauth, isSession);

  var errorResponseExpect = 'application/json; charset=utf-8';
  if(isSession) {
    errorResponseExpect = 'text/html; charset=utf-8';
  }

  describe('Games (oauth: ' + isOauth + ', session: ' + isSession + ', client: ' + whatClient + '', function() {
    before(function(done) {
      User.find({ _id: userId })
        .exec()
        .then(function(result){
            user = result;
            return result;
        })
        .then(function(){
          done();
        });
    });

    after(function(done){
        app.close(function(){
          done();
        });
    });

    describe('/oauth/beatsme/callback', function() {
      it('will log you in', function(done) {
        done();
      });
    });

    describe('POST /games', function(){
      it('return unauthorized for non-user');
      it('create new game for user', function(done){
        done();
      });
    });

    describe('GET /games', function(){
      it('return unauthorized for non-user');
      it('get all the games for the user');
    });

    describe('GET /games/:id', function(){});
    describe('PUT /games/:id', function(){});

    describe('GET /games/:id/hand', function(){});
    describe('PUT /games/:id/hand', function(){});

    describe('PUT /games/:id/guess', function(){});

    describe('GET /games/:id/points', function(){});
    describe('PUT /games/:id/points', function(){});

    describe('GET /games/:id/players', function(){});
    describe('PUT /games/:id/players', function(){});

  });
}
