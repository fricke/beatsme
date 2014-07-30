function createAudioManager(options) {
  var that = this;
  var progressBar = options.progressBar || {};
  var externalController = options.externalController || {};
  var accessToken = options.accessToken;
  var beatsMusicUserId = options.beatsMusicUserId;
  var stopClipProgress = false;

  var bam = new BeatsAudioManager();
  bam.on("ready", handleReady);
  bam.on("error", handleError);
  bam.on("timeupdate", handleTimeUpdate);
  bam.on("ended", handleEnded);

  function handleReady(success) {
    if (!success) {
        debug("initialization failed");
        return;
    }
  };

  function handleEnded() {
    that.fire('track-ended');
  }

  function handleError(value) {
    console.log("bam: handleError", value);
  };

  function handleTimeUpdate(time) {
    if(!bam.started) {
      return;
    }
    var currentTime = bam.currentTime;
    var newValue = (currentTime/30) * 100;
    newValue = newValue > 100 ? 100 : newValue;
    if(!stopClipProgress) {
      progressBar.value = newValue;
    }

    externalController.value = (currentTime/bam.duration) * 100;

    if(newValue === 100 && !bam.clipEnded) {
      bam.clipEnded = true;
      that.fire('clip-ended', {});
    }
  };
  function stop(){
    bam.started = false;
    progressBar.value = 0;
    externalController.value = 0;
    bam.stop();
  }
  function pause() {
    bam.started = false;
    bam.pause();
  }
  function load(trackId) {

    bam.authentication = {
        access_token: accessToken,
        user_id: beatsMusicUserId
    };
    bam.identifier = trackId;
    bam.started = true;
    bam.clipEnded = false;
    progressBar.value = 0;
    externalController.value = 0;
    stopClipProgress = false;
    bam.load();
  }

  return {
    getTime: function(){
      return bam.currentTime;
    },
    load: function(trackId) {
      load(trackId);
    },
    pause: function() {
      pause();
    },
    stop: function(){
      stop();
    },
    setExternalController: function(controller) {
      externalController = controller;
    },
    stopClipProgress: function(){
      stopClipProgress = true;
    }
  }
}


Polymer('beatsme-player', {
  accessToken: null,
  clientId: null,
  beatsMusicUserId: null,
  audioManager: null,
  ready: function() {
    this.clientId = this.clientId || localStorage.getItem('clientId');
    this.accessToken = this.accessToken || localStorage.getItem('accessToken');
    this.beatsMusicUserId = this.beatsMusicUserId || localStorage.getItem('beatsMusicUserId');
    this.progressBar = this.shadowRoot.querySelector('paper-progress#gameTimeline')
    this.loadAudioPlayer();
  },
  load: function(){
    this.resetProgressColor();
    this.audioManager.load(this.trackId, this.externalController);
  },
  stop: function() {
    this.audioManager.stop();
  },
  pause: function() {
    this.audioManager.pause();
  },
  getTime: function(){
    return this.audioManager.getTime();
  },
  loadAudioPlayer: function(){
    this.audioManager = createAudioManager.call(this, {
      accessToken: this.accessToken,
      beatsMusicUserId: this.beatsMusicUserId,
      progressBar: this.progressBar
    });
  },
  trackIdChanged: function(e) {
    this.load();
  },
  externalControllerChanged: function(){
    this.audioManager.setExternalController(this.externalController);
  },
  setProgressRed: function() {
    this.shadowRoot.querySelector('paper-progress').className = 'red';
  },
  resetProgressColor: function() {
    this.shadowRoot.querySelector('paper-progress').className = '';
  },
  flashRed: function(){
    this.setProgressRed();
    setTimeout(this.resetProgressColor.bind(this), 500);
  },
  stopClipProgress: function(){
    this.audioManager.stopClipProgress();
  }
});
