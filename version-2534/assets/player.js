(function () {
    window.initMoviePlayer = function (config) {
        var video = document.getElementById(config.videoId);
        var button = document.querySelector(config.buttonSelector);
        var hlsInstance = null;
        var hasLoaded = false;

        if (!video || !config.src) {
            return;
        }

        function attachSource() {
            if (hasLoaded) {
                return;
            }

            hasLoaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = config.src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(config.src);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        hlsInstance.destroy();
                    }
                });
            } else {
                video.src = config.src;
            }
        }

        function beginPlayback() {
            attachSource();
            if (button) {
                button.classList.add("is-hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener("click", beginPlayback);
        }

        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("is-hidden");
            }
        });

        video.addEventListener("click", function () {
            if (!hasLoaded) {
                beginPlayback();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
