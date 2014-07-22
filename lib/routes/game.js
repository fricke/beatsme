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
      var game = new Game({
        creator_id: req.user.id,
        players: [ req.user.id ],
        start: 0,
        length: 100
      });
      game.gamer_stats[req.user.id] = {
        score: 0,
        winning_cards: []
      };
      gameService.getCards(function(error, data) {
        if(error) return responder(res, { err: error, data: data });
        game['winning_id'] = data.winningId;
        game['cards'] = data.cards;
        game.save(function(err, game){
          responder(res, { error: err, data: game.toJSON() });
        });
      });
    });

  /* /games/:id REST routes */
  router.route('/games/:id')
    .get(function(req, res){
      Game.findOne({ _id: req.params.id }, function(err, game) {
        responder(res, { error: err, data: game.toJSON() });
      });
    })
    .put(function(req, res){
      //Update game
    });

  /* /games/:id/cards routes */
  router.route('/games/:id/hand')
    .put(function(req, res){

    })
    .get(function(req, res){

    });

  /* /games/:id/guess routes */
  router.route('/games/:id/guess')
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

  /* /games/:id/points routes */
  router.route('/games/:id/points')
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


  router.route('/games/:id/players')
    .get(function(req, res){

    })
    .put(function(req, res){

    });
}
