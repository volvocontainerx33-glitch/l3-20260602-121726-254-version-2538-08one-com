(function () {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const prev = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');
  let current = 0;
  let timer = null;

  function showSlide(index) {
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

  function schedule() {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      schedule();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      schedule();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      schedule();
    });
  }

  showSlide(0);
  schedule();

  const searchInput = document.querySelector('.site-search');
  const typeFilter = document.querySelector('.type-filter');
  const cards = Array.from(document.querySelectorAll('[data-card]'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function updateCards() {
    const query = normalize(searchInput ? searchInput.value : '');
    const selectedType = normalize(typeFilter ? typeFilter.value : '');
    cards.forEach(function (card) {
      const haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type')
      ].join(' '));
      const cardType = normalize(card.getAttribute('data-type'));
      const matchesQuery = !query || haystack.indexOf(query) !== -1;
      const matchesType = !selectedType || cardType.indexOf(selectedType) !== -1;
      card.classList.toggle('is-hidden', !(matchesQuery && matchesType));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateCards);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', updateCards);
  }
})();
