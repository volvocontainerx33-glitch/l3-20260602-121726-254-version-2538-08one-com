(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");

        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("is-open");
            });
        }

        setupHero();
        setupFilters();
        setupBackToTop();
    });

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previousButton = hero.querySelector("[data-hero-prev]");
        var nextButton = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function setupFilters() {
        var filterBar = document.querySelector("[data-filter-bar]");
        if (!filterBar) {
            return;
        }

        var input = filterBar.querySelector("[data-filter-input]");
        var yearFilter = filterBar.querySelector("[data-year-filter]");
        var regionFilter = filterBar.querySelector("[data-region-filter]");
        var count = filterBar.querySelector("[data-filter-count]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var noResults = document.querySelector("[data-no-results]");

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = normalize(input ? input.value : "");
            var year = normalize(yearFilter ? yearFilter.value : "");
            var region = normalize(regionFilter ? regionFilter.value : "");
            var visibleCount = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var keywordMatched = !keyword || text.indexOf(keyword) !== -1;
                var yearMatched = !year || cardYear === year;
                var regionMatched = !region || cardRegion.indexOf(region) !== -1;
                var visible = keywordMatched && yearMatched && regionMatched;

                card.style.display = visible ? "" : "none";
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (count) {
                count.textContent = "当前显示 " + visibleCount + " 部";
            }

            if (noResults) {
                noResults.classList.toggle("is-visible", visibleCount === 0);
            }
        }

        [input, yearFilter, regionFilter].forEach(function (element) {
            if (element) {
                element.addEventListener("input", applyFilters);
                element.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }

    function setupBackToTop() {
        var button = document.querySelector("[data-back-top]");
        if (!button) {
            return;
        }

        window.addEventListener("scroll", function () {
            button.classList.toggle("is-visible", window.scrollY > 500);
        });

        button.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
})();
