var request = require('request');
var utils = require('../utils');
var Q = require('Q');
var beatsMusicService = require('./beatsmusic');
var Game = require('../models/game');

var pickRandomCard = function(cards) {
  var rand = utils.random(0, cards.length - 1);
  console.log('rand', rand, cards.length - 1);
  return cards[rand];
}

var pickHand = function(cards) {
  var card;
  var hand = [];
  while(hand.length < 4) {
    card = pickRandomCard(cards);
    if(card && hand.indexOf(card) < 0) {
      hand.push(card);
    }
  }
  return hand;
}

var GameService = function() {};

GameService.prototype.getCards = function(req) {
  var deferred = Q.defer();
  var beatsMusicUserData = req.user.provider.beatsmusic;
  var beatsMusicUserId = beatsMusicUserData.id;
  var url = beatsMusicService.getRecommendationsUrl(beatsMusicUserId, beatsMusicUserData.access_token);
  url += "&limit=100";
  request(url, function(error, response, body) {
    var data = {};
    var winningId = null;
    if (!error && response.statusCode == 200) {
      var randoms = beatsMusicService.randomizeJustForYouRecs(JSON.parse(body), 100);
      data["cards"] = randoms.tracks;
      return deferred.resolve(data);
    }
    deferred.reject(new Error('Unable to get data from BeatsMusic', error));
  });
  return deferred.promise;
}

GameService.prototype.getHand = function(cards) {
  if(!cards || !cards.length) return;
  var handCards = pickHand(cards);
  var winner = pickRandomCard(handCards);
  var hand = {
    winning_id: winner.id,
    cards: handCards
  };
  return hand;
}

GameService.prototype.getPoints = function(stats) {
  if(!stats) return 0;
  var sum = 0;

  var numGuesses = stats.numGuesses ? parseInt(stats.numGuesses, 10) : 0;
  if(numGuesses > 0 && numGuesses < 4) {
    sum += (4 - stats.numGuesses) * 10;
  }
  var timeSelected = stats.timeSelected ? parseFloat(stats.timeSelected, 10) : 0;
  if(timeSelected > 0 && timeSelected < 30) {
    sum += (70/timeSelected);
  }


  //TODO: Hack, need to remove
  if(stats.skipped && stats.skipped == "true") {
    sum -= 75;
  }
  if(stats.timeout && stats.timeout == "true") {
    sum -= 25;
  }
  return Math.ceil(sum);
}

GameService.prototype.getMostRecentGame = function(userId) {
  var deferred = Q.defer();
  Game.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, result){
      if(err) return deferred.reject(err);
      return deferred.resolve(result);
  });
  return deferred.promise;
}

module.exports = new GameService();
