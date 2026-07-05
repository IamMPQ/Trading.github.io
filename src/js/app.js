/**
 * AI Intraday Trading Platform - Main Application
 * Initializes all components and manages the application lifecycle
 */

// ============================================
// Application Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 AI Intraday Trading Platform initializing...');
    
    try {
        // 1. Initialize theme
        ThemeManager.init();
        
        // 2. Initialize router
        Router.init();
        
        // 3. Setup global search
        setupGlobalSearch();
        
        // 4. Setup topbar clock
        setupClock();
        
        // 5. Setup sidebar toggle for mobile
        setupSidebarToggle();
        
        // 6. Setup tab groups
        setupTabGroups();
        
        // 7. Setup scanner filter
        setupScannerFilter();
        
        // 8. Initialize charts
        setupChartControls();
        
        // 9. Initialize AI assistant
        initAssistant();
        
        // 10. Load saved settings
        loadSettings();
        
        // 11. Load portfolio and watchlist
        loadPortfolio();
        renderWatchlist();
        
        // 12. Load initial market data
        await loadInitialData();
        
        // 13. Schedule periodic updates
        startPeriodicUpdates();
        
        // 14. Mark app as initialized
        APP.state.initialized = true;
        
        // 15. Hide loading screen
        hideLoadingScreen();
        
        console.log('✅ Application initialized successfully');
        showNotification('Platform ready. Market data loaded.', 'success', 3000);
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        showNotification('Failed to initialize. Please refresh the page.', 'error', 6000);
        
        // Still hide loading screen so user can see something
        hideLoadingScreen();
    }
});

// ============================================
// Initial Data Loading
// ============================================

async function loadInitialData() {
    // Update loading progress
    updateLoadingProgress(20, 'Fetching market indices...');
    
    // Load market indices
    await renderDashboard();
    
    updateLoadingProgress(40, 'Loading scanner data...');
    
    // Initial quick scan (just a few stocks for speed)
    const quickSymbols = CONFIG.MARKET.nseSymbols.slice(0, 20);
    const ohlcDataMap = {};
    
    for (let i = 0; i < quickSymbols.length; i += 5) {
        const batch = quickSymbols.slice(i, i + 5);
        await Promise.allSettled(batch.map(async (symbol) => {
            try {
                const data = await MarketAPI.getChart(symbol, '15m', '5d');
                ohlcDataMap[symbol] = (data && data.length > 20) ? data : generateMockOHLC(symbol);
            } catch {
                ohlcDataMap[symbol] = generateMockOHLC(symbol);
            }
        }));
    }
    
    updateLoadingProgress(60, 'Running AI analysis...');
    
    // Initial AI analysis
    const news = await NewsAPI.getNews('general', 15);
    await aiEngine.analyzeStocks(Object.keys(ohlcDataMap), ohlcDataMap, news, {});
    
    updateLoadingProgress(80, 'Building dashboard...');
    
    // Update dashboard with AI picks
    updateAIPicks();
    
    // Update recommendation badge
    const buyCount = aiEngine.recommendations.filter(r => 
        r.signal === 'buy' || r.signal === 'strong-buy'
    ).length;
    const recBadge = document.getElementById('rec-badge');
    if (recBadge) recBadge.textContent = buyCount;
    
    updateLoadingProgress(100, 'Ready!');
}

// ============================================
// Periodic Updates
// ============================================

function startPeriodicUpdates() {
    // Market data refresh based on user settings
    const refreshInterval = parseInt(
        document.getElementById('settings-refresh')?.value || CONFIG.MARKET.refreshInterval
    );
    
    // Refresh market data every 30 seconds
    setInterval(async () => {
        if (Router.currentView === 'dashboard') {
            await renderDashboard();
        }
    }, 30000);
    
    // Refresh ticker more frequently (10 seconds)
    setInterval(async () => {
        try {
            const indices = await MarketAPI.getAllIndices();
            if (Object.keys(indices).length > 0) {
                APP.state.indices = indices;
                updateMarketTicker(indices);
            }
        } catch (e) {
            // Silent fail for ticker updates
        }
    }, 10000);
    
    // Update clock every second
    setInterval(() => {
        const timeEl = document.getElementById('topbar-time');
        if (timeEl) timeEl.textContent = getIndianTime();
        
        // Update market status indicator
        const statusEl = document.getElementById('market-status');
        if (statusEl) {
            const open = isMarketOpen();
            statusEl.innerHTML = `
                <span class="status-indicator ${open ? 'open' : 'closed'}"></span>
                <span class="status-text">${open ? 'Market Open' : 'Market Closed'}</span>
            `;
        }
    }, 1000);
}

// ============================================
// UI Setup Functions
// ============================================

function setupGlobalSearch() {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    const debouncedSearch = debounce(async (query) => {
        if (query.length < 1) {
            searchResults.classList.remove('show');
            return;
        }
        
        const stocks = CONFIG.MARKET.nseSymbols
            .filter(s => s.includes(query.toUpperCase()))
            .slice(0, 8);
        
        if (stocks.length === 0) {
            searchResults.classList.remove('show');
            return;
        }
        
        searchResults.innerHTML = stocks.map(s => `
            <div class="search-result-item" onclick="selectSearchStock('${s}')">
                <span><strong>${s}</strong></span>
                <span style="font-size: 0.75rem; opacity: 0.6;">NSE</span>
            </div>
        `).join('');
        
        searchResults.classList.add('show');
    }, 200);
    
    searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchResults.classList.remove('show'), 200);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            debouncedSearch(searchInput.value.trim());
        }
    });
}

function selectSearchStock(symbol) {
    document.getElementById('global-search').value = symbol;
    document.getElementById('search-results').classList.remove('show');
    navigateToCharts(symbol);
}

function setupClock() {
    const el = document.getElementById('topbar-time');
    if (el) el.textContent = getIndianTime();
}

function setupSidebarToggle() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
                // Create overlay if needed
                let overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    overlay.addEventListener('click', () => {
                        sidebar.classList.remove('mobile-open');
                        overlay.classList.remove('show');
                    });
                    document.body.appendChild(overlay);
                }
                overlay.classList.toggle('show', sidebar.classList.contains('mobile-open'));
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
}

function setupTabGroups() {
    document.querySelectorAll('.tab-group').forEach(group => {
        group.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.card');
                group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tab = btn.dataset.tab;
                if (parent) {
                    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    const target = parent.querySelector(`#tab-${tab}`);
                    if (target) target.classList.add('active');
                }
            });
        });
    });
}

function setupScannerFilter() {
    const filter = document.getElementById('scanner-filter');
    if (filter) {
        filter.addEventListener('change', () => {
            const results = aiEngine.getScannerData(filter.value);
            const body = document.getElementById('scanner-body');
            renderScannerResults(results, body);
        });
    }
}

// ============================================
// Settings
// ============================================

function loadSettings() {
    const settings = Storage.loadSettings();
    
    if (settings.theme) {
        document.getElementById('settings-theme').value = settings.theme;
    }
    if (settings.capital) {
        document.getElementById('settings-capital').value = settings.capital;
        document.getElementById('risk-capital').value = settings.capital;
    }
    if (settings.risk) {
        document.getElementById('settings-risk').value = settings.risk;
        document.getElementById('risk-percent').value = settings.risk;
    }
    if (settings.sizing) {
        document.getElementById('settings-sizing').value = settings.sizing;
    }
    if (settings.refresh) {
        document.getElementById('settings-refresh').value = settings.refresh;
    }
}

function changeTheme(theme) {
    ThemeManager.changeTheme(theme);
    Storage.saveSettings({ ...Storage.loadSettings(), theme });
}

function toggleAnimations(enabled) {
    document.documentElement.style.setProperty('--transition-fast', enabled ? '150ms ease' : '0ms');
    document.documentElement.style.setProperty('--transition-normal', enabled ? '250ms ease' : '0ms');
    document.documentElement.style.setProperty('--transition-slow', enabled ? '400ms ease' : '0ms');
}

function changeRefreshInterval(ms) {
    const settings = Storage.loadSettings();
    settings.refresh = parseInt(ms);
    Storage.saveSettings(settings);
    showNotification(`Refresh interval updated to ${ms/1000}s`, 'info');
}

