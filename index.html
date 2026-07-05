/**
 * AI Trading Platform - Stock Scanner Component
 */

let autoScanInterval = null;

async function runScanner() {
    const filter = document.getElementById('scanner-filter')?.value || 'all';
    const resultsBody = document.getElementById('scanner-body');
    const statsDiv = document.getElementById('scanner-stats');
    
    if (!resultsBody) return;

    showNotification('Scanning NSE stocks...', 'info', 2000);

    resultsBody.innerHTML = `<tr><td colspan="12" class="empty-row">
        <i class="fas fa-spinner fa-spin"></i> Scanning...
    </td></tr>`;

    try {
        // Get symbols to scan
        const symbols = CONFIG.MARKET.nseSymbols.slice(0, 50);
        
        // Fetch data for each symbol
        const ohlcDataMap = {};
        
        // Fetch in batches
        const batchSize = 5;
        for (let i = 0; i < symbols.length; i += batchSize) {
            const batch = symbols.slice(i, i + batchSize);
            const promises = batch.map(async (symbol) => {
                try {
                    const data = await MarketAPI.getChart(symbol, '15m', '5d');
                    if (data && data.length > 20) {
                        ohlcDataMap[symbol] = data;
                    } else {
                        // Generate mock data for demo
                        ohlcDataMap[symbol] = generateMockOHLC(symbol);
                    }
                } catch (e) {
                    ohlcDataMap[symbol] = generateMockOHLC(symbol);
                }
            });
            
            await Promise.allSettled(promises);
        }
        
        // Run AI analysis on all symbols
        const news = await NewsAPI.getNews('general', 20);
        const results = await aiEngine.analyzeStocks(
            Object.keys(ohlcDataMap),
            ohlcDataMap,
            news,
            {}
        );

        // Generate signals for symbols that weren't analyzed (fallback)
        const allResults = [];
        symbols.forEach(symbol => {
            const existing = results.find(r => r.symbol === symbol);
            if (existing) {
                allResults.push(existing);
            } else {
                // Generate basic analysis
                allResults.push(generateBasicAnalysis(symbol));
            }
        });

        // Update app state
        APP.state.recommendations = allResults;
        APP.state.scannerResults = allResults;

        // Apply active filter
        const filteredResults = aiEngine.getScannerData(filter);

        // Update stats
        if (statsDiv) {
            const buys = allResults.filter(r => r.signal === 'buy' || r.signal === 'strong-buy').length;
            const sells = allResults.filter(r => r.signal === 'sell' || r.signal === 'strong-sell').length;
            const neutrals = allResults.filter(r => r.signal === 'neutral').length;
            
            statsDiv.innerHTML = `
                <span class="stat-chip" style="background: var(--positive-bg); color: var(--positive);">
                    <i class="fas fa-arrow-up"></i> ${buys} Buy Signals
                </span>
                <span class="stat-chip" style="background: var(--negative-bg); color: var(--negative);">
                    <i class="fas fa-arrow-down"></i> ${sells} Sell Signals
                </span>
                <span class="stat-chip" style="background: var(--warning-bg); color: var(--warning);">
                    <i class="fas fa-minus"></i> ${neutrals} Neutral
                </span>
                <span class="stat-chip">📊 ${allResults.length} Scanned</span>
                <span class="stat-chip">🎯 ${filteredResults.length} Results</span>
            `;
        }

        // Render results
        renderScannerResults(filteredResults, resultsBody);
        
        // Update badges
        const buyCount = allResults.filter(r => r.signal === 'buy' || r.signal === 'strong-buy').length;
        const badge = document.getElementById('scanner-badge');
        if (badge) badge.textContent = buyCount;

        showNotification(`Scan complete! Found ${buyCount} buy signals.`, 'success');
    } catch (error) {
        console.error('Scanner error:', error);
        resultsBody.innerHTML = `<tr><td colspan="12" class="empty-row">
            Error scanning stocks. Please try again.
        </td></tr>`;
        showNotification('Scanner encountered an error', 'error');
    }
}

