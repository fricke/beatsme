var should = require('should');
var config = require('../lib/services/config');
var app = require('../server');
var mongoose = require('mongoose');
var User = require('../lib/models/user');
var Game = require('../lib/models/game');
var request = require('supertest');

var userId = "53c4eea2296c7000005459f7";

var user, game;

module.exports = function(isOauth, isSession, whatClient) {
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
      Game.remove().exec().then(function(){ done() });
    });

    describe('POST /games', function(){
      it('not allow creation of game for non user', function(done){
        done();
      });
      it('create new game for user', function(done){
        done();
      });
    });

    describe('GET /games', function(){
      it('return unauthorized for non-user', function(done){
        request(app)
          .get('/games')
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(401)
          .end(function(err, res){
            if(err) throw err;
            done();
          });
      });
      it('get all the games for the user', function(done){
        done();
      });
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
