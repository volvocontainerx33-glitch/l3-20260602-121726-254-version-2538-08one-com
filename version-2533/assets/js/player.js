(function () {
  var video = document.querySelector('[data-player]');
  if (!video) return;
  var button = document.querySelector('[data-play-button]');
  var src = video.getAttribute('data-stream');
  var attached = false;
  function prepare() {
    if (attached) return;
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({ maxBufferLength: 30 });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  }
  function play() {
    prepare();
    video.controls = true;
    if (button) button.classList.add('is-hidden');
    var request = video.play();
    if (request && request.catch) {
      request.catch(function () {});
    }
  }
  if (button) {
    button.addEventListener('click', play);
  }
  video.addEventListener('click', function () {
    if (video.paused) play();
  });
  video.addEventListener('play', function () {
    if (button) button.classList.add('is-hidden');
  });
})();
