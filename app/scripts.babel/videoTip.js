function onYouTubeIframeAPIReady() {
  PreviewPlayer.onYouTubeIframeAPIReady();
}

var PreviewPlayer = (function(window) {
  var _this = {};
  var player;
  var params = {
    height: 270,
    videoId: '',
    width: 480,
  };
  var config = {
    mute: false,
    playbackQuality: 'small',
    playbackRate: 1,
    startAt: 0,
  };
  var _messageHandler = {
    updateConfigs: function(_config) {
      config = Object.assign(config, _config)
    },
    stopVideo: function() {
      player && player.stopVideo();
    },
    pauseVideo: function() {
      player && player.pauseVideo();
    },
    playVideo: function() {
      player && player.playVideo();
    },
    seekTo: function({ seconds, allowSeekAhead }) {
      player && player.seekTo(seconds, allowSeekAhead);
    }
  };

  function getParams(searcParams) {
    var params = {};
    searcParams.replace(/([^=&]+)=([^&]*)/g, function(m, key, value) {
      if (value) params[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return params;
  }

  function initialize() {
    var _params = getParams(window.location.search);
    Object.assign(params, _params);

    window.addEventListener('message', function(evt) {
      var { message, data = null } = evt.data;

      if (message && typeof _messageHandler[message] === 'function') {
        _messageHandler[message](data);
      }
    }, false);

    postMessage({ message: 'iframeOnLoad' });
  }

  function postMessage(data) {
    window.parent.postMessage(data, '*');
  }

  _this.onYouTubeIframeAPIReady = function() {
    console.log('youtubeIframeAPIReady', performance.now());
    var { width, height, videoId } = params;
    var { startAt } = config;

    player = new YT.Player('player', {
      height: height,
      width: width,
      videoId: videoId,
      playerVars: {
        start: startAt,
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  }

// function jumpTo() {
//   var currentTime = player.getCurrentTime();
//   player.seekTo(currentTime + 10, true);
// }

  function onPlayerReady(event) {
    console.log('onPlayerReady', performance.now());

    // setInterval(function() {
    //   console.log('hello', player.getCurrentTime());
    // }, 1000);

    setConfig(config);
  }

  function setConfig({ playbackRate, playbackQuality, mute }) {
    player.setPlaybackQuality(playbackQuality);
    player.setPlaybackRate(playbackRate);
    if (mute) {
      player.mute();
    } else {
      player.unMute();
    }
  }

  function onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log('onPlayerStateChange:PLAYING', performance.now(), player);
      break;
      case YT.PlayerState.PAUSED:
      break;
      case YT.PlayerState.ENDED:
      break;
    }
  }

  function onPlayerError(evt) {
    console.log('evt', evt);
  }

  initialize();

  return _this;

})(window);
