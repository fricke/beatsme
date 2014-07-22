var utils = require('../utils');
var config = require('./config');
var beatsMusicUrls = config.get('beatsmusic:urls');
var beatsMusicConfig = config.get('beatsmusic:apiConfig');

var BeatsMusicService = function() {};

BeatsMusicService.prototype.randomizeJustForYouRecs = function(origData, amount) {
  if(!origData) return;
  var outputTracks = [];
  var alreadyGrabbed = [];
  var recommendations = origData.data;

  var content, track, choice, tracks, random;

  recommendations = utils.randomizeArray(recommendations);
  recommendations.forEach(function(recommendation, index){
    if(index >= amount) return;
    content = recommendation.content;
    tracks = content.refs.tracks;
    choice = utils.random(0, tracks.length - 1);
    track = tracks[choice];
    outputTracks.push(track);
  });
  return { tracks: outputTracks };
}


BeatsMusicService.prototype.getRecommendationsUrl = function(userId, accessToken) {
  var url = [beatsMusicUrls.base, beatsMusicUrls.users];
  url.push('/');
  url.push(userId);
  url.push(beatsMusicUrls.justForYouEndPoint);
  url.push('?');
  url.push('time_zone=0800');
  url.push('&access_token=' + accessToken);
  return url.join("");
}

BeatsMusicService.prototype.getTracksUrl = function(trackId) {
  var url = [beatsMusicUrls.base, beatsMusicUrls.tracks];
  url.push('/');
  url.push(trackId);
  url.push('?');
  url.push('client_id=' + beatsMusicConfig.clientID);
  return url.join("");
}

module.exports = new BeatsMusicService();
