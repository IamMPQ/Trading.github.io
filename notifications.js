/**
 * AI Trading Platform - Market Data API
 * Fetches live market data from Yahoo Finance and NSE
 */

const MarketAPI = {
    _cache: {},
    _cacheTimeout: 60000, // 1 minute
    _requestCount: 0,
    _lastRequestTime: 0,
    _rateLimitDelay: 200, // ms between requests

    /**
     * Rate-limited fetch wrapper
     */
    async _rateLimitedFetch(url) {
        const now = Date.now();
        const timeSinceLastRequest = now - this._lastRequestTime;
        if (timeSinceLastRequest < this._rateLimitDelay) {
            await sleep(this._rateLimitDelay - timeSinceLastRequest);
        }
        this._lastRequestTime = Date.now();
        this._requestCount++;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn('API request failed:', error);
            throw error;
        }
    },

    /**
     * Get cache key
     */
    _getCacheKey(endpoint, params) {
        return `${endpoint}:${JSON.stringify(params)}`;
    },

    /**
     * Get from cache if valid
     */
    _getFromCache(key) {
        const cached = this._cache[key];
        if (cached && (Date.now() - cached.timestamp) < this._cacheTimeout) {
            return cached.data;
        }
        return null;
    },

    /**
     * Set cache
     */
    _setCache(key, data) {
        this._cache[key] = { data, timestamp: Date.now() };
        // Clean old cache entries
        if (Object.keys(this._cache).length > 100) {
            const oldest = Object.entries(this._cache)
                .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0];
            delete this._cache[oldest[0]];
        }
    },

    /**
     * Fetch stock quote from Yahoo Finance
     */
    async getQuote(symbol) {
        const yahooSymbol = symbol.includes('.') ? symbol : symbol + '.NS';
        const cacheKey = this._getCacheKey('quote', yahooSymbol);
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            const url = `${CONFIG.API.yahoo.quote}/${yahooSymbol}?modules=price,summaryDetail`;
            const data = await this._rateLimitedFetch(url);
            
            const result = data.quoteResponse?.result?.[0];
            if (!result) throw new Error('No data');
            
            const quote = {
                symbol: symbol,
                price: result.regularMarketPrice || 0,
                change: result.regularMarketChange || 0,
                changePercent: result.regularMarketChangePercent || 0,
                open: result.regularMarketOpen || 0,
                high: result.regularMarketDayHigh || 0,
                low: result.regularMarketDayLow || 0,
                volume: result.regularMarketVolume || 0,
                previousClose: result.regularMarketPreviousClose || 0,
                marketCap: result.marketCap || 0,
                timestamp: Date.now()
            };
            
            this._setCache(cacheKey, quote);
            return quote;
        } catch (error) {
            console.warn(`Failed to fetch quote for ${symbol}:`, error);
            return null;
        }
    },

    /**
     * Fetch chart/historical data from Yahoo Finance
     */
    async getChart(symbol, interval = '5m', range = '1mo') {
        const yahooSymbol = symbol.includes('.') ? symbol : symbol + '.NS';
        const cacheKey = this._getCacheKey('chart', `${yahooSymbol}:${interval}:${range}`);
        const cached = this._getFromCache(cacheKey);
        if (cached) return cached;
        
        try {
            const url = `${CONFIG.API.yahoo.base}/${yahooSymbol}?interval=${interval}&range=${range}`;
            const data = await this._rateLimitedFetch(url);
            
            const result = data.chart?.result?.[0];
            if (!result) throw new Error('No chart data');
            
            const timestamps = result.timestamp || [];
            const quote = result.indicators?.quote?.[0] || {};
            const adjclose = result.indicators?.adjclose?.[0]?.adjclose || [];
            
            const ohlc = timestamps.map((t, i) => ({
                time: t * 1000,
                open: quote.open?.[i] || 0,
                high: quote.high?.[i] || 0,
                low: quote.low?.[i] || 0,
                close: quote.close?.[i] || 0,
                volume: quote.volume?.[i] || 0
            })).filter(d => d.close > 0);
            
            this._setCache(cacheKey, ohlc);
            return ohlc;
        } catch (error) {
            console.warn(`Failed to fetch chart for ${symbol}:`, error);
            return [];
        }
    },

    /**
     * Fetch multiple quotes at once
     */
    async getQuotes(symbols) {
        if (!symbols || symbols.length === 0) return [];
        
        // Batch in groups of 5 to avoid rate limits
        const results = [];
        const batches = [];
        for (let i = 0; i < symbols.length; i += 5) {
            batches.push(symbols.slice(i, i + 5));
        }
        
        for (const batch of batches) {
            const promises = batch.map(s => this.getQuote(s));
            const batchResults = await Promise.allSettled(promises);
            batchResults.forEach(r => {
                if (r.status === 'fulfilled' && r.value) {
                    results.push(r.value);
                }
            });
            if (batches.length > 1) await sleep(500);
        }
        
        return results;
    },

    /**
     * Fetch index data
     */
    async getIndexData(symbol) {
        const yahooSymbols = {
            '^NSEI': '^NSEI',
            '^BSESN': '^BSESN',
            '^NSEBANK': '^NSEBANK',
            '^INDIAVIX': '^INDIAVIX',
            '^CNXFINANCE': '^CNXFINANCE',
            '^CNXIT': '^CNXIT'
        };
        
        const ys = yahooSymbols[symbol] || symbol;
        return await this.getChart(ys, '5m', '5d');
    },

    /**
     * Fetch real-time index values
     */
    async getIndexQuote(symbol) {
        const yahooSymbols = {
            '^NSEI': '^NSEI',
            '^BSESN': '^BSESN',
            '^NSEBANK': '^NSEBANK',
            '^INDIAVIX': '^INDIAVIX'
        };
        
        const ys = yahooSymbols[symbol] || symbol;
        
        try {
            const url = `${CONFIG.API.yahoo.quote}/${ys}?modules=price`;
            const data = await this._rateLimitedFetch(url);
            const result = data.quoteResponse?.result?.[0];
            
            if (!result) return null;
            
            return {
                symbol,
                price: result.regularMarketPrice || 0,
                change: result.regularMarketChange || 0,
                changePercent: result.regularMarketChangePercent || 0,
                open: result.regularMarketOpen || 0,
                high: result.regularMarketDayHigh || 0,
                low: result.regularMarketDayLow || 0,
                volume: result.regularMarketVolume || 0,
                previousClose: result.regularMarketPreviousClose || 0
            };
        } catch (error) {
            console.warn(`Failed to fetch index ${symbol}:`, error);
            return null;
        }
    },

    /**
     * Search stocks
     */
    async searchStocks(query) {
        if (!query || query.length < 1) return [];
        
        try {
            const url = `${CONFIG.API.yahoo.search}?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
            const data = await this._rateLimitedFetch(url);
            
            return (data.quotes || [])
                .filter(q => q.symbol && (q.symbol.endsWith('.NS') || q.exchange === 'NSI'))
                .map(q => ({
                    symbol: q.symbol.replace('.NS', ''),
                    name: q.longname || q.shortname || q.symbol,
                    exchange: 'NSE',
                    type: q.quoteType || 'EQUITY'
                }));
        } catch (error) {
            console.warn('Search failed:', error);
            return [];
        }
    },

    /**
     * Generate mock data when API is unavailable (for demo)
     */
    generateMockData(symbol) {
        const basePrice = this._getBasePrice(symbol);
        const change = (Math.random() - 0.5) * basePrice * 0.04;
        const changePercent = (change / basePrice) * 100;
        
        return {
            symbol,
            price: basePrice + change,
            change,
            changePercent,
            open: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
            high: basePrice + Math.abs(change) + Math.random() * basePrice * 0.02,
            low: basePrice - Math.abs(change) - Math.random() * basePrice * 0.02,
            volume: Math.floor(Math.random() * 5000000) + 100000,
            previousClose: basePrice,
            marketCap: basePrice * (Math.floor(Math.random() * 1000) + 100) * 100000,
            timestamp: Date.now(),
            _mock: true
        };
    },

    /**
     * Base prices for mock data
     */
    _getBasePrice(symbol) {
        const prices = {
            'RELIANCE': 2540, 'TCS': 3890, 'HDFCBANK': 1620, 'INFY': 1450,
            'ICICIBANK': 1080, 'HINDUNILVR': 2420, 'ITC': 430, 'SBIN': 780,
            'BHARTIARTL': 1240, 'KOTAKBANK': 1760, 'BAJFINANCE': 6820,
            'LT': 3560, 'WIPRO': 480, 'AXISBANK': 1080, 'TITAN': 3450,
            'ADANIENT': 3120, 'ASIANPAINT': 2900, 'NTPC': 340, 'MARUTI': 10800,
            'SUNPHARMA': 1520, 'TATAMOTORS': 980, 'POWERGRID': 280,
            'ULTRACEMCO': 10100, 'HCLTECH': 1420, 'BAJAJFINSV': 1620,
            'ADANIPORTS': 1320, 'TATASTEEL': 148, 'JSWSTEEL': 880,
            'TECHM': 1250, 'HINDALCO': 620, '^NSEI': 22200, '^BSESN': 73200,
            '^NSEBANK': 46800, '^INDIAVIX': 14.5
        };
        return prices[symbol] || (Math.random() * 1000 + 100);
    },

    /**
     * Get NSE indices list from config
     */
    getNSEIndices() {
        return Object.entries(CONFIG.MARKET.indices).map(([symbol, info]) => ({
            symbol,
            ...info
        }));
    },

    /**
     * Fetch India VIX
     */
    async getIndiaVIX() {
        try {
            const data = await this.getIndexQuote('^INDIAVIX');
            return data;
        } catch {
            return { symbol: '^INDIAVIX', price: 14.5, change: 0, changePercent: 0 };
        }
    },

    /**
     * Fetch all indices at once
     */
    async getAllIndices() {
        const symbols = Object.keys(CONFIG.MARKET.indices);
        const promises = symbols.map(s => this.getIndexQuote(s));
        const results = await Promise.allSettled(promises);
        
        const indices = {};
        results.forEach((r, i) => {
            if (r.status === 'fulfilled' && r.value) {
                indices[symbols[i]] = r.value;
            }
        });
        
        return indices;
    }
};

export default MarketAPI;
