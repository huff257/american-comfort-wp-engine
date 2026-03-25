class SimplestSlider {
    constructor({ 
        section = section,
        container = container, 
        slideClasss = slideClasss,
        horizontal = horizontal
    }) {
        this.header = document.querySelector('.bb-header');
        this.section = document.querySelector(section);
        this.sections = this.section.querySelectorAll('.scrolling-section');
        this.container = this.section.querySelector(container);
        this.horizontal = horizontal;

        this.device = this.section.querySelector('.device-container');
        this.deviceSection = this.section.querySelector('.device-section');
        this.slides = this.container.querySelectorAll(slideClasss);
        this.slidesLength = this.slides.length;
        this.pagers = this.container.querySelectorAll(this.pagerClass);
        this.slidePos = 0;
        this.transformX = this.horizontal ? 100 : 0;
        this.transformY = this.horizontal ? 0 : 100;

        this.firstSection = this.section.querySelector('.scrolling-section-1');
        this.firstTitleWrapper = this.firstSection ? this.firstSection.querySelector('.title-wrapper') : null;
    }

    forward() {
        if (this.slidePos < this.slidesLength - 1) {
            this.slidePos++;
        }
    }

    backward() {
        if (this.slidePos > 0) {
            this.slidePos--;
        }
    }
      
    moveSlides() {
        this.slides.forEach((slide) => {
            slide.style.transform = `translate(${this.slidePos * -this.transformX}%, ${this.slidePos * -this.transformY}%)`;
        });
    }

    observeSections() {
        const fadeObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const target = entry.target;
                    if (entry.isIntersecting) {
                        target.classList.add('fade-element', 'fade-in');
                    } else {
                        target.classList.remove('fade-in');
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.sections.forEach(section => fadeObserver.observe(section));
        const updateActiveSection = () => {
            const viewportCenter = window.innerHeight / 2;
            let closestSection = null;
            let minDistance = Infinity;

            this.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewportCenter - sectionCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = section;
                }
            });

            if (closestSection) {
                const newIndex = parseInt(closestSection.getAttribute('data-slide'), 10);
                if (newIndex !== this.slidePos) {
                    this.slidePos = newIndex;
                    this.moveSlides();
                    this.section.classList.add('fade-element', 'fade-in');
                }

                if (newIndex !== 0) {
                    this.device.classList.add('active-device');
                } else {
                    this.device.classList.remove('active-device');
                }
            }
        };

        window.addEventListener('scroll', updateActiveSection);
        updateActiveSection();
    }

    setupDeviceSectionTopListener() {
        const updateTop = () => {
            if (!this.firstTitleWrapper || !this.deviceSection) return;

            const height = this.firstTitleWrapper.offsetHeight;

            if (window.matchMedia('(max-width: 700px)').matches || window.matchMedia('(max-width: 500px)').matches) {
                this.deviceSection.style.top = `calc(${height}px + 10em)`;
            } else {
                this.deviceSection.style.top = '0';
            }
        };

        const mq700 = window.matchMedia('(max-width: 700px)');
        const mq500 = window.matchMedia('(max-width: 500px)');
        mq700.addEventListener('change', updateTop);
        mq500.addEventListener('change', updateTop);

        for (let bp = 675; bp >= 300; bp -= 25) {
            const mq = window.matchMedia(`(max-width: ${bp}px)`);
            mq.addEventListener('change', updateTop);
        }

        updateTop();
    }

    setSlideAttributes() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('data-slide', index);
        });
        this.sections.forEach((section, index) => {
            section.setAttribute('data-slide', index);
        });
    }

    init() {    
        if (this.sections.length > 0) {
            this.setSlideAttributes();
            this.observeSections();
            this.setupDeviceSectionTopListener();
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".scrolling-sections").forEach(layout => { 
    if (layout.classList.contains("scrolling-sections")) {
        const slider = new SimplestSlider({
          section: '.scrolling-sections',
          container: '.device-slides',
          slideClasss: '.slide',
          horizontal: false
        });
        slider.init();
    }});
})
