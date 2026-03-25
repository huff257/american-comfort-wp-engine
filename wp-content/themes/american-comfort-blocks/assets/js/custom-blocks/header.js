class AC_Menu_Logic {
  constructor({
    targetSelector = '.scrolling-header',
    activeClass = 'is-scrolled',
    scrollOffset = 250
  } = {}) {
    this.header = document.querySelector(targetSelector);
    this.activeClass = activeClass;
    this.scrollOffset = scrollOffset;

    if (!this.header) return;

    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.onScroll();
  }

  onScroll() {
    if (window.scrollY > this.scrollOffset) {
      this.header.classList.add(this.activeClass);
    } else {
      this.header.classList.remove(this.activeClass);
    }
  }
}

new AC_Menu_Logic();