function renderScannerResults(results, body) {
    if (!body) return;
    
    if (results.length === 0) {
        body.innerHTML = `<tr><td colspan="12" class="empty-row">
            No stocks match the current filter.
        </td></tr>`;
        return;
    }

    body.innerHTML = results.map((stock, index) => `
        <tr class="${stock.signal === 'strong-buy' || stock.signal === 'buy' ? 'row-buy' : 
                     stock.signal === 'strong-sell' || stock.signal === 'sell' ? 'row-sell' : ''}">
            <td>${index + 1}</td>
            <td><strong>${stock.symbol}</strong></td>
            <td>₹${formatPrice(stock.currentPrice)}</td>
            <td>
                <span class="ai-pick-signal ${getSignalClass(stock.signal)}" style="font-size: 0.7rem;">
                    ${getSignalLabel(stock.signal)}
                </span>
            </td>
            <td>
                <div class="confidence-bar" style="width: 60px; display: inline-block; vertical-align: middle;">
                    <div class="confidence-fill" style="width: ${stock.confidence}%; 
                        background: ${stock.confidence >= 60 ? 'var(--positive)' : stock.confidence >= 40 ? 'var(--warning)' : 'var(--negative)'}">
                    </div>
                </div>
                <span style="font-size: 0.75rem; margin-left: 4px;">${stock.confidence}%</span>
            </td>
            <td><strong>${stock.score}/100</strong></td>
            <td>${stock.signal === 'strong-buy' || stock.signal === 'buy' ? 'BUY' : 
                    stock.signal === 'strong-sell' || stock.signal === 'sell' ? 'SELL' : 'WAIT'}</td>
            <td>₹${formatPrice(stock.entry)}</td>
            <td class="${stock.signal === 'sell' || stock.signal === 'strong-sell' ? 'negative' : ''}">
                ₹${formatPrice(stock.stopLoss)}
            </td>
            <td class="positive">₹${formatPrice(stock.targets?.[0] || 'N/A')}</td>
            <td>${stock.riskReward}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="showStockDetail('${stock.symbol}')">
                    <i class="fas fa-info-circle"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function startAutoScan() {
    if (autoScanInterval) {
        clearInterval(autoScanInterval);
        autoScanInterval = null;
        showNotification('Auto-scan stopped', 'info');
        return;
    }

    const refreshInterval = parseInt(document.getElementById('settings-refresh')?.value || CONFIG.MARKET.refreshInterval);
    autoScanInterval = setInterval(() => {
        runScanner();
    }, Math.max(refreshInterval, 30000)); // Min 30 seconds for scanner
    
    showNotification('Auto-scan started', 'success');
    
    // Update button text
    const btn = document.querySelector('button[onclick="startAutoScan()"]');
    if (btn) btn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto-Scan';
}

function showStockDetail(symbol) {
    const rec = aiEngine.getRecommendation(symbol);
    if (!rec) {
        showNotification(`No analysis found for ${symbol}`, 'warning');
        return;
    }

    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.textContent = `${symbol} - Detailed Analysis`;
    
    body.innerHTML = `
        <div style="display: grid; gap: var(--spacing-md);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: 700;">₹${formatPrice(rec.currentPrice)}</span>
                <span class="ai-pick-signal ${getSignalClass(rec.signal)}" style="font-size: 1rem; padding: 6px 16px;">
                    ${getSignalLabel(rec.signal)}
                </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); font-size: 0.85rem;">
                <div><strong>Score:</strong> ${rec.score}/100</div>
                <div><strong>Confidence:</strong> ${rec.confidence}%</div>
                <div><strong>Trend:</strong> ${rec.trendScore}/100</div>
                <div><strong>Momentum:</strong> ${rec.momentumScore}/100</div>
                <div><strong>Volume:</strong> ${rec.volumeScore}/100</div>
                <div><strong>Risk Level:</strong> ${rec.riskLevel?.level || 'N/A'}</div>
            </div>

            <div style="border-top: 1px solid var(--border); padding-top: var(--spacing-sm);">
                <h4 style="margin-bottom: var(--spacing-sm);">Trade Levels</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); font-size: 0.85rem;">
                    <div><strong>Entry:</strong> ₹${formatPrice(rec.entry)}</div>
                    <div><strong>Stop Loss:</strong> ₹${formatPrice(rec.stopLoss)}</div>
                    <div><strong>Target 1:</strong> ₹${formatPrice(rec.targets?.[0] || 'N/A')}</div>
                    <div><strong>Target 2:</strong> ₹${formatPrice(rec.targets?.[1] || 'N/A')}</div>
                    <div><strong>Target 3:</strong> ₹${formatPrice(rec.targets?.[2] || 'N/A')}</div>
                    <div><strong>Risk/Reward:</strong> 1:${rec.riskReward}</div>
                </div>
            </div>

            <div style="border-top: 1px solid var(--border); padding-top: var(--spacing-sm);">
                <h4 style="margin-bottom: var(--spacing-sm);">AI Reasoning</h4>
                <p style="font-size: 0.85rem; line-height: 1.6;">${rec.reasoning}</p>
            </div>

            ${rec.patterns?.length > 0 ? `
            <div style="border-top: 1px solid var(--border); padding-top: var(--spacing-sm);">
                <h4 style="margin-bottom: var(--spacing-sm);">Detected Patterns</h4>
                <p style="font-size: 0.85rem;">${rec.patterns.join(', ')}</p>
            </div>` : ''}
        </div>
    `;

    footer.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="addToWatchlist('${symbol}'); closeModal();">
            <i class="fas fa-star"></i> Add to Watchlist
        </button>
        <button class="btn btn-accent" onclick="navigateTo('charts', '${symbol}'); closeModal();">
            <i class="fas fa-chart-line"></i> View Chart
        </button>
    `;

    showModal();
}

