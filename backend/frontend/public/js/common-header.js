// Common header script for the Climate Awareness Portal
// This script should be included in all pages

// Load translations and styles
document.write('<script src="/public/js/translations.js"></script>');
document.write('<link rel="stylesheet" href="/public/js/language-switcher.css">');

// Apply language immediately to prevent flashing of untranslated content
(function() {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Try to get user-specific settings from localStorage
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            const userId = decoded.userId || decoded.id;
            
            if (userId) {
                const userPrefix = `user_${userId}_`;
                const settingsData = JSON.parse(localStorage.getItem(`${userPrefix}settings`) || '{}');
                
                // Use user-specific language setting if available
                if (settingsData.language) {
                    document.documentElement.setAttribute('lang', settingsData.language);
                    document.documentElement.setAttribute('data-language', settingsData.language);
                    return;
                }
            }
        }
    } catch (error) {
        console.error('Error loading user language settings:', error);
    }
    
    // Fall back to saved language
    document.documentElement.setAttribute('lang', savedLanguage);
    document.documentElement.setAttribute('data-language', savedLanguage);
})();

// Initialize language when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Try to get user-specific settings
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            const userId = decoded.userId || decoded.id;
            
            if (userId) {
                const userPrefix = `user_${userId}_`;
                const settingsData = JSON.parse(localStorage.getItem(`${userPrefix}settings`) || '{}');
                
                // Use user-specific language setting if available
                if (settingsData.language) {
                    console.log('Using user language setting:', settingsData.language);
                    updatePageLanguage(settingsData.language);
                    return;
                }
            }
        }
    } catch (error) {
        console.error('Error loading user language settings:', error);
    }
    
    // Fall back to saved language
    console.log('Using saved language:', savedLanguage);
    updatePageLanguage(savedLanguage);
});

// Add language switcher to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if language switcher already exists
    if (document.querySelector('.language-switcher')) {
        return;
    }
    
    // Find the header nav-actions div to add the language switcher
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        // Create language switcher
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <select id="quickLanguageSelector" onchange="changeLanguageGlobal()">
                <option value="en" data-i18n="settings.english">English</option>
                <option value="sw" data-i18n="settings.swahili">Swahili</option>
            </select>
        `;
        
        // Insert before the first child of nav-actions
        navActions.insertBefore(languageSwitcher, navActions.firstChild);
        
        // Set the current language
        const currentLang = document.documentElement.getAttribute('data-language') || 'en';
        document.getElementById('quickLanguageSelector').value = currentLang;
        
        // Update translations for the language switcher
        updatePageLanguage(currentLang);
    }
});

// Global language change function
function changeLanguageGlobal() {
    const language = document.getElementById('quickLanguageSelector').value;
    
    // Update localStorage
    localStorage.setItem('language', language);
    
    // Try to update user settings if logged in
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            const userId = decoded.userId || decoded.id;
            
            if (userId) {
                const userPrefix = `user_${userId}_`;
                const settingsData = JSON.parse(localStorage.getItem(`${userPrefix}settings`) || '{}');
                settingsData.language = language;
                localStorage.setItem(`${userPrefix}settings`, JSON.stringify(settingsData));
            }
        }
    } catch (error) {
        console.error('Error saving user language settings:', error);
    }
    
    // Apply language change
    updatePageLanguage(language);
    
    // Show notification
    const message = language === 'en' ? 'Language changed to English' : 'Lugha imebadilishwa kuwa Kiswahili';
    if (window.showNotification) {
        showNotification(message, 'success');
    } else {
        alert(message);
    }
}

// Add this function to the global scope
window.changeLanguageGlobal = changeLanguageGlobal;