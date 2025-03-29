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
    const translateBtn = document.querySelector('.button-container .btn');
    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            // Get the input text
            const inputBox = document.querySelector('.input-box');
            const outputBox = document.querySelector('.output-box');
            const inputText = inputBox.value.trim();
            
            // Don't proceed if input is empty
            if (!inputText) {
                outputBox.value = "Please enter some text to translate";
                return;
            }
            
            // Show loading indicator
            outputBox.value = "Translating...";
            translateBtn.disabled = true;
            
            // Make API request to our Django backend
            fetch('/api/translate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),  // Function to get CSRF token defined below
                },
                body: JSON.stringify({
                    text: inputText
                })
            })
            .then(response => {
                // Check if response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Display the translation
                if (data.translation) {
                    outputBox.value = data.translation;
                } else if (data.error) {
                    outputBox.value = "Error: " + data.error;
                }
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
                outputBox.value = "Translation failed. Please try again later.";
            })
            .finally(() => {
                // Re-enable the button
                translateBtn.disabled = false;
            });
        });
    }
    
    // Function to get CSRF token from cookies
    function getCsrfToken() {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});