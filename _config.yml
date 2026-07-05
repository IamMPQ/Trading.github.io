/**
 * AI Trading Platform - Dashboard Component
 */

async function renderDashboard() {
    try {
        // Fetch market data
        const indices = await MarketAPI.getAllIndices();
        APP.state.indices = indices;

        // Update indices grid
        updateIndicesGrid(indices);
        
        // Update market ticker
        updateMarketTicker(indices);
        
        // Update market breadth
        updateMarketBreadth();
        
        // Update sector performance
        updateSectorPerformance();
        
        // Update AI picks
        updateAIPicks();
        
        // Update top movers
        updateTopMovers();
        
        // Update market heatmap
        updateMarketHeatmap();

        // Update market status
        updateMarketStatus();

        // Update time
        document.getElementById('market-update-time').textContent = 
            `Last updated: ${getIndianTime()}`;
    } catch (error) {
        console.warn('Dashboard render error:', error);
    }
}

function updateIndicesGrid(indices) {
    const grid = document.getElementById('indices-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    const indexConfig = CONFIG.MARKET.indices;
    
    Object.entries(indexConfig).forEach(([symbol, info]) => {
        const data = indices[symbol];
        if (!data) return;
        
        const changeClass = data.changePercent >= 0 ? 'positive' : 'negative';
        const sign = data.changePercent >= 0 ? '+' : '';
        
        const card = document.createElement('div');
        card.className = 'index-card';
        card.innerHTML = `
            <div class="index-name">${info.short || info.name}</div>
            <div class="index-price ${changeClass}">${formatPrice(data.price)}</div>
            <div class="index-change ${changeClass}">
                ${sign}${(data.change || 0).toFixed(2)} (${formatChange(data.changePercent)})
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateMarketTicker(indices) {
    const updatePrice = (id, price, change) => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatPrice(price);
        const el2 = document.getElementById(id.replace('-price', '-change'));
        if (el2) {
            el2.textContent = formatChange(change);
            el2.className = `ticker-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    };

    if (indices['^NSEI']) {
        updatePrice('nifty-price', indices['^NSEI'].price, indices['^NSEI'].changePercent);
    }
    if (indices['^BSESN']) {
        updatePrice('sensex-price', indices['^BSESN'].price, indices['^BSESN'].changePercent);
    }
    if (indices['^NSEBANK']) {
        updatePrice('banknifty-price', indices['^NSEBANK'].price, indices['^NSEBANK'].changePercent);
    }
    if (indices['^INDIAVIX']) {
        updatePrice('vix-price', indices['^INDIAVIX'].price, indices['^INDIAVIX'].changePercent);
    }
}

function updateMarketBreadth() {
    const container = document.getElementById('breadth-container');
    if (!container) return;

    const advances = Math.floor(Math.random() * 800 + 800);
    const declines = Math.floor(Math.random() * 600 + 400);
    const unchanged = Math.floor(Math.random() * 100 + 50);
    const total = advances + declines + unchanged;
    const advancePercent = (advances / total) * 100;

    container.innerHTML = `
        <div class="breadth-item">
            <span>Advances</span>
            <div class="breadth-bar">
                <div class="breadth-fill positive" style="width: ${advancePercent}%"></div>
            </div>
            <span class="positive">${advances}</span>
        </div>
        <div class="breadth-item">
            <span>Declines</span>
            <div class="breadth-bar">
                <div class="breadth-fill negative" style="width: ${100 - advancePercent}%"></div>
            </div>
            <span class="negative">${declines}</span>
        </div>
        <div class="breadth-item">
            <span>Unchanged</span>
            <div class="breadth-bar">
                <div class="breadth-fill" style="width: ${(unchanged / total) * 100}%; background: var(--neutral);"></div>
            </div>
            <span>${unchanged}</span>
        </div>
        <div class="breadth-item" style="font-weight: 600; margin-top: var(--spacing-sm);">
            <span>Advance/Decline Ratio</span>
            <span>${(advances / (declines || 1)).toFixed(2)}</span>
        </div>
        <div class="breadth-item" style="font-size: 0.78rem; opacity: 0.7;">
            <span>Market participated: ${total.toLocaleString('en-IN')} stocks</span>
        </div>
    `;
}

function updateSectorPerformance() {
    const container = document.getElementById('sector-chart');
    if (!container) return;

    const sectors = [
        { name: 'IT', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Banking', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Pharma', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Auto', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'FMCG', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Metal', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Realty', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Energy', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'PSU', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Media', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Finance', change: (Math.random() * 2 - 0.5).toFixed(2) },
        { name: 'Infra', change: (Math.random() * 2 - 0.5).toFixed(2) }
    ];

    container.innerHTML = sectors.map(s => {
        const change = parseFloat(s.change);
        const cls = change >= 0 ? 'positive' : 'negative';
        const bg = change >= 0 
            ? `rgba(34, 197, 94, ${Math.min(Math.abs(change) / 2, 0.3)})` 
            : `rgba(239, 68, 68, ${Math.min(Math.abs(change) / 2, 0.3)})`;
        
        return `<div class="sector-item" style="background: ${bg}">
            <span class="sector-name">${s.name}</span>
            <span class="sector-change ${cls}">${change >= 0 ? '+' : ''}${change}%</span>
        </div>`;
    }).join('');
}

function updateMarketHeatmap() {
    const container = document.getElementById('market-heatmap');
    if (!container) return;

    const stocks = CONFIG.MARKET.nseSymbols.slice(0, 60);
    
    container.innerHTML = stocks.map(symbol => {
        const change = (Math.random() * 6 - 3).toFixed(1);
        const absChange = Math.abs(parseFloat(change));
        let color;
        if (parseFloat(change) > 0) {
            const intensity = Math.min(absChange / 3, 1);
            const g = Math.round(200 - intensity * 150);
            color = `rgb(${Math.round(30 - intensity * 20)}, ${g}, ${Math.round(50 - intensity * 30)})`;
        } else if (parseFloat(change) < 0) {
            const intensity = Math.min(absChange / 3, 1);
            color = `rgb(${Math.round(200 - intensity * 50)}, ${Math.round(50 - intensity * 20)}, ${Math.round(50 - intensity * 20)})`;
        } else {
            color = 'var(--bg-tertiary)';
        }
        
        return `<div class="heatmap-item" style="background: ${color}" 
                    title="${symbol}: ${change}%">
            ${symbol.substring(0, 4)}
        </div>`;
    }).join('');
}

function updateAIPicks() {
    const container = document.getElementById('ai-picks-container');
    if (!container) return;

    const recommendations = aiEngine.getTopRecommendations(4);
    
    if (recommendations.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">
            <i class="fas fa-microchip"></i>
            <h3>No AI Picks Yet</h3>
            <p>Run the Stock Scanner to generate AI-powered recommendations.</p>
        </div>`;
        return;
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="ai-pick-card" onclick="navigateTo('charts', '${rec.symbol}')">
            <div class="ai-pick-header">
                <span class="ai-pick-symbol">${rec.symbol}</span>
                <span class="ai-pick-signal ${getSignalClass(rec.signal)}">${getSignalLabel(rec.signal)}</span>
            </div>
            <div class="ai-pick-price ${rec.signal === 'sell' || rec.signal === 'strong-sell' ? 'negative' : 'positive'}">
                ₹${formatPrice(rec.currentPrice)}
            </div>
            <div class="ai-pick-info">
                <span>Conf: ${rec.confidence}%</span>
                <span>Score: ${rec.score}/100</span>
                <span>R/R: ${rec.riskReward}</span>
            </div>
            <div class="rec-confidence" style="margin-top: 8px;">
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${rec.confidence}%; 
                        background: ${rec.confidence >= 60 ? 'var(--positive)' : rec.confidence >= 40 ? 'var(--warning)' : 'var(--negative)'}">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateTopMovers() {
    // Generate mock gainers/losers/active
    const symbols = CONFIG.MARKET.nseSymbols.slice(0, 30);
    
    // Gainers
    const gainers = symbols
        .map(s => ({ symbol: s, price: Math.random() * 3000 + 50, change: Math.random() * 5 + 1 }))
        .sort((a, b) => b.change - a.change)
        .slice(0, 10);
    
    // Losers
    const losers = symbols
        .map(s => ({ symbol: s, price: Math.random() * 3000 + 50, change: -(Math.random() * 5 + 1) }))
        .sort((a, b) => a.change - b.change)
        .slice(0, 10);
    
    // Active
    const active = symbols
        .map(s => ({ symbol: s, price: Math.random() * 3000 + 50, volume: Math.floor(Math.random() * 10000000 + 500000) }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10);

    const gainersBody = document.getElementById('gainers-body');
    const losersBody = document.getElementById('losers-body');
    const activeBody = document.getElementById('active-body');

    if (gainersBody) {
        gainersBody.innerHTML = gainers.map(g => `
            <tr>
                <td><strong>${g.symbol}</strong></td>
                <td>₹${formatPrice(g.price)}</td>
                <td class="positive">+${g.change.toFixed(2)}</td>
                <td class="positive">+${((g.change / g.price) * 100).toFixed(2)}%</td>
            </tr>
        `).join('');
    }

    if (losersBody) {
        losersBody.innerHTML = losers.map(l => `
            <tr>
                <td><strong>${l.symbol}</strong></td>
                <td>₹${formatPrice(l.price)}</td>
                <td class="negative">${l.change.toFixed(2)}</td>
                <td class="negative">${((l.change / l.price) * 100).toFixed(2)}%</td>
            </tr>
        `).join('');
    }

    if (activeBody) {
        activeBody.innerHTML = active.map(a => `
            <tr>
                <td><strong>${a.symbol}</strong></td>
                <td>₹${formatPrice(a.price)}</td>
                <td>${formatLargeNumber(a.volume)}</td>
                <td>₹${formatLargeNumber(a.price * a.volume)}</td>
            </tr>
        `).join('');
    }
}

function updateMarketStatus() {
    const el = document.getElementById('market-status');
    if (!el) return;
    
    const status = isMarketOpen();
    el.innerHTML = `
        <span class="status-indicator ${status ? 'open' : 'closed'}"></span>
        <span class="status-text">${status ? 'Market Open' : 'Market Closed'}</span>
    `;
}

function refreshMarketData() {
    showNotification('Refreshing market data...', 'info', 2000);
    renderDashboard();
}

// Make globally accessible
window.refreshMarketData = refreshMarketData;

export { renderDashboard, updateIndicesGrid, updateMarketTicker, updateMarketBreadth, 
         updateSectorPerformance, updateMarketHeatmap, updateAIPicks, updateTopMovers };
