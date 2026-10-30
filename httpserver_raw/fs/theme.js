// Theme switching functionality
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update checkbox state
    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = newTheme === 'dark';
    }
}

function checkTheme() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on saved preference or device preference
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update checkbox state
    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = theme === 'dark';
        toggleCheckbox.addEventListener('change', toggleTheme);
    }
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkTheme();
});