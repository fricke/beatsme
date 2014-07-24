// game.js

// Game routes

var Q = require('q');
var Game = require('../models/game');
var gameService = require('../services/game');
var beatsMusicService = require('../services/beatsmusic');
var responder = require('../responder');
var NotFoundError = require('../errors/notfound');
var UnauthorizedError = require('../errors/unauthorized');

module.exports = function(router) {

  /* /games REST routes */
  router.route('/games')
    .get(function(req, res){
      if(!req.user) throw new UnauthorizedError();
      Game.find({ creator_id: req.user._id }, function(err, games){
        responder(res, { error: err, data: games });
      });
    })
    .post(function(req, res){
      if(!req.user) throw new UnauthorizedError();

      var game = new Game({
        creator_id: req.user._id,
        players: [ { id: req.user._id, username: req.user.username, points: 0} ]
      });

      Q.fcall(function(){
        return gameService.getCards(req);
      })
        .then(function(result) {
          game.set('cards', result.cards);
          return game;
        })
        .then(function(result){
          var hand = gameService.getHand(game.cards);
          game.set('current_hand', hand);
          return Q.invoke(game, 'save');
        })
        .then(function(){
          return responder(res, {
            data: {
              id: game._id,
              current_hand: game.current_hand,
              players: game.players,
              creator_id: game.creator_id
            }
          });
        })
        .fail(function(err){
          return responder(res, { error: err });
        });
    });

  /* /games/:id REST routes */
  router.route('/game/:id')
    .get(function(req, res){
      if(!req.user) throw new UnauthorizedError();
      var game;
      Q.fcall(function(){
        return Game.findOne({ _id: req.params.id }).exec();
      })
        .then(function(result){
          debugger;
          game = result;
          var hand = gameService.getHand(game.cards);
          game.set('current_hand', hand);
          game.markModified('current_hand');
          return Q.invoke(game, 'save');
        })
        .then(function(){
          return responder(res, {
            data: {
              id: game._id,
              current_hand: game.current_hand,
              players: game.players,
              creator_id: game.creator_id
            }
          });
        })
        .fail(function(err){
          return responder(res, { error: err });
        });
    })

  /* /game/:id/cards routes */
  router.route('/game/:id/hand')
    .get(function(req, res){
      if(!req.user) throw new UnauthorizedError();
      var game;
      if(!req.params) {
        debugger;
      }
      Q.fcall(function(){
          return Game.findOne({ _id: req.params.id }).exec();
        })
        .then(function(result){
          game = result;
          var hand = gameService.getHand(game.cards);
          game.set('current_hand', hand);
          return Q.invoke(game, 'save');
        })
        .then(function(){
          return responder(res, { data: game.current_hand });
        })
        .fail(function(err){
          return responder(res, { error: err });
        });
    });

  /* /game/:id/points routes */
  router.route('/game/:id/points')
    .put(function(req, res){
      var game, points, player;
      debugger;
      var userId = req.param('userId') || req.user._id;
      var handStats = {
        timeSelected: req.param('timeSelected'),
        numGuesses: req.param('numGuesses'),
        skipped: req.param('skipped'),
        timeout: req.param('timeout')
      }

      Q.fcall(function(){
        return Game.findOne({ _id: req.params.id }).exec();
      })
        .then(function(result){
          game = result;
          debugger;
          points = gameService.getPoints(handStats);
          game.players.forEach(function(model){
            if(model.id === userId) {
              player = model;
              player.points = (player.points || 0) + points;
            }
          });
          game.set('players', game.players.toObject());
          game.markModified('players');
          return Q.invoke(game, 'save');
        })
        .then(function(result){
          return responder(res, {
            data: {
              id: game._id,
              player: player,
              points: points
            }
          });
        })
        .fail(function(err){
          return responder(res, { error: err });
        });
    });


  // router.route('/game/:id/players')
  //   .get(function(req, res){
  //
  //   })
  //   .put(function(req, res){
  //
  //   });
}
