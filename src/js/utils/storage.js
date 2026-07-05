/**
 * AI Trading Platform - Local Storage Management
 */

const STORAGE_KEYS = {
    WATCHLISTS: 'ai_trader_watchlists',
    PORTFOLIO: 'ai_trader_portfolio',
    SETTINGS: 'ai_trader_settings',
    THEME: 'ai_trader_theme',
    JOURNAL: 'ai_trader_journal',
    FAVORITES: 'ai_trader_favorites'
};

const Storage = {
    /**
     * Save data to localStorage
     */
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Storage save failed:', e);
            return false;
        }
    },

    /**
     * Load data from localStorage
     */
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Storage load failed:', e);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Save watchlists
     */
    saveWatchlists(watchlists) {
        return this.set(STORAGE_KEYS.WATCHLISTS, watchlists);
    },

    /**
     * Load watchlists
     */
    loadWatchlists() {
        return this.get(STORAGE_KEYS.WATCHLISTS, { 'Default': [] });
    },

    /**
     * Save portfolio
     */
    savePortfolio(portfolio) {
        return this.set(STORAGE_KEYS.PORTFOLIO, portfolio);
    },

    /**
     * Load portfolio
     */
    loadPortfolio() {
        return this.get(STORAGE_KEYS.PORTFOLIO, {
            capital: 100000,
            trades: [],
            createdAt: new Date().toISOString()
        });
    },

    /**
     * Save settings
     */
    saveSettings(settings) {
        return this.set(STORAGE_KEYS.SETTINGS, settings);
    },

    /**
     * Load settings
     */
    loadSettings() {
        return this.get(STORAGE_KEYS.SETTINGS, {});
    },

    /**
     * Save theme preference
     */
    saveTheme(theme) {
        return this.set(STORAGE_KEYS.THEME, theme);
    },

    /**
     * Load theme preference
     */
    loadTheme() {
        return this.get(STORAGE_KEYS.THEME, 'dark');
    },

    /**
     * Save trading journal
     */
    saveJournal(entries) {
        return this.set(STORAGE_KEYS.JOURNAL, entries);
    },

    /**
     * Load trading journal
     */
    loadJournal() {
        return this.get(STORAGE_KEYS.JOURNAL, []);
    },

    /**
     * Save favorites
     */
    saveFavorites(favorites) {
        return this.set(STORAGE_KEYS.FAVORITES, favorites);
    },

    /**
     * Load favorites
     */
    loadFavorites() {
        return this.get(STORAGE_KEYS.FAVORITES, []);
    },

    /**
     * Clear all stored data
     */
    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            this.remove(key);
        });
    },

    /**
     * Get storage usage info
     */
    getStorageInfo() {
        let totalSize = 0;
        let items = 0;
        Object.values(STORAGE_KEYS).forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                totalSize += data.length;
                items++;
            }
        });
        return {
            items,
            totalSize: (totalSize / 1024).toFixed(2) + ' KB',
            quota: '~5-10 MB (browser dependent)'
        };
    }
};

export default Storage;
