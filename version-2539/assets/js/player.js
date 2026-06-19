(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var video = document.querySelector("[data-video-player]");
        var stream = window.__MOVIE_STREAM__;
        if (!video || !stream) {
            return;
        }

        var shell = video.closest("[data-player]");
        var button = shell ? shell.querySelector("[data-play-button]") : null;
        var hls = null;
        var initialized = false;
        var waitingForPlay = false;

        function markPlaying() {
            if (shell) {
                shell.classList.add("is-playing");
            }
        }

        function markPaused() {
            if (shell && video.paused) {
                shell.classList.remove("is-playing");
            }
        }

        function startVideo() {
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function initialize() {
            if (initialized) {
                return;
            }
            initialized = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                if (waitingForPlay) {
                    startVideo();
                }
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (waitingForPlay) {
                        startVideo();
                    }
                });
                return;
            }

            video.src = stream;
            if (waitingForPlay) {
                startVideo();
            }
        }

        function playFromGesture(event) {
            if (event) {
                event.preventDefault();
            }
            waitingForPlay = true;
            initialize();
            startVideo();
        }

        if (button) {
            button.addEventListener("click", playFromGesture);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playFromGesture();
            }
        });

        video.addEventListener("play", markPlaying);
        video.addEventListener("pause", markPaused);
        video.addEventListener("ended", markPaused);
    });
})();
