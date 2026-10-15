// Theme switching functionality
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = newTheme === 'dark';
    }
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    const toggleCheckbox = document.getElementById('theme-toggle');
    if (toggleCheckbox) {
        toggleCheckbox.checked = theme === 'dark';
        if (!toggleCheckbox.dataset.listenerAttached) {
            toggleCheckbox.addEventListener('change', toggleTheme);
            toggleCheckbox.dataset.listenerAttached = '1';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkTheme();
});