function updateToggleButtons() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const lightIcon = document.querySelector('#theme-toggle-light');
    const darkIcon = document.querySelector('#theme-toggle-dark');
    if (currentTheme !== 'light') {
        lightIcon.style.display = '';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = '';
    }
}

function toggleTheme() {
    let theme = document.documentElement.getAttribute('data-theme');
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateToggleButtons();
}

document.addEventListener('DOMContentLoaded', function () {
    const currentTheme = localStorage.getItem('theme') || 'light';
    updateToggleButtons();
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-toggle-light').addEventListener('click', toggleTheme);
    document.getElementById('theme-toggle-dark').addEventListener('click', toggleTheme);
});
