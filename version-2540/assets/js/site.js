(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  var grid = document.querySelector('[data-card-grid]');
  var searchInput = document.querySelector('[data-search-input]');
  var sortSelect = document.querySelector('[data-sort-select]');
  if (grid) {
    var originalCards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var applySearch = function () {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      originalCards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.type, card.dataset.year].join(' ').toLowerCase();
        card.classList.toggle('is-filtered-out', query && text.indexOf(query) === -1);
      });
    };
    var applySort = function () {
      var value = sortSelect ? sortSelect.value : 'default';
      var sorted = originalCards.slice();
      if (value === 'year-desc') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        });
      }
      if (value === 'views-desc') {
        sorted.sort(function (a, b) {
          return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
        });
      }
      if (value === 'title-asc') {
        sorted.sort(function (a, b) {
          return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-Hans-CN');
        });
      }
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    };
    if (searchInput) {
      searchInput.addEventListener('input', applySearch);
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', applySort);
    }
  }

  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
