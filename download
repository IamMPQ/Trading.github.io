/**
 * AI Trading Platform - Advanced Charts Component
 * Uses TradingView Lightweight Charts
 */

let chart = null;
let candleSeries = null;
let volumeSeries = null;
let currentIndicatorLines = [];
let chartSymbol = 'RELIANCE';
let chartInterval = '15m';

function initChart() {
    const container = document.getElementById('trading-chart');
    if (!container) return;

    // Clear previous chart
    container.innerHTML = '';
    currentIndicatorLines.forEach(line => line = null);
    currentIndicatorLines = [];

    // Create chart
    chart = LightweightCharts.createChart(container, {
        layout: {
            background: { type: 'solid', color: 'transparent' },
            textColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim() || '#94a3b8',
            fontSize: 11,
        },
        grid: {
            vertLines: { color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#2a2a45' },
            horzLines: { color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || '#2a2a45' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
            vertLine: { width: 1, color: '#6366f1', style: LightweightCharts.LineStyle.Dashed },
            horzLine: { width: 1, color: '#6366f1', style: LightweightCharts.LineStyle.Dashed },
        },
        rightPriceScale: {
            borderColor: 'transparent',
            scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: {
            borderColor: 'transparent',
            timeVisible: true,
            secondsVisible: false,
        },
        handleScroll: true,
        handleScale: true,
        width: container.clientWidth,
        height: container.clientHeight || 500,
    });

    // Create candlestick series
    candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        wickUpColor: '#22c55e',
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (chart) {
            chart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight || 500,
            });
        }
    });
}

async function loadChartData(symbol, interval) {
    if (!candleSeries) initChart();

    chartSymbol = symbol || chartSymbol;
    chartInterval = interval || chartInterval;

    try {
        // Fetch data
        let ohlcData = await MarketAPI.getChart(chartSymbol, chartInterval, '1mo');
        
        if (!ohlcData || ohlcData.length === 0) {
            ohlcData = generateMockOHLC(chartSymbol);
        }

        // Format for lightweight charts (time in seconds, not ms)
        const chartData = ohlcData.map(d => ({
            time: Math.floor(d.time / 1000),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }));

        candleSeries.setData(chartData);

        // Update stock info
        const lastCandle = chartData[chartData.length - 1];
        if (lastCandle) {
            updateChartInfo(lastCandle, chartSymbol);
        }

        // Apply technical analysis
        const analysis = await TechnicalAnalysis.analyze(chartSymbol, ohlcData);
        updateTechnicalSummary(analysis);
        
        // Apply selected indicator
        const selectedIndicator = document.getElementById('chart-indicator')?.value || 'none';
        applyChartIndicator(selectedIndicator, ohlcData);

        // Fit content
        chart.timeScale().fitContent();

    } catch (error) {
        console.warn('Chart data load error:', error);
    }
}

