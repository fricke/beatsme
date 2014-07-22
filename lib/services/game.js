

var GameService = function() {};

GameService.prototype.getCards = function(req, callback) {
  var beatsMusicUserData = req.user.provider.beatsmusic;
  var beatsMusicUserId = beatsMusicUserData.id;
  var url = beatsMusicService.getRecommendationsUrl(beatsMusicUserId, beatsMusicUserData.access_token);
  var limit = req.params.limit || 4;
  request(url, function(error, response, body) {
    var data = null;
    var winningId = null;
    if (!error && response.statusCode == 200) {
      data = JSON.parse(body);
      data = beatsMusicService.randomizeJustForYouRecs(data, limit);

      //TODO: remove, temporary
      data["cards"] = data["tracks"];

      winningId = beatsMusicService.findWinningTrackId(data.cards);
      data.winningId = winningId;
    }
    callback(error, data);
  });
}

module.exports = new GameService();