// ============================================
// Portfolio
// ============================================

function loadPortfolio() {
    const portfolio = Storage.loadPortfolio();
    APP.state.portfolio = portfolio;
    
    updatePortfolioSummary();
    renderJournal();
}

function updatePortfolioSummary() {
    const p = APP.state.portfolio;
    const trades = p.trades || [];
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winTrades = closedTrades.filter(t => t.pnl > 0);
    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const invested = trades.filter(t => t.status === 'open')
        .reduce((sum, t) => sum + (t.entry * t.quantity || 0), 0);
    
    const updateEl = (id, value, cls = '') => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            if (cls) el.className = `summary-value ${cls}`;
        }
    };
    
    updateEl('portfolio-capital', formatINR(p.capital));
    updateEl('portfolio-invested', formatINR(invested));
    updateEl('portfolio-pnl', formatINR(totalPnl), totalPnl >= 0 ? 'positive' : 'negative');
    updateEl('portfolio-trades', trades.length.toString());
    
    const returns = p.capital > 0 ? ((totalPnl / p.capital) * 100).toFixed(1) : '0.0';
    updateEl('portfolio-returns', `${returns}%`, parseFloat(returns) >= 0 ? 'positive' : 'negative');
    
    const winRate = closedTrades.length > 0 
        ? ((winTrades.length / closedTrades.length) * 100).toFixed(0) 
        : '0';
    updateEl('portfolio-winrate', `${winRate}%`);
}

function renderJournal() {
    const body = document.getElementById('journal-body');
    if (!body) return;
    
    const trades = APP.state.portfolio.trades || [];
    
    if (trades.length === 0) {
        body.innerHTML = '<tr><td colspan="10" class="empty-row">No trades recorded yet. Start your trading journal!</td></tr>';
        return;
    }
    
    body.innerHTML = trades.slice().reverse().slice(0, 50).map(t => `
        <tr>
            <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
            <td><strong>${t.symbol}</strong></td>
            <td>${t.type === 'long' ? 'BUY' : 'SELL'}</td>
            <td>₹${formatPrice(t.entry)}</td>
            <td>${t.exit ? '₹' + formatPrice(t.exit) : '--'}</td>
            <td>${t.quantity}</td>
            <td class="${t.pnl >= 0 ? 'positive' : 'negative'}">${t.pnl ? formatINR(t.pnl) : '--'}</td>
            <td><span class="${t.status === 'closed' ? 'badge badge-success' : 'badge badge-warning'}">
                ${t.status === 'closed' ? 'Closed' : 'Open'}
            </span></td>
            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${t.notes || '--'}
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteTrade('${t.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddTrade() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');
    
    title.textContent = 'Add Trade to Journal';
    
    body.innerHTML = `
        <div class="form-group">
            <label>Symbol</label>
            <input type="text" id="trade-symbol" class="form-input" placeholder="e.g., RELIANCE" list="stock-suggestions">
        </div>
        <div class="form-group">
            <label>Type</label>
            <select id="trade-type" class="form-select">
                <option value="long">Long (Buy)</option>
                <option value="short">Short (Sell)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Entry Price (₹)</label>
            <input type="number" id="trade-entry" class="form-input" placeholder="Entry price">
        </div>
        <div class="form-group">
            <label>Exit Price (₹) - Leave blank if open</label>
            <input type="number" id="trade-exit" class="form-input" placeholder="Exit price (optional)">
        </div>
        <div class="form-group">
            <label>Quantity</label>
            <input type="number" id="trade-qty" class="form-input" placeholder="Number of shares">
        </div>
        <div class="form-group">
            <label>Notes</label>
            <textarea id="trade-notes" class="form-input" rows="2" placeholder="Why did you take this trade?"></textarea>
        </div>
    `;
    
    footer.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveTrade()">Save Trade</button>
    `;
    
    showModal();
}

function saveTrade() {
    const symbol = document.getElementById('trade-symbol')?.value?.toUpperCase();
    const type = document.getElementById('trade-type')?.value;
    const entry = parseFloat(document.getElementById('trade-entry')?.value);
    const exitInput = document.getElementById('trade-exit')?.value;
    const exit = exitInput ? parseFloat(exitInput) : null;
    const quantity = parseInt(document.getElementById('trade-qty')?.value);
    const notes = document.getElementById('trade-notes')?.value || '';
    
    if (!symbol || !entry || !quantity) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }
    
    const portfolio = Storage.loadPortfolio();
    const pnl = exit ? (type === 'long' ? (exit - entry) * quantity : (entry - exit) * quantity) : 0;
    
    portfolio.trades.push({
        id: generateId(),
        date: new Date().toISOString(),
        symbol,
        type,
        entry,
        exit,
        quantity,
        pnl: Math.round(pnl * 100) / 100,
        status: exit ? 'closed' : 'open',
        notes
    });
    
    Storage.savePortfolio(portfolio);
    APP.state.portfolio = portfolio;
    
    closeModal();
    updatePortfolioSummary();
    renderJournal();
    showNotification('Trade saved successfully!', 'success');
}

