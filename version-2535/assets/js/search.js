(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return (params.get("q") || "").trim();
    }

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    ready(function () {
        var form = document.querySelector("[data-search-form]");
        var input = document.querySelector("[data-search-page-input]");
        var results = document.querySelector("[data-search-results]");
        var count = document.querySelector("[data-search-count]");
        var query = getQuery();

        if (input) {
            input.value = query;
        }

        function render(value) {
            var keyword = normalize(value).trim();
            var movies = window.SEARCH_MOVIES || [];
            var matched = movies.filter(function (movie) {
                var text = normalize([
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.category,
                    movie.description
                ].join(" "));
                return !keyword || text.indexOf(keyword) !== -1;
            }).slice(0, 300);

            if (count) {
                count.textContent = "共找到 " + matched.length + " 条结果";
            }

            if (!results) {
                return;
            }

            if (!matched.length) {
                results.innerHTML = '<div class="no-results is-visible">没有找到匹配影片</div>';
                return;
            }

            results.innerHTML = matched.map(function (movie) {
                return [
                    '<a class="search-result-item" href="' + movie.url + '">',
                    '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                    '    <span>',
                    '        <h3>' + escapeHtml(movie.title) + '</h3>',
                    '        <p>' + escapeHtml(movie.description) + '</p>',
                    '        <em>' + escapeHtml(movie.year + " · " + movie.region + " · " + movie.genre + " · " + movie.category) + '</em>',
                    '    </span>',
                    '</a>'
                ].join("\n");
            }).join("\n");
        }

        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                render(input ? input.value : "");
            });
        }

        if (input) {
            input.addEventListener("input", function () {
                render(input.value);
            });
        }

        render(query);
    });

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
