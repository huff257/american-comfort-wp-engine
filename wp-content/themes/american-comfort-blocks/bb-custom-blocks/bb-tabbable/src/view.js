document.addEventListener("DOMContentLoaded", () => {
  class TabbedContent {
    constructor(blockElement) {
      this.block = blockElement;

      this.tabs = this.block.querySelectorAll(".tab-item");
      this.desktopButtons = this.block.querySelectorAll(".tabs-header .tab-button");
      this.mobileButtons = this.block.querySelectorAll(".tab-item .tab-button");
      this.tabContents = this.block.querySelectorAll(".tab-content");

      this.activeClass = "active";
      this.inactiveClass = "inactive";

      this.init();
      this.setInitialActiveTab();
    }

    init() {
      this.desktopButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          this.activateTab(index);
        });
      });

      this.mobileButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
          this.activateTab(index);
        });
      });
    }

    setInitialActiveTab() {
      this.tabs.forEach((tab) => tab.classList.remove(this.inactiveClass));

      if (this.tabs.length > 0) {
        this.tabs[0].classList.add(this.activeClass);
      }

      if (this.desktopButtons.length > 0) {
        this.desktopButtons[0].classList.add(this.activeClass);
      }
    }

    activateTab(index) {
      this.desktopButtons.forEach((btn) => btn.classList.remove(this.activeClass));
      this.tabs.forEach((tab) => tab.classList.remove(this.activeClass));

      this.desktopButtons[index].classList.add(this.activeClass);
      this.mobileButtons[index].classList.toggle(this.activeClass);
      this.tabs[index].classList.add(this.activeClass);
      this.tabContents[index].classList.toggle(this.activeClass);
    }
  }

  const blocks = document.querySelectorAll(".tabs-container");

  blocks.forEach((block) => {
    new TabbedContent(block);
  });
});