function deleteTrade(id) {
    if (!confirm('Delete this trade?')) return;
    
    const portfolio = Storage.loadPortfolio();
    portfolio.trades = portfolio.trades.filter(t => t.id !== id);
    Storage.savePortfolio(portfolio);
    APP.state.portfolio = portfolio;
    
    updatePortfolioSummary();
    renderJournal();
    showNotification('Trade deleted', 'info');
}

function exportPortfolio() {
    const portfolio = APP.state.portfolio;
    const dataStr = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Portfolio exported!', 'success');
}

// ============================================
// Modal Functions
// ============================================

function showModal() {
    document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
}

// ============================================
// Loading Screen
// ============================================

function updateLoadingProgress(percent, text) {
    const bar = document.getElementById('loader-progress-bar');
    const subtitle = document.querySelector('.loader-subtitle');
    if (bar) bar.style.width = `${percent}%`;
    if (subtitle && text) subtitle.textContent = text;
}

function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (screen) {
        screen.classList.add('hidden');
        setTimeout(() => screen.style.display = 'none', 500);
    }
}

// ============================================
// Disclaimer
// ============================================

function showDisclaimer() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');
    
    title.textContent = '⚠️ Disclaimer';
    
    body.innerHTML = `
        <div style="font-size: 0.85rem; line-height: 1.7;">
            <p style="margin-bottom: var(--spacing-md);">
                <strong>AI Intraday Trading Platform</strong> is an AI-powered decision support tool only.
            </p>
            <p style="margin-bottom: var(--spacing-sm);">
                <strong>1. No Financial Advice:</strong> The information, analysis, and recommendations 
                provided by this platform are for informational and educational purposes only. They 
                do not constitute financial advice, investment advice, or any solicitation to buy or 
                sell securities.
            </p>
            <p style="margin-bottom: var(--spacing-sm);">
                <strong>2. No Guarantees:</strong> Trading in stock markets involves substantial risk 
                of loss. Past performance and historical analysis do not guarantee future results. 
                The AI-generated recommendations have no guaranteed accuracy.
            </p>
            <p style="margin-bottom: var(--spacing-sm);">
                <strong>3. Do Your Own Research:</strong> Always conduct your own research and consult 
                with a qualified financial advisor before making any trading decisions.
            </p>
            <p style="margin-bottom: var(--spacing-sm);">
                <strong>4. No Auto-Trading:</strong> This platform does NOT execute any trades 
                automatically. Users must manually place all trades through their broker.
            </p>
            <p style="margin-bottom: var(--spacing-sm);">
                <strong>5. Data Accuracy:</strong> While we strive for accuracy, market data may be 
                delayed or contain errors. Do not rely solely on this platform for trading decisions.
            </p>
            <p>
                By using this platform, you acknowledge and accept these terms.
            </p>
        </div>
    `;
    
    footer.innerHTML = `
        <button class="btn btn-primary" onclick="closeModal()">I Understand</button>
    `;
    
    showModal();
}

// ============================================
// View Change Handler
// ============================================

