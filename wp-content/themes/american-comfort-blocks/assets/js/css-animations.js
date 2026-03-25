class FadeInOnView {
  constructor(selector, options = {}, activeClass = 'in-view') {
    this.selector = selector;
    this.activeClass = activeClass;

    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options,
    };

    this.init();
  }

  init() {
    const run = () => {
      const elements = document.querySelectorAll(this.selector);
      if (!elements.length) return;

      if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add(this.activeClass));
        return;
      }

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(this.activeClass);

            obs.unobserve(entry.target);
          }
        });
      }, this.options);

      elements.forEach(el => observer.observe(el));
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 0);
    }
  }
}

new FadeInOnView(
  '.fade-element',
  { rootMargin: '0px 0px -50px 0px' },
  'fade-in'
);