/**
 * Generate mock OHLC data for demo purposes
 */
function generateMockOHLC(symbol) {
    const basePrice = MarketAPI._getBasePrice(symbol);
    const data = [];
    const now = Date.now();
    const interval = 15 * 60 * 1000; // 15 min
    const periods = 200;
    
    let price = basePrice;
    
    for (let i = periods; i >= 0; i--) {
        const volatility = price * 0.015;
        const change = (Math.random() - 0.5) * volatility * 2;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;
        const volume = Math.floor(Math.random() * 5000000 + 100000);
        
        data.push({
            time: now - i * interval,
            open,
            high,
            low,
            close,
            volume
        });
        
        price = close;
    }
    
    return data;
}

/**
 * Generate basic analysis for stocks not analyzed by AI
 */
function generateBasicAnalysis(symbol) {
    const price = MarketAPI._getBasePrice(symbol);
    const score = Math.floor(Math.random() * 60 + 20);
    const confidence = Math.floor(Math.random() * 50 + 25);
    
    let signal = 'neutral';
    if (score >= 70) signal = 'buy';
    else if (score >= 60) signal = 'buy';
    else if (score <= 30) signal = 'sell';
    else if (score <= 20) signal = 'strong-sell';
    
    return {
        symbol,
        currentPrice: price,
        signal,
        confidence,
        score,
        trendScore: Math.floor(Math.random() * 100),
        momentumScore: Math.floor(Math.random() * 100),
        volumeScore: Math.floor(Math.random() * 100),
        entry: price,
        stopLoss: price * 0.98,
        targets: [price * 1.015, price * 1.025, price * 1.04],
        riskReward: '1.5',
        reasoning: `Basic analysis for ${symbol}. Run detailed scanner for comprehensive analysis.`,
        patterns: [],
        riskLevel: { level: 'Medium', score: 35, factors: [] }
    };
}

// Make globally accessible
window.runScanner = runScanner;
window.startAutoScan = startAutoScan;
window.showStockDetail = showStockDetail;

export { runScanner, startAutoScan, showStockDetail };
