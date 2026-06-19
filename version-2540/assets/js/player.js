(function () {
  window.initVideoPlayer = function (videoId, buttonId, overlayId, source) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    if (!video || !button || !overlay || !source) {
      return;
    }
    var ready = false;
    var attach = function () {
      if (!ready) {
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var playResult = video.play();
      if (playResult && playResult.catch) {
        playResult.catch(function () {});
      }
    };
    button.addEventListener('click', attach);
    overlay.addEventListener('click', attach);
    video.addEventListener('click', function () {
      if (!ready) {
        attach();
      }
    });
  };
})();
