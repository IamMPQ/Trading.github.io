/**
 * AI Trading Platform - Watchlist Component
 */

function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    const tabsContainer = document.getElementById('watchlist-tabs');
    const content = document.getElementById('watchlist-content');
    
    if (!container) return;

    const watchlists = Storage.loadWatchlists();
    const listNames = Object.keys(watchlists);
    
    if (listNames.length === 0 || watchlists[listNames[0]]?.length === 0) {
        // Show empty state
        if (content) {
            content.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h3>No Stocks in Watchlist</h3>
                    <p>Add stocks to your watchlist to monitor them in real-time with AI-powered alerts.</p>
                    <button class="btn btn-primary" onclick="showAddToWatchlist()">
                        <i class="fas fa-plus"></i> Add Your First Stock
                    </button>
                </div>
            `;
        }
        return;
    }

    // Render tabs
    if (tabsContainer) {
        tabsContainer.innerHTML = listNames.map((name, i) => `
            <button class="watchlist-tab ${i === 0 ? 'active' : ''}" 
                    onclick="switchWatchlistTab('${name}', this)">
                <i class="fas fa-list"></i> ${name}
                <span style="opacity: 0.6; margin-left: 4px;">(${watchlists[name].length})</span>
            </button>
        `).join('') + `
            <button class="watchlist-tab" onclick="createWatchlist()" style="border-style: dashed;">
                <i class="fas fa-plus"></i> New List
            </button>
        `;
    }

    // Render first watchlist content
    const activeList = listNames[0];
    renderWatchlistContent(activeList, watchlists[activeList]);
}

function renderWatchlistContent(listName, symbols) {
    const content = document.getElementById('watchlist-content');
    if (!content || !symbols || symbols.length === 0) return;

    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
            <h4 style="font-size: 0.9rem;">${listName}</h4>
            <div>
                <button class="btn btn-sm btn-secondary" onclick="removeWatchlist('${listName}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="watchlist-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price</th>
                        <th>Change</th>
                        <th>% Change</th>
                        <th>Signal</th>
                        <th>Confidence</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${symbols.map(symbol => {
                        const rec = aiEngine.getRecommendation(symbol);
                        const price = rec?.currentPrice || MarketAPI._getBasePrice(symbol);
                        const change = rec ? (Math.random() - 0.5) * price * 0.02 : (Math.random() - 0.5) * price * 0.02;
                        const changePercent = (change / price) * 100;
                        const changeClass = change >= 0 ? 'positive' : 'negative';
                        const signal = rec?.signal || 'neutral';
                        
                        return `<tr>
                            <td><strong>${symbol}</strong></td>
                            <td class="text-mono">₹${formatPrice(price)}</td>
                            <td class="${changeClass} text-mono">${change >= 0 ? '+' : ''}${change.toFixed(2)}</td>
                            <td class="${changeClass} text-mono">${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%</td>
                            <td><span class="ai-pick-signal ${getSignalClass(signal)}">${getSignalLabel(signal)}</span></td>
                            <td>${rec?.confidence || '--'}%</td>
                            <td>
                                <button class="btn btn-sm btn-secondary" onclick="navigateTo('charts', '${symbol}')">
                                    <i class="fas fa-chart-line"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="removeFromWatchlist('${symbol}', '${listName}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showAddToWatchlist() {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.textContent = 'Add Stock to Watchlist';
    
    const watchlists = Storage.loadWatchlists();
    const listNames = Object.keys(watchlists);

    body.innerHTML = `
        <div class="form-group">
            <label>Watchlist</label>
            <select id="modal-watchlist-select" class="form-select">
                ${listNames.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Stock Symbol</label>
            <input type="text" id="modal-stock-symbol" class="form-input" 
                   placeholder="e.g., RELIANCE, TCS, HDFCBANK" 
                   list="stock-suggestions" autocomplete="off">
            <datalist id="stock-suggestions">
                ${CONFIG.MARKET.nseSymbols.map(s => `<option value="${s}">`).join('')}
            </datalist>
        </div>
        <div style="font-size: 0.8rem; opacity: 0.7; margin-top: var(--spacing-sm);">
            Tip: You can also click the star icon on any stock to add it quickly.
        </div>
    `;

    footer.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="addStockToWatchlist()">
            <i class="fas fa-plus"></i> Add to Watchlist
        </button>
    `;

    showModal();
}

function addStockToWatchlist() {
    const select = document.getElementById('modal-watchlist-select');
    const input = document.getElementById('modal-stock-symbol');
    
    if (!select || !input) return;
    
    const listName = select.value;
    const symbol = input.value.toUpperCase().trim();
    
    if (!symbol) {
        showNotification('Please enter a stock symbol', 'warning');
        return;
    }

    const watchlists = Storage.loadWatchlists();
    
    if (!watchlists[listName]) {
        watchlists[listName] = [];
    }
    
    if (watchlists[listName].includes(symbol)) {
        showNotification(`${symbol} is already in ${listName}`, 'warning');
        return;
    }
    
    watchlists[listName].push(symbol);
    Storage.saveWatchlists(watchlists);
    
    closeModal();
    renderWatchlist();
    showNotification(`${symbol} added to ${listName}`, 'success');
}

function addToWatchlist(symbol, listName = 'Default') {
    const watchlists = Storage.loadWatchlists();
    
    if (!watchlists[listName]) {
        watchlists[listName] = [];
    }
    
    if (watchlists[listName].includes(symbol)) {
        showNotification(`${symbol} is already in watchlist`, 'info');
        return;
    }
    
    watchlists[listName].push(symbol);
    Storage.saveWatchlists(watchlists);
    renderWatchlist();
    showNotification(`${symbol} added to watchlist`, 'success');
}

function removeFromWatchlist(symbol, listName) {
    const watchlists = Storage.loadWatchlists();
    
    if (watchlists[listName]) {
        watchlists[listName] = watchlists[listName].filter(s => s !== symbol);
        Storage.saveWatchlists(watchlists);
        renderWatchlist();
        showNotification(`${symbol} removed from ${listName}`, 'info');
    }
}

function createWatchlist() {
    const name = prompt('Enter watchlist name:');
    if (!name || name.trim() === '') return;
    
    const watchlists = Storage.loadWatchlists();
    if (watchlists[name]) {
        showNotification(`Watchlist "${name}" already exists`, 'warning');
        return;
    }
    
    watchlists[name] = [];
    Storage.saveWatchlists(watchlists);
    renderWatchlist();
    showNotification(`Watchlist "${name}" created`, 'success');
}

function removeWatchlist(name) {
    if (!confirm(`Delete watchlist "${name}"?`)) return;
    
    const watchlists = Storage.loadWatchlists();
    delete watchlists[name];
    Storage.saveWatchlists(watchlists);
    renderWatchlist();
    showNotification(`Watchlist "${name}" deleted`, 'info');
}

function switchWatchlistTab(name, btn) {
    document.querySelectorAll('.watchlist-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    const watchlists = Storage.loadWatchlists();
    renderWatchlistContent(name, watchlists[name] || []);
}

// Make globally accessible
window.renderWatchlist = renderWatchlist;
window.showAddToWatchlist = showAddToWatchlist;
window.addToWatchlist = addToWatchlist;
window.removeFromWatchlist = removeFromWatchlist;
window.createWatchlist = createWatchlist;
window.removeWatchlist = removeWatchlist;
window.switchWatchlistTab = switchWatchlistTab;

export { renderWatchlist, showAddToWatchlist, addToWatchlist };
