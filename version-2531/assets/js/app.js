const Hls = window.Hls;

const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

const setupMenu = () => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
};

const setupHero = () => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const dots = Array.from(hero.querySelectorAll('.hero-dot'));
  if (slides.length <= 1) return;
  let index = 0;
  let timer = null;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };
  const start = () => {
    timer = window.setInterval(() => show(index + 1), 5200);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
  };
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stop();
      show(i);
      start();
    });
  });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  show(0);
  start();
};

const setupSearch = () => {
  const input = document.querySelector('[data-search-input]');
  const year = document.querySelector('[data-year-filter]');
  const category = document.querySelector('[data-category-filter]');
  const cards = Array.from(document.querySelectorAll('[data-title]'));
  const empty = document.querySelector('[data-empty-state]');
  if (!input || cards.length === 0) return;
  const normalize = (value) => (value || '').toString().trim().toLowerCase();
  const filter = () => {
    const query = normalize(input.value);
    const yearValue = year ? year.value : '';
    const categoryValue = category ? category.value : '';
    let shown = 0;
    cards.forEach((card) => {
      const haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.year
      ].join(' '));
      const matchQuery = !query || haystack.includes(query);
      const matchYear = !yearValue || card.dataset.year === yearValue;
      const matchCategory = !categoryValue || card.dataset.category === categoryValue;
      const visible = matchQuery && matchYear && matchCategory;
      card.style.display = visible ? '' : 'none';
      if (visible) shown += 1;
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
  };
  input.addEventListener('input', filter);
  if (year) year.addEventListener('change', filter);
  if (category) category.addEventListener('change', filter);
  filter();
};

const initVideoPlayer = (videoId, source, overlayId) => {
  const video = document.getElementById(videoId);
  const overlay = document.getElementById(overlayId);
  if (!video || !source) return;
  let hls = null;
  const attach = () => {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (!data || !data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = source;
    }
  };
  const play = () => {
    if (!video.src) attach();
    if (overlay) overlay.classList.add('is-hidden');
    const result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {
        if (overlay) overlay.classList.remove('is-hidden');
      });
    }
  };
  if (overlay) overlay.addEventListener('click', play);
  video.addEventListener('click', () => {
    if (video.paused) play();
  });
  video.addEventListener('play', () => {
    if (overlay) overlay.classList.add('is-hidden');
  });
  video.addEventListener('pause', () => {
    if (video.currentTime === 0 && overlay) overlay.classList.remove('is-hidden');
  });
};

window.initVideoPlayer = initVideoPlayer;

ready(() => {
  setupMenu();
  setupHero();
  setupSearch();
});
