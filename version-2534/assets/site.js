(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var mobileMenu = document.querySelector("[data-mobile-menu]");

        if (menuButton && mobileMenu) {
            menuButton.addEventListener("click", function () {
                mobileMenu.classList.toggle("is-open");
                var expanded = mobileMenu.classList.contains("is-open");
                menuButton.setAttribute("aria-expanded", expanded ? "true" : "false");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
                dot.setAttribute("aria-selected", dotIndex === activeIndex ? "true" : "false");
            });
        }

        function startTimer() {
            if (slides.length <= 1) {
                return;
            }
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5600);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();

        var searchInput = document.querySelector("[data-catalog-search]");
        var regionSelect = document.querySelector("[data-filter-region]");
        var typeSelect = document.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var emptyState = document.querySelector("[data-empty-state]");

        function applyFilters() {
            var query = normalize(searchInput ? searchInput.value : "");
            var region = normalize(regionSelect ? regionSelect.value : "");
            var type = normalize(typeSelect ? typeSelect.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-keywords"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var cardType = normalize(card.getAttribute("data-type"));
                var matched = true;

                if (query && haystack.indexOf(query) === -1) {
                    matched = false;
                }
                if (region && cardRegion !== region) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }

                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.style.display = visible === 0 ? "block" : "none";
            }
        }

        if (searchInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");
            if (initialQuery) {
                searchInput.value = initialQuery;
            }
            searchInput.addEventListener("input", applyFilters);
            if (regionSelect) {
                regionSelect.addEventListener("change", applyFilters);
            }
            if (typeSelect) {
                typeSelect.addEventListener("change", applyFilters);
            }
            applyFilters();
        }
    });
})();
