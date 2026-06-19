(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var carousel = document.querySelector("[data-hero-carousel]");
        if (carousel) {
            var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
            var index = 0;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === index);
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                });
            });

            window.setInterval(function () {
                show(index + 1);
            }, 4800);
        }

        var filter = document.querySelector("[data-card-filter]");
        var cardList = document.querySelector("[data-card-list]");
        if (filter && cardList) {
            var cards = Array.prototype.slice.call(cardList.querySelectorAll(".movie-card"));
            filter.addEventListener("input", function () {
                var q = filter.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var target = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year")
                    ].join(" ").toLowerCase();
                    card.style.display = !q || target.indexOf(q) !== -1 ? "" : "none";
                });
            });
        }
    });
})();
