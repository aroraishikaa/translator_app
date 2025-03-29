// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar shrink function
    var navbarShrink = function() {
        const navbarCollapsible = document.getElementById('mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Shrink the navbar when the page loads if it's not at the top
    navbarShrink();

    // Activate Bootstrap scrollspy on the main navigation
    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');
    if (navbarToggler) {
        responsiveNavItems.forEach(function(responsiveNavItem) {
            responsiveNavItem.addEventListener('click', function() {
                if (window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarToggler.click();
                }
            });
        });
    }

    // Handle translate button click event
    const translateBtn = document.querySelector('.translation-container .btn-clean');
    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            const inputText = document.querySelector('.input-box').value;
            // This is a placeholder for the actual translation functionality
            // You would typically call an API endpoint here
            document.querySelector('.output-box').value = "Translation will be implemented here";
        });
    }
});