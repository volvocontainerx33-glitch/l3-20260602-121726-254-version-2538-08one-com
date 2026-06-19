function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

function initMobileNav() {
  var toggle = qs('[data-menu-toggle]');
  var nav = qs('[data-mobile-nav]');
  if (!toggle || !nav) {
    return;
  }
  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

function initHero() {
  var slider = qs('[data-hero-slider]');
  if (!slider) {
    return;
  }
  var slides = qsa('[data-hero-slide]', slider);
  var dots = qsa('[data-hero-dot]', slider);
  if (!slides.length) {
    return;
  }
  var index = 0;
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      show(i);
    });
  });
  show(0);
  window.setInterval(function () {
    show(index + 1);
  }, 5200);
}

function initCardFilter() {
  var filter = qs('[data-card-filter]');
  if (!filter) {
    return;
  }
  var scope = qs('[data-card-scope]') || document;
  var cards = qsa('[data-title]', scope);
  var year = qs('[data-year-filter]');
  var region = qs('[data-region-filter]');
  var counter = qs('[data-result-count]');
  function apply() {
    var keyword = filter.value.trim().toLowerCase();
    var yearValue = year ? year.value : '';
    var regionValue = region ? region.value : '';
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = (card.dataset.text || '').toLowerCase();
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchYear = !yearValue || card.dataset.year === yearValue;
      var matchRegion = !regionValue || card.dataset.region === regionValue;
      var show = matchKeyword && matchYear && matchRegion;
      card.classList.toggle('hidden-card', !show);
      if (show) {
        visible += 1;
      }
    });
    if (counter) {
      counter.textContent = String(visible);
    }
  }
  filter.addEventListener('input', apply);
  if (year) {
    year.addEventListener('change', apply);
  }
  if (region) {
    region.addEventListener('change', apply);
  }
  apply();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSearchCard(item) {
  return '<article class="movie-card">' +
    '<a class="card-poster" href="' + escapeHtml(item.url) + '">' +
    '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
    '<span class="card-score">' + escapeHtml(item.rating) + '</span>' +
    '<span class="card-play">播放</span>' +
    '</a>' +
    '<div class="card-body">' +
    '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
    '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
    '<p>' + escapeHtml(item.oneLine) + '</p>' +
    '<div class="tag-row"><span>' + escapeHtml(item.category) + '</span></div>' +
    '</div>' +
    '</article>';
}

function initSearchPage() {
  var form = qs('[data-search-form]');
  var input = qs('[data-search-input]');
  var region = qs('[data-search-region]');
  var year = qs('[data-search-year]');
  var results = qs('[data-search-results]');
  var count = qs('[data-search-count]');
  if (!form || !input || !results || !window.MOVIE_INDEX) {
    return;
  }
  function apply(event) {
    if (event) {
      event.preventDefault();
    }
    var keyword = input.value.trim().toLowerCase();
    var regionValue = region ? region.value : '';
    var yearValue = year ? year.value : '';
    var matched = window.MOVIE_INDEX.filter(function (item) {
      var haystack = (item.title + ' ' + item.region + ' ' + item.genre + ' ' + item.tags + ' ' + item.oneLine).toLowerCase();
      var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var okRegion = !regionValue || item.region === regionValue;
      var okYear = !yearValue || item.year === yearValue;
      return okKeyword && okRegion && okYear;
    }).slice(0, 120);
    results.innerHTML = matched.length ? matched.map(renderSearchCard).join('') : '<div class="empty-state">没有匹配内容</div>';
    if (count) {
      count.textContent = String(matched.length);
    }
  }
  form.addEventListener('submit', apply);
  input.addEventListener('input', apply);
  if (region) {
    region.addEventListener('change', apply);
  }
  if (year) {
    year.addEventListener('change', apply);
  }
  apply();
}

function initPlayer() {
  var box = qs('[data-player]');
  if (!box) {
    return;
  }
  var video = qs('video', box);
  var button = qs('[data-play-button]', box);
  var cover = qs('[data-player-cover]', box);
  var status = qs('[data-player-status]', box);
  if (!video) {
    return;
  }
  var src = video.dataset.src;
  var ready = false;
  function loadSource() {
    if (ready || !src) {
      return Promise.resolve();
    }
    ready = true;
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return new Promise(function (resolve) {
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
        hls.on(window.Hls.Events.ERROR, function () {
          if (status) {
            status.textContent = '播放源加载中，可使用浏览器控件继续尝试播放';
          }
          resolve();
        });
      });
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      video.src = src;
    }
    return Promise.resolve();
  }
  function start() {
    loadSource().then(function () {
      if (cover) {
        cover.classList.add('hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (status) {
            status.textContent = '点击播放器控件即可继续播放';
          }
        });
      }
    });
  }
  if (button) {
    button.addEventListener('click', start);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('hidden');
    }
    if (status) {
      status.textContent = '正在播放';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initHero();
  initCardFilter();
  initSearchPage();
  initPlayer();
});