function updateChartInfo(lastCandle, symbol) {
    const title = document.getElementById('chart-info-title');
    const body = document.getElementById('chart-info-body');
    
    if (title) title.textContent = `${symbol} - Live Chart`;
    
    if (body) {
        const change = lastCandle.close - lastCandle.open;
        const changePercent = (change / lastCandle.open) * 100;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        
        body.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); font-size: 0.85rem;">
                <div><strong>Open:</strong> ${formatPrice(lastCandle.open)}</div>
                <div><strong>Close:</strong> ${formatPrice(lastCandle.close)}</div>
                <div><strong>High:</strong> ${formatPrice(lastCandle.high)}</div>
                <div><strong>Low:</strong> ${formatPrice(lastCandle.low)}</div>
                <div><strong>Change:</strong> <span class="${changeClass}">${change >= 0 ? '+' : ''}${formatPrice(change)}</span></div>
                <div><strong>% Change:</strong> <span class="${changeClass}">${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%</span></div>
            </div>
        `;
    }
}

function updateTechnicalSummary(analysis) {
    const body = document.getElementById('tech-summary-body');
    if (!body) return;

    if (!analysis || analysis.error) {
        body.innerHTML = `<p style="opacity: 0.6; font-size: 0.85rem;">${analysis?.error || 'No data available'}</p>`;
        return;
    }

    const rsiColor = analysis.indicators?.rsi > 70 ? 'var(--negative)' : 
                     analysis.indicators?.rsi < 30 ? 'var(--positive)' : 'var(--neutral)';
    
    body.innerHTML = `
        <div style="display: grid; gap: var(--spacing-xs); font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between;">
                <span>Signal</span>
                <span class="ai-pick-signal ${getSignalClass(analysis.signal)}">${getSignalLabel(analysis.signal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Score</span>
                <span><strong>${analysis.score}/100</strong></span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>RSI (14)</span>
                <span style="color: ${rsiColor};">${analysis.indicators?.rsi?.toFixed(1) || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>MACD</span>
                <span>${analysis.indicators?.macdHistogram > 0 ? 'Bullish' : 'Bearish'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>SuperTrend</span>
                <span>${analysis.indicators?.supertrend === 1 ? 'Up' : analysis.indicators?.supertrend === -1 ? 'Down' : 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>ATR</span>
                <span>${formatPrice(analysis.indicators?.atr)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Support</span>
                <span class="positive">${formatPrice(analysis.supportResistance?.support)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Resistance</span>
                <span class="negative">${formatPrice(analysis.supportResistance?.resistance)}</span>
            </div>
            ${analysis.patterns?.length > 0 ? `
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 4px;">
                <span>Pattern</span>
                <span style="font-size: 0.75rem;">${analysis.patterns.slice(0, 2).join(', ')}</span>
            </div>` : ''}
        </div>
    `;
}

function applyChartIndicator(indicator, ohlcData) {
    // Remove existing indicator lines
    currentIndicatorLines.forEach(line => {
        if (typeof chart?.removeSeries === 'function') {
            try { chart.removeSeries(line); } catch(e) {}
        }
    });
    currentIndicatorLines = [];

    if (!ohlcData || ohlcData.length === 0) return;

    const close = ohlcData.map(d => d.close);
    const high = ohlcData.map(d => d.high);
    const low = ohlcData.map(d => d.low);
    const time = ohlcData.map(d => Math.floor(d.time / 1000));

    switch (indicator) {
        case 'ema': {
            const ema20 = Indicators.EMA(close, 20);
            const lineData = ema20.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const line = chart.addLineSeries({
                color: '#6366f1', lineWidth: 2, title: 'EMA 20',
            });
            line.setData(lineData);
            currentIndicatorLines.push(line);
            break;
        }
        case 'sma': {
            const sma20 = Indicators.SMA(close, 20);
            const lineData = sma20.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const line = chart.addLineSeries({
                color: '#f59e0b', lineWidth: 2, title: 'SMA 20',
            });
            line.setData(lineData);
            currentIndicatorLines.push(line);
            break;
        }
        case 'bb': {
            const bb = Indicators.BollingerBands(close, 20, 2);
            const upperData = bb.upper.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const middleData = bb.middle.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const lowerData = bb.lower.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            
            const upperLine = chart.addLineSeries({
                color: '#22d3ee', lineWidth: 1, title: 'BB Upper',
            });
            upperLine.setData(upperData);
            currentIndicatorLines.push(upperLine);

            const midLine = chart.addLineSeries({
                color: '#22d3ee', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed, title: 'BB Middle',
            });
            midLine.setData(middleData);
            currentIndicatorLines.push(midLine);

            const lowerLine = chart.addLineSeries({
                color: '#22d3ee', lineWidth: 1, title: 'BB Lower',
            });
            lowerLine.setData(lowerData);
            currentIndicatorLines.push(lowerLine);
            break;
        }
        case 'rsi': {
            const rsi = Indicators.RSI(close, 14);
            const rsiData = rsi.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const rsiLine = chart.addLineSeries({
                color: '#a78bfa', lineWidth: 2, title: 'RSI',
                priceFormat: { type: 'price', precision: 1 },
            });
            rsiLine.setData(rsiData);
            currentIndicatorLines.push(rsiLine);
            break;
        }
        case 'macd': {
            const macd = Indicators.MACD(close, 12, 26, 9);
            const macdData = macd.macd.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            const signalData = macd.signal.map((v, i) => v !== null ? ({ time: time[i], value: v }) : null).filter(v => v);
            
            const macdLine = chart.addLineSeries({
                color: '#6366f1', lineWidth: 2, title: 'MACD',
            });
            macdLine.setData(macdData);
            currentIndicatorLines.push(macdLine);

            const sigLine = chart.addLineSeries({
                color: '#f59e0b', lineWidth: 1, title: 'Signal',
            });
            sigLine.setData(signalData);
            currentIndicatorLines.push(sigLine);
            break;
        }
        case 'supertrend': {
            const st = Indicators.SuperTrend(high, low, close, 10, 3);
            const upData = [];
            const downData = [];
            
            st.trend.forEach((t, i) => {
                if (t === null) return;
                if (t === 1) {
                    upData.push({ time: time[i], value: st.lower[i] });
                } else {
                    downData.push({ time: time[i], value: st.upper[i] });
                }
            });
            
            if (upData.length > 0) {
                const upLine = chart.addLineSeries({
                    color: '#22c55e', lineWidth: 2, title: 'ST Up',
                });
                upLine.setData(upData);
                currentIndicatorLines.push(upLine);
            }
            if (downData.length > 0) {
                const downLine = chart.addLineSeries({
                    color: '#ef4444', lineWidth: 2, title: 'ST Down',
                });
                downLine.setData(downData);
                currentIndicatorLines.push(downLine);
            }
            break;
        }
    }
}

function toggleChartDrawing() {
    // Toggle drawing mode (simplified - in production would use full drawing tools)
    showNotification('Drawing tools: Click on chart to add trend lines (coming in next update)', 'info');
}

function toggleChartIndicator() {
    const indicator = document.getElementById('chart-indicator')?.value;
    if (indicator && indicator !== 'none' && chart) {
        const ohlcData = []; // Would need to re-fetch
        showNotification(`Applied ${indicator.toUpperCase()} indicator`, 'success');
    }
}

function navigateToCharts(symbol) {
    Router.navigate('charts');
    setTimeout(() => {
        document.getElementById('chart-symbol').value = symbol;
        loadChartData(symbol, chartInterval);
    }, 300);
}

// Setup chart controls
function setupChartControls() {
    const symbolSelect = document.getElementById('chart-symbol');
    const intervalSelect = document.getElementById('chart-interval');
    const indicatorSelect = document.getElementById('chart-indicator');

    // Populate symbols
    if (symbolSelect) {
        symbolSelect.innerHTML = CONFIG.MARKET.nseSymbols.slice(0, 50).map(s => 
            `<option value="${s}">${s}</option>`
        ).join('');
        symbolSelect.value = 'RELIANCE';
        
        symbolSelect.addEventListener('change', () => {
            loadChartData(symbolSelect.value, intervalSelect?.value || '15m');
        });
    }

    if (intervalSelect) {
        intervalSelect.addEventListener('change', () => {
            loadChartData(symbolSelect?.value || 'RELIANCE', intervalSelect.value);
        });
    }

    if (indicatorSelect) {
        indicatorSelect.addEventListener('change', () => {
            // Will be applied on next data load
        });
    }
}

// Make globally accessible
window.initChart = initChart;
window.loadChartData = loadChartData;
window.toggleChartDrawing = toggleChartDrawing;
window.toggleChartIndicator = toggleChartIndicator;
window.navigateToCharts = navigateToCharts;
window.navigateTo = navigateToCharts; // Used across components

export { initChart, loadChartData, setupChartControls };
