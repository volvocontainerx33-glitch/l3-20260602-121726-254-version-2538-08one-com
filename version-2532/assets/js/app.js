(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    ready(function () {
        var menuButton = document.querySelector('.mobile-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (menuButton && mobileNav) {
            menuButton.addEventListener('click', function () {
                var opened = mobileNav.classList.toggle('is-open');
                menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            function start() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    start();
                });
            });

            show(0);
            start();
        }

        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
        var searchInput = document.querySelector('[data-search-input]');
        var empty = document.querySelector('[data-filter-empty]');
        var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));

        function populateSelect(select) {
            var key = select.getAttribute('data-filter-select');
            var values = [];
            cards.forEach(function (card) {
                var value = card.getAttribute('data-' + key) || '';
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
            values.sort(function (a, b) {
                return a.localeCompare(b, 'zh-CN');
            });
            values.forEach(function (value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function applyQueryFromUrl() {
            if (!searchInput) {
                return;
            }
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                searchInput.value = q;
            }
        }

        function filterCards() {
            if (!cards.length) {
                return;
            }
            var query = normalize(searchInput ? searchInput.value : '');
            var activeFilters = {};
            selects.forEach(function (select) {
                activeFilters[select.getAttribute('data-filter-select')] = select.value;
            });
            var visibleCount = 0;
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var matched = !query || text.indexOf(query) !== -1;
                Object.keys(activeFilters).forEach(function (key) {
                    if (activeFilters[key] && card.getAttribute('data-' + key) !== activeFilters[key]) {
                        matched = false;
                    }
                });
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visibleCount += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visibleCount === 0);
            }
        }

        selects.forEach(populateSelect);
        applyQueryFromUrl();
        if (searchInput) {
            searchInput.addEventListener('input', filterCards);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', filterCards);
        });
        filterCards();
    });
})();
