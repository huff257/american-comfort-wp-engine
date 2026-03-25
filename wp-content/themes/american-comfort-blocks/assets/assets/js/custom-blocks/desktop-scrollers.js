class ParallaxImages {
  constructor(layout, selector = '.parallax-image', intensity = 0.2) {
    this.layout = layout;
    this.images = layout.querySelectorAll(selector);
    this.intensity = intensity;
    this.currentY = window.scrollY;
    this.targetY = window.scrollY;
    this.raf = null;
    this.onScroll = this.onScroll.bind(this);
    this.animate = this.animate.bind(this);
    this.init();
  }

  init() {
    if (!this.images.length) return;
      this.handleScroll();
      window.addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    this.targetY = window.scrollY;

    if (!this.raf) {
      this.animate();
    }
  }

  animate() {
    this.currentY += (this.targetY - this.currentY) * 0.1;
    this.handleScroll(this.currentY);

    if (Math.abs(this.targetY - this.currentY) > 0.1) {
      this.raf = requestAnimationFrame(this.animate);
    } else {
      this.raf = null;
    }
  }

  handleScroll(scrollY = window.scrollY) {
    this.images.forEach(img => {
      const translateY = -3 - (scrollY * this.intensity);
      img.style.transform = `translate(-50%, 7px) translateY(${translateY}px)`;
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".desktop-scrollers").forEach(layout => { 
      new ParallaxImages(layout, '.parallax-image-wrapper img', 0.5); 
  });
})
