(function () {
  const players = Array.from(document.querySelectorAll('[data-player]'));
  let hlsLoading = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (hlsLoading) {
      return hlsLoading;
    }
    hlsLoading = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return hlsLoading;
  }

  function playShell(shell) {
    const video = shell.querySelector('video');
    const overlay = shell.querySelector('.player-overlay');
    const stream = shell.getAttribute('data-stream');
    if (!video || !stream) {
      return;
    }

    function start() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      const result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (video.getAttribute('data-ready') === '1') {
      start();
      return;
    }

    video.setAttribute('data-ready', '1');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      start();
      return;
    }

    loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video.addEventListener('canplay', start, { once: true });
        window.setTimeout(start, 600);
      } else {
        video.src = stream;
        start();
      }
    }).catch(function () {
      video.src = stream;
      start();
    });
  }

  players.forEach(function (shell) {
    const overlay = shell.querySelector('.player-overlay');
    const video = shell.querySelector('video');
    if (overlay) {
      overlay.addEventListener('click', function () {
        playShell(shell);
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!video.src) {
          playShell(shell);
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }
  });
})();
