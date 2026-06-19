(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function startVideo(video, button) {
        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            if (!video.__hlsReady) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                video.__hlsReady = true;
                video.__hlsInstance = hls;
            }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (!video.getAttribute('src')) {
                video.setAttribute('src', stream);
            }
        }
        if (button) {
            button.classList.add('is-hidden');
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('.player-start');
            if (!video) {
                return;
            }
            if (button) {
                button.addEventListener('click', function () {
                    startVideo(video, button);
                });
            }
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button && !video.ended) {
                    button.classList.remove('is-hidden');
                }
            });
        });
    });
})();
