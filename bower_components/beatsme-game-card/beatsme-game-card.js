Polymer('beatsme-game-card', {
  track: null,
  album: null,
  artists: null,
  created: function(){
    this.clientId = this.clientId || localStorage.getItem('clientId');
  },
  handleDataResponse: function(event, response) {
    var album = {};
    var cover = [];
    this.track = response.response.data.data;
    album = this.track.refs.album;
    cover.push('https://partner.api.beatsmusic.com/v1/api/albums/');
    cover.push(album.id);
    cover.push('/images');
    album.cover = cover.join("");
    this.album = album;
    this.artists = this.track.refs.artists;
    this.fire('card-loaded');
  }
});
