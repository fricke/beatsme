var Q = require('Q');
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
      Game.find({ creator_id: req.user.id }, function(err, games){
        responder(res, { error: err, data: games });
      });
    })
    .post(function(req, res){
      if(!req.user) throw new UnauthorizedError();

      var game = new Game({
        creator_id: req.user._id,
        players: [ { id: req.user._id, username: req.user.username} ]
      });

      Q.fcall(function(){
        debugger;
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
          debugger;
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
      Game.findOne({ _id: req.params.id }, function(err, game) {
        responder(res, { error: err, data: game.toJSON() });
      });
    })
    .put(function(req, res){
      //Update game
    });

  /* /game/:id/cards routes */
  router.route('/game/:id/hand')
    .get(function(req, res){
      if(!req.user) throw new UnauthorizedError();
      var game;
      Q.fcall(function(){
          if(req.game) return req.game;
          return Game.findOne({ _id: req.params.id }).exec();
        })
        .then(function(result){
          game = result;
          var hand = gameService.getHand(game.cards);
          game.set('current_hand', hand);
          return Q.invoke(game, 'save');
        })
        .then(function(){
          debugger;
          return responder(res, { data: game.current_hand });
        })
        .fail(function(err){
          return responder(res, { error: err });
        });
    });

  /* /game/:id/guess routes */
  router.route('/game/:id/guess')
    .put(function(req, res){
      var winningId = req.user.winningId;
      var guessId = req.param('guessId');
      var message = 'failure';
      console.log("winning", winningId, "guessId", guessId);
      if(winningId === guessId) {
        message = 'success';
      }
      responder(res, { data : message });
    });

  /* /game/:id/points routes */
  router.route('/game/:id/points')
    .get(function(req, res){
      var game = req.session.game;
      var userId, playersStats;

      if(!game) { return new NotFoundError() };

      userId = req.params('userId');
      if(!userId) {
        userId = req.user.id;
      }
      playersStats = game.players_stats[userId];
      if(!playersStats) {
        throw new UnauthorizedError();
      }
      responder(res, { data : message });
    })
    .put(function(req, res){
      var action = req.param('action');
      var userId = req.param('userId') || req.user.id;
      var players = req.session.players;
        Game.update({
          _id: req.session.game.id
        }, {

        });

      responder(res, {  data: message });
    });


  router.route('/game/:id/players')
    .get(function(req, res){

    })
    .put(function(req, res){

    });
}