document.addEventListener('viewChange', (e) => {
    const view = e.detail.view;
    
    switch (view) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'watchlist':
            renderWatchlist();
            break;
        case 'charts':
            setTimeout(() => {
                const symbol = document.getElementById('chart-symbol')?.value || 'RELIANCE';
                const interval = document.getElementById('chart-interval')?.value || '15m';
                loadChartData(symbol, interval);
            }, 300);
            break;
        case 'recommendations':
            renderRecommendations();
            break;
        case 'portfolio':
            updatePortfolioSummary();
            renderJournal();
            break;
        case 'settings':
            loadSettings();
            break;
    }
});

// ============================================
// Recommendations View
// ============================================

function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;
    
    const filter = document.getElementById('rec-filter')?.value || 'all';
    const results = aiEngine.getScannerData(filter);
    const updateTime = document.getElementById('rec-update-time');
    if (updateTime) updateTime.textContent = `Last: ${getIndianTime()}`;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-bullhorn"></i>
                <h3>No Recommendations Yet</h3>
                <p>Run the Stock Scanner to get AI-powered trade recommendations.</p>
                <button class="btn btn-primary" onclick="navigateTo('scanner'); setTimeout(() => runScanner(), 300);">
                    <i class="fas fa-search"></i> Run Scanner
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = results.slice(0, 20).map(rec => `
        <div class="rec-card">
            <div class="rec-header">
                <div>
                    <div class="rec-symbol">${rec.symbol}</div>
                    <div class="rec-name">NSE: ${rec.symbol}</div>
                </div>
                <div>
                    <span class="rec-signal ${getSignalClass(rec.signal)}">${getSignalLabel(rec.signal)}</span>
                </div>
            </div>
            <div class="rec-body">
                <div class="rec-price-row">
                    <span class="rec-price-label">Current Price</span>
                    <span class="rec-price-value">₹${formatPrice(rec.currentPrice)}</span>
                </div>
                <div class="rec-detail-grid">
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Entry</span>
                        <span>₹${formatPrice(rec.entry)}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Stop Loss</span>
                        <span style="color: var(--negative);">₹${formatPrice(rec.stopLoss)}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Target 1</span>
                        <span style="color: var(--positive);">₹${formatPrice(rec.targets?.[0] || 'N/A')}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Target 2</span>
                        <span style="color: var(--positive);">₹${formatPrice(rec.targets?.[1] || 'N/A')}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Target 3</span>
                        <span style="color: var(--positive);">₹${formatPrice(rec.targets?.[2] || 'N/A')}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">R/R Ratio</span>
                        <span>1:${rec.riskReward}</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Confidence</span>
                        <span>${rec.confidence}%</span>
                    </div>
                    <div class="rec-detail-item">
                        <span class="rec-detail-label">Score</span>
                        <span>${rec.score}/100</span>
                    </div>
                </div>
                <div class="rec-confidence">
                    <span style="font-size: 0.75rem;">AI Confidence Score</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${rec.confidence}%; 
                            background: ${rec.confidence >= 60 ? 'var(--positive)' : rec.confidence >= 40 ? 'var(--warning)' : 'var(--negative)'}">
                        </div>
                    </div>
                </div>
            </div>
            <div class="rec-footer">
                <span>⏱ ${rec.holdingTime} | 📊 ${rec.expectedVolatility} Volatility | 🎯 ${rec.probability}% Probability</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// Filter Change Handler for Recommendations
// ============================================

document.getElementById('rec-filter')?.addEventListener('change', renderRecommendations);

// ============================================
// Global Window Exports
// ============================================

window.changeTheme = changeTheme;
window.toggleAnimations = toggleAnimations;
window.changeRefreshInterval = changeRefreshInterval;
window.showModal = showModal;
window.closeModal = closeModal;
window.showDisclaimer = showDisclaimer;
window.showAddTrade = showAddTrade;
window.saveTrade = saveTrade;
window.deleteTrade = deleteTrade;
window.exportPortfolio = exportPortfolio;
window.selectSearchStock = selectSearchStock;
window.renderRecommendations = renderRecommendations;

console.log('📝 AI Trader App Loaded - Ready for trading analysis');
