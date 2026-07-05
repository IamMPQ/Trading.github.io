/**
 * AI Trading Platform - Theme Manager
 */

const ThemeManager = {
    currentTheme: 'dark',

    init() {
        this.currentTheme = Storage.loadTheme() || 'dark';
        this.apply(this.currentTheme);
        this.setupToggle();
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        Storage.saveTheme(theme);
        
        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.content = theme === 'dark' ? '#0f0f1a' : '#f8fafc';
        }
    },

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.apply(newTheme);
        this.updateToggleIcon();
        showNotification(`Switched to ${newTheme} mode`, 'info');
    },

    setupToggle() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', () => this.toggle());
        }
        this.updateToggleIcon();
    },

    updateToggleIcon() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.innerHTML = this.currentTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    },

    changeTheme(theme) {
        this.apply(theme);
        this.updateToggleIcon();
    }
};

export default ThemeManager;
