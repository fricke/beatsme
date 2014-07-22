var beatsMusicService = require('../services/beatsmusic');

module.exports = function(router) {
  router.route('/music/tracks/:id')
    .get(function(req, res){
      var url = beatsMusicService.getTracksUrl(req.params.id);
      request(url, function(error, response, body){
        var data = null;
        if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
        }
        responder(req, res, { error: error, data: data });
      });
    });
}
