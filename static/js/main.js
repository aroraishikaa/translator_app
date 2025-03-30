/**
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

    translateBtn.addEventListener('click', async function() {
        // Get input text and remove whitespace from both ends
        const inputText = inputBox.value.trim();
        
        // Validate input to ensure it is not empty: show message and exit if empty
        if (!inputText) {
            outputBox.value = "Please enter some text to translate";
            return;
        }
        
        // Give user feedback that the transaltion is in progress: (1) show loading indicator (2) disable button to prevent multiple submissions
        outputBox.value = "Translating...";
        translateBtn.disabled = true;
        
        // Send text to backend API and await response
        const result = await translateText(inputText);
        
        // Update output box with translation or error message
        if (result.translation) {
            outputBox.value = result.translation;
        } else if (result.error) {
            outputBox.value = "Error: " + result.error;
        }
        
        // Re-enable the button after translation is complete
        translateBtn.disabled = false;
    });
}

/**
 * Translates text using the backend API
 * @param {string} text - The text to translate
 * @returns {Promise} - Promise that resolves with the translation result
 */
async function translateText(text) {
    // Validate: return error object if text is empty or only whitespace
    if (!text || !text.trim()) {
      return { error: 'Please enter some text to translate' };
    }
    
    try {
      // Make API request to the Django backend
      const response = await fetch('/api/translate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),  // Add CSRF protection
        },
        body: JSON.stringify({
          text: text
        })
      });
      
      // Handle HTTP error responses (non-200 status codes)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Parse and return the JSON response
      return await response.json();
      
    } catch (error) {
      // Log error for debugging and return user-friendly message
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
    
    // Only process if cookies exist
    if (document.cookie && document.cookie !== '') {
      // Split the cookie string into individual cookies
      const cookies = document.cookie.split(';');
      
      // Search through cookies for the CSRF token
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this cookie is the CSRF token
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          // Extract and decode the token value
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    
    return cookieValue;
  }