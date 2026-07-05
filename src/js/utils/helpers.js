/**
 * AI Trading Platform - Utility Helpers
 */

// Global namespace for shared state
window.AI_TRADER = window.AI_TRADER || {
    state: {
        marketData: {},
        indices: {},
        recommendations: [],
        watchlists: {},
        portfolio: { trades: [], capital: 100000 },
        settings: {},
        scannerResults: [],
        initialized: false
    }
};

const APP = window.AI_TRADER;

/**
 * Format number with commas for Indian/International notation
 */
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '--';
    return Number(num).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Format price with appropriate decimals
 */
function formatPrice(price) {
    if (price === null || price === undefined || isNaN(price)) return '--';
    if (price < 1) return formatNumber(price, 4);
    if (price < 10) return formatNumber(price, 3);
    if (price < 100) return formatNumber(price, 2);
    return formatNumber(price, 2);
}

/**
 * Format percentage change
 */
function formatChange(change) {
    if (change === null || change === undefined || isNaN(change)) return '--';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

/**
 * Format currency in INR
 */
function formatINR(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '--';
    return '₹' + formatNumber(amount);
}

/**
 * Format large numbers (volume, market cap)
 */
function formatLargeNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '--';
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(2) + ' K';
    return num.toString();
}

/**
 * Convert NSE symbol to Yahoo Finance symbol
 */
function toYahooSymbol(symbol) {
    return symbol + '.NS';
}

/**
 * Convert BSE symbol to Yahoo Finance symbol
 */
function toBSESymbol(symbol) {
    return symbol + '.BO';
}

/**
 * Get current Indian time formatted
 */
function getIndianTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return now.toLocaleTimeString('en-IN', options);
}

/**
 * Check if market is open (9:15 AM - 3:30 PM IST, Mon-Fri)
 */
function isMarketOpen() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false };
    const istStr = now.toLocaleString('en-IN', options);
    const parts = istStr.split(', ');
    const day = parts[0];
    const timeParts = parts[1].split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const totalMinutes = hours * 60 + minutes;
    
    // Weekdays (Mon-Fri) and time between 9:15 and 15:30
    const isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
    const isTradingHours = totalMinutes >= 555 && totalMinutes < 930; // 9:15 = 555, 15:30 = 930
    
    return isWeekday && isTradingHours;
}

/**
 * Get current market session
 */
function getMarketSession() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
    const istStr = now.toLocaleString('en-IN', options);
    const [hours, minutes] = istStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes < 555) return 'pre-market';
    if (totalMinutes < 930) return 'intraday';
    if (totalMinutes < 1020) return 'post-market'; // 17:00
    return 'closed';
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate random ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Calculate percentage change
 */
function percentChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Classify sentiment text
 */
function classifySentiment(text) {
    const bullishWords = ['bullish', 'surge', 'gain', 'positive', 'growth', 'profit', 'rise', 'rally',
        'upgrade', 'outperform', 'strong', 'recovery', 'boom', 'breakout', 'green', 'upward',
        'buy', 'bull', 'optimistic', 'expansion', 'high', 'record'];
    const bearishWords = ['bearish', 'decline', 'loss', 'negative', 'fall', 'drop', 'crash', 'downgrade',
        'underperform', 'weak', 'recession', 'slowdown', 'sell', 'bear', 'pessimistic',
        'contraction', 'low', 'debt', 'crisis', 'volatile', 'risk', 'warning'];
    
    const lower = text.toLowerCase();
    let bullishScore = 0;
    let bearishScore = 0;
    
    bullishWords.forEach(word => {
        if (lower.includes(word)) bullishScore++;
    });
    
    bearishWords.forEach(word => {
        if (lower.includes(word)) bearishScore++;
    });
    
    if (bullishScore > bearishScore + 1) return 'bullish';
    if (bearishScore > bullishScore + 1) return 'bearish';
    return 'neutral';
}

/**
 * Get signal class for CSS
 */
function getSignalClass(signal) {
    const map = {
        'strong_buy': 'signal-strong-buy',
        'buy': 'signal-buy',
        'neutral': 'signal-neutral',
        'sell': 'signal-sell',
        'strong_sell': 'signal-strong-sell',
        'strong-buy': 'signal-strong-buy',
        'strong-sell': 'signal-strong-sell'
    };
    return map[signal] || 'signal-neutral';
}

/**
 * Get signal label
 */
function getSignalLabel(signal) {
    const map = {
        'strong_buy': 'STRONG BUY',
        'buy': 'BUY',
        'neutral': 'NEUTRAL',
        'sell': 'SELL',
        'strong_sell': 'STRONG SELL',
        'strong-buy': 'STRONG BUY',
        'strong-sell': 'STRONG SELL'
    };
    return map[signal] || signal.toUpperCase();
}

/**
 * Sleep / delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * CSS class helpers
 */
function addClass(el, className) {
    if (el) el.classList.add(className);
}

function removeClass(el, className) {
    if (el) el.classList.remove(className);
}

function toggleClass(el, className) {
    if (el) el.classList.toggle(className);
}

function hasClass(el, className) {
    return el && el.classList.contains(className);
}

/**
 * Safe query selector
 */
function $(selector, parent = document) {
    return parent.querySelector(selector);
}

function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Create element with attributes and content
 */
function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') el.className = value;
        else if (key === 'innerHTML') el.innerHTML = value;
        else if (key === 'style' && typeof value === 'object') {
            Object.entries(value).forEach(([prop, val]) => el.style[prop] = val);
        }
        else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
        else el.setAttribute(key, value);
    });
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

export {
    APP, formatNumber, formatPrice, formatChange, formatINR,
    formatLargeNumber, toYahooSymbol, toBSESymbol,
    getIndianTime, isMarketOpen, getMarketSession,
    deepClone, debounce, throttle, generateId, percentChange,
    classifySentiment, getSignalClass, getSignalLabel,
    sleep, addClass, removeClass, toggleClass, hasClass,
    $, $$, createElement
};
