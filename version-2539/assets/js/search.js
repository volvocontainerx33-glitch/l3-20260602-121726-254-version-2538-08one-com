(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function card(item) {
        var tags = (item.tags || []).slice(0, 4).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");

        return [
            "<article class=\"movie-card card-hover\">",
            "<a class=\"poster-link\" href=\"" + escapeHtml(item.url) + "\">",
            "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\" decoding=\"async\">",
            "<span class=\"score-badge\">" + escapeHtml(item.rating) + "</span>",
            "<span class=\"year-badge\">" + escapeHtml(item.year) + "</span>",
            "</a>",
            "<div class=\"movie-card-body\">",
            "<h3><a href=\"" + escapeHtml(item.url) + "\">" + escapeHtml(item.title) + "</a></h3>",
            "<p class=\"movie-meta\">" + escapeHtml(item.region) + " · " + escapeHtml(item.genre) + "</p>",
            "<p class=\"line-clamp\">" + escapeHtml(item.oneLine) + "</p>",
            "<div class=\"tag-list\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    ready(function () {
        var params = new URLSearchParams(window.location.search);
        var q = (params.get("q") || "").trim();
        var form = document.querySelector("[data-search-form]");
        var title = document.querySelector("[data-search-title]");
        var results = document.querySelector("[data-search-results]");
        var data = window.SEARCH_DATA || [];

        if (form && q) {
            var input = form.querySelector("input[name='q']");
            if (input) {
                input.value = q;
            }
        }

        if (!results || !q) {
            return;
        }

        var qLower = q.toLowerCase();
        var matched = data.filter(function (item) {
            var haystack = [
                item.title,
                item.year,
                item.region,
                item.genre,
                (item.tags || []).join(" "),
                item.oneLine
            ].join(" ").toLowerCase();
            return haystack.indexOf(qLower) !== -1;
        }).slice(0, 80);

        if (title) {
            title.textContent = matched.length ? "搜索结果" : "暂无匹配影片";
        }

        if (matched.length) {
            results.innerHTML = matched.map(card).join("");
        } else {
            results.innerHTML = "<p>没有找到匹配内容，可以换一个片名、类型或年份继续搜索。</p>";
        }
    });
})();
