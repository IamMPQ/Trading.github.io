/**
 * AI Trading Platform - NSE Specific API
 * Fetches data from NSE India website
 */

const NSEAPI = {
    _headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
    },
    _cookies: '',
    _sessionInitialized: false,

    /**
     * Initialize session with NSE (get cookies)
     */
    async _initSession() {
        if (this._sessionInitialized) return true;
        
        try {
            const resp = await fetch('https://www.nseindia.com', {
                headers: this._headers
            });
            
            if (resp.ok) {
                const setCookie = resp.headers.get('set-cookie');
                if (setCookie) {
                    this._cookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
                }
                this._sessionInitialized = true;
                return true;
            }
        } catch (e) {
            console.warn('NSE session init failed:', e);
        }
        return false;
    },

    /**
     * Fetch from NSE API
     */
    async _fetchNSE(endpoint) {
        await this._initSession();
        
        try {
            const resp = await fetch(`https://www.nseindia.com${endpoint}`, {
                headers: {
                    ...this._headers,
                    'Cookie': this._cookies
                }
            });
            
            if (resp.ok) {
                return await resp.json();
            }
            
            // Retry with fresh session
            this._sessionInitialized = false;
            await this._initSession();
            
            const retryResp = await fetch(`https://www.nseindia.com${endpoint}`, {
                headers: {
                    ...this._headers,
                    'Cookie': this._cookies
                }
            });
            
            if (retryResp.ok) {
                return await retryResp.json();
            }
            
            throw new Error(`NSE API returned ${resp.status}`);
        } catch (error) {
            console.warn(`NSE API error for ${endpoint}:`, error);
            return null;
        }
    },

    /**
     * Get quote for an equity
     */
    async getQuote(symbol) {
        try {
            const data = await this._fetchNSE(`/api/quote-equity?symbol=${encodeURIComponent(symbol)}`);
            if (!data) return null;
            
            const priceInfo = data.priceInfo || {};
            return {
                symbol: symbol,
                price: priceInfo.lastPrice || 0,
                change: priceInfo.change || 0,
                changePercent: priceInfo.pChange || 0,
                open: priceInfo.open || 0,
                high: priceInfo.intraDayHighLow?.max || priceInfo.dayHigh || 0,
                low: priceInfo.intraDayHighLow?.min || priceInfo.dayLow || 0,
                previousClose: priceInfo.previousClose || 0,
                volume: priceInfo.totalTradedVolume || 0,
                value: priceInfo.totalTradedValue || 0,
                weekHigh52: priceInfo.weekHighLow?.max || priceInfo.weekHigh52 || 0,
                weekLow52: priceInfo.weekHighLow?.min || priceInfo.weekLow52 || 0,
                vwap: priceInfo.avgPrice || 0,
                deliveryPercentage: priceInfo.deliveryPercentage || 0,
                marketCap: priceInfo.marketCap || 0,
                timestamp: Date.now()
            };
        } catch (error) {
            console.warn(`NSE quote failed for ${symbol}:`, error);
            return null;
        }
    },

    /**
     * Get all indices
     */
    async getAllIndices() {
        try {
            const data = await this._fetchNSE('/api/allIndices');
            if (!data || !data.data) return [];
            
            return data.data.map(index => ({
                symbol: index.index,
                name: index.indexSymbol || index.index,
                price: index.last || 0,
                change: index.change || 0,
                changePercent: index.pChange || 0,
                open: index.open || 0,
                high: index.dayHigh || 0,
                low: index.dayLow || 0,
                previousClose: index.previousClose || 0
            }));
        } catch (error) {
            console.warn('NSE indices fetch failed:', error);
            return [];
        }
    },

    /**
     * Get market status
     */
    async getMarketStatus() {
        try {
            const data = await this._fetchNSE('/api/marketStatus');
            return data;
        } catch {
            return { marketState: 'UNKNOWN' };
        }
    },

    /**
     * Get top gainers
     */
    async getTopGainers() {
        try {
            const data = await this._fetchNSE('/api/liveAnalysis?type=gainers');
            return data?.data || [];
        } catch {
            return [];
        }
    },

    /**
     * Get top losers
     */
    async getTopLosers() {
        try {
            const data = await this._fetchNSE('/api/liveAnalysis?type=losers');
            return data?.data || [];
        } catch {
            return [];
        }
    },

    /**
     * Get most active stocks
     */
    async getMostActive() {
        try {
            const data = await this._fetchNSE('/api/liveAnalysis?type=mostActive');
            return data?.data || [];
        } catch {
            return [];
        }
    },

    /**
     * Fetch corporate announcements
     */
    async getCorporateAnnouncements(symbol = '') {
        try {
            const endpoint = symbol 
                ? `/api/corporate-announcements?symbol=${encodeURIComponent(symbol)}`
                : '/api/corporate-announcements';
            const data = await this._fetchNSE(endpoint);
            return data || [];
        } catch {
            return [];
        }
    },

    /**
     * Fetch block/bulk deals
     */
    async getBlockDeals() {
        try {
            const data = await this._fetchNSE('/api/block-deals');
            return data || [];
        } catch {
            return [];
        }
    },

    /**
     * Fetch FII/DII data (mock backup)
     */
    getFIIData() {
        // NSE provides this data; for demo we return mock
        return {
            fii: {
                buy: Math.random() * 5000 + 2000,
                sell: Math.random() * 5000 + 2000,
                net: (Math.random() - 0.5) * 1000
            },
            dii: {
                buy: Math.random() * 5000 + 2000,
                sell: Math.random() * 5000 + 2000,
                net: (Math.random() - 0.5) * 1000
            },
            date: new Date().toISOString().split('T')[0]
        };
    }
};

export default NSEAPI;
