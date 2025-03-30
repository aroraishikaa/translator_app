/**
 * Hingo Translate - Main JavaScript
 * Handles translation functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize translation UI
    setupTranslationUI();
});

/**
 * Sets up the translation button and event handlers
 */
function setupTranslationUI() {
    const translateBtn = document.querySelector('.button-container .btn');
    const inputBox = document.querySelector('.input-box');
    const outputBox = document.querySelector('.output-box');
    
    if (!translateBtn || !inputBox || !outputBox) {
        return; // Not on the translation page
    }

    // Character limit for input text
    const MAX_CHAR_LIMIT = 500;
    
    // Add input event listener to check character limit
    inputBox.addEventListener('input', function() {
        // Check if input exceeds character limit
        if (inputBox.value.length > MAX_CHAR_LIMIT) {
            // Trim input to max character limit
            inputBox.value = inputBox.value.substring(0, MAX_CHAR_LIMIT);
            // Display a message
            outputBox.value = `Character limit of ${MAX_CHAR_LIMIT} reached. Please ensure your text is within the limit.`;
        }
    });
    
    translateBtn.addEventListener('click', async function() {
        const inputText = inputBox.value.trim();
        
        // Don't proceed if input is empty
        if (!inputText) {
            outputBox.value = "Please enter some text to translate";
            return;
        }
        
        // Show loading indicator
        outputBox.value = "Translating...";
        translateBtn.disabled = true;
        
        // Call translation service
        const result = await translateText(inputText);
        
        // Display the translation result
        if (result.translation) {
            outputBox.value = result.translation;
        } else if (result.error) {
            outputBox.value = "Error: " + result.error;
        }
        
        // Re-enable the button
        translateBtn.disabled = false;
    });
}

/**
 * Translates text using the backend API
 * @param {string} text - The text to translate
 * @returns {Promise} - Promise that resolves with the translation result
 */
async function translateText(text) {
    if (!text || !text.trim()) {
        return { error: 'Please enter some text to translate' };
    }
    
    try {
        const response = await fetch('/api/translate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({
                text: text
            })
        });
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Translation error:', error);
        return { error: 'Translation failed. Please try again later.' };
    }
}

/**
 * Gets the CSRF token from cookies
 * @returns {string|null} The CSRF token or null if not found
 */
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