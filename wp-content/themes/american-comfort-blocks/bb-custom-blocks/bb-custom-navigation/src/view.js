document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.custom-navigation__toggle');
    const closeButton = document.querySelector('.custom-navigation__close');
    const menu = document.querySelector('.custom-navigation');
    
    if (toggleButton && menu) {
        toggleButton.addEventListener('click', function() {
            toggleButton.setAttribute('aria-expanded', 'true');
            menu.classList.add('is-open');
        });
    }
    
    if (closeButton && menu) {
        closeButton.addEventListener('click', function() {
            if (toggleButton) {
                toggleButton.setAttribute('aria-expanded', 'false');
            }
            menu.classList.remove('is-open');
        });
    }

    const parentItems = document.querySelectorAll('.custom-navigation__item.has-children');
    
    parentItems.forEach(function(item) {
        const link = item.querySelector(':scope > .custom-navigation__link');
        
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('is-open');
                
                const siblings = Array.from(item.parentElement.children);
                siblings.forEach(function(sibling) {
                    if (sibling !== item && sibling.classList.contains('has-children')) {
                        sibling.classList.remove('is-open');
                    }
                });
            });
        }
    });
});