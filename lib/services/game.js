var request = require('request');
var utils = require('../utils');
var Q = require('Q');
var beatsMusicService = require('./beatsmusic');

var pickRandomCard = function(cards) {
  var rand = utils.random(0, cards.length);
  return cards[rand];
}

var pickHand = function(cards) {
  var card;
  var hand = [];
  while(hand.length < 4) {
    card = pickRandomCard(cards);
    if(hand.indexOf(card) < 0) {
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
  url += "&limit=40";
  request(url, function(error, response, body) {
    var data = {};
    var winningId = null;
    if (!error && response.statusCode == 200) {
      var randoms = beatsMusicService.randomizeJustForYouRecs(JSON.parse(body), 40);
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
  var hand = {
    winning_id: pickRandomCard(handCards).id,
    cards: handCards
  };
  return hand;
}

module.exports = new GameService();
