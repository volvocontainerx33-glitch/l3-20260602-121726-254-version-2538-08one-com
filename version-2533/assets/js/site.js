(function () {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var active = 0;
  function showSlide(index) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === active);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });
  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('.site-search'));
  var yearFilters = Array.prototype.slice.call(document.querySelectorAll('.year-filter'));
  function filterCards(scope) {
    var queryInput = scope.querySelector('.site-search');
    var yearInput = scope.querySelector('.year-filter');
    var list = document.querySelector('.searchable-list');
    if (!list) return;
    var query = queryInput ? queryInput.value.trim().toLowerCase() : '';
    var year = yearInput ? yearInput.value : '';
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-title]'));
    var visible = 0;
    cards.forEach(function (card) {
      var text = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.year].join(' ').toLowerCase();
      var ok = (!query || text.indexOf(query) !== -1) && (!year || card.dataset.year === year);
      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });
    var empty = document.querySelector('.no-result');
    if (!empty && list) {
      empty = document.createElement('div');
      empty.className = 'no-result';
      empty.textContent = '没有匹配的影片';
      list.parentNode.insertBefore(empty, list.nextSibling);
    }
    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }
  searchInputs.concat(yearFilters).forEach(function (el) {
    el.addEventListener('input', function () {
      var panel = el.closest('.search-panel') || document;
      filterCards(panel);
    });
    el.addEventListener('change', function () {
      var panel = el.closest('.search-panel') || document;
      filterCards(panel);
    });
  });
})();
