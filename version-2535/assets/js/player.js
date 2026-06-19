import { H as Hls } from "./hls-vendor-dru42stk.js";

function ready(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

ready(function () {
    var video = document.querySelector("[data-hls-video]");
    var button = document.querySelector("[data-play-button]");
    var cover = document.querySelector("[data-player-cover]");
    var status = document.querySelector("[data-player-status]");

    if (!video || !button) {
        return;
    }

    var source = button.getAttribute("data-src") || video.getAttribute("data-src");
    var playerStarted = false;
    var hlsInstance = null;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function startPlayback() {
        if (!source) {
            setStatus("当前播放地址不可用");
            return;
        }

        if (cover) {
            cover.style.display = "none";
        }

        if (playerStarted) {
            video.play().catch(function () {
                setStatus("浏览器阻止了自动播放，请再次点击播放按钮");
            });
            return;
        }

        playerStarted = true;
        setStatus("正在加载播放源...");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", function () {
                video.play().catch(function () {
                    setStatus("请点击播放器上的播放按钮继续观看");
                });
            }, { once: true });
            setStatus("播放源已加载");
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                setStatus("播放源已就绪");
                video.play().catch(function () {
                    setStatus("请点击播放器上的播放按钮继续观看");
                });
            });
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setStatus("播放加载遇到问题，请刷新页面后重试");
                    if (hlsInstance) {
                        hlsInstance.destroy();
                        hlsInstance = null;
                    }
                }
            });
            return;
        }

        video.src = source;
        setStatus("当前浏览器可能不支持 HLS 播放，请更换浏览器尝试");
    }

    button.addEventListener("click", startPlayback);
    video.addEventListener("play", function () {
        if (cover) {
            cover.style.display = "none";
        }
    });
});
