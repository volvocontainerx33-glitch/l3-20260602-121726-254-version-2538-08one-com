(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function setupSearch() {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var panel = document.querySelector('[data-search-panel]');
    var data = window.MovieSearchData || [];
    if (!form || !input || !panel || !data.length) {
      return;
    }

    function render(query) {
      var value = query.trim().toLowerCase();
      if (!value) {
        panel.classList.remove('open');
        panel.innerHTML = '';
        return [];
      }
      var results = data.filter(function (item) {
        return item.searchText.indexOf(value) !== -1;
      }).slice(0, 10);
      if (!results.length) {
        panel.innerHTML = '<div class="search-empty">没有找到匹配内容</div>';
        panel.classList.add('open');
        return [];
      }
      panel.innerHTML = results.map(function (item) {
        return '<a class="search-result" href="./' + item.file + '">' +
          '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '">' +
          '<span><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.year + ' · ' + item.region) + '</small></span>' +
          '</a>';
      }).join('');
      panel.classList.add('open');
      return results;
    }

    input.addEventListener('input', function () {
      render(input.value);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) {
        render(input.value);
      }
    });

    document.addEventListener('click', function (event) {
      if (!form.contains(event.target)) {
        panel.classList.remove('open');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var results = render(input.value);
      if (results.length) {
        window.location.href = './' + results[0].file;
      }
    });
  }

  function setupLocalFilter() {
    var input = document.querySelector('[data-local-search]');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    if (!cards.length || (!input && !buttons.length)) {
      return;
    }
    var active = 'all';

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var search = (card.getAttribute('data-search-index') || '').toLowerCase();
        var fields = [
          card.getAttribute('data-type') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-tags') || ''
        ].join(' ');
        var matchesQuery = !query || search.indexOf(query) !== -1;
        var matchesFilter = active === 'all' || fields.indexOf(active) !== -1;
        card.classList.toggle('hidden', !(matchesQuery && matchesFilter));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        active = button.getAttribute('data-filter-button') || 'all';
        apply();
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    restart();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.initMoviePlayer = function (config) {
    var video = document.getElementById(config.videoId);
    var layer = document.getElementById(config.layerId);
    var button = document.getElementById(config.buttonId);
    var loaded = false;
    var hls = null;

    if (!video || !layer || !button || !config.source) {
      return;
    }

    function load() {
      if (loaded) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = config.source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(config.source);
        hls.attachMedia(video);
      } else {
        video.src = config.source;
      }
      loaded = true;
    }

    function play() {
      load();
      layer.classList.add('hidden');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          layer.classList.remove('hidden');
        });
      }
    }

    layer.addEventListener('click', play);
    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      layer.classList.add('hidden');
    });
    video.addEventListener('ended', function () {
      layer.classList.remove('hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupNavigation();
    setupSearch();
    setupLocalFilter();
    setupHero();
  });
})();
