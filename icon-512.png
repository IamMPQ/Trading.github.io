# API Integration Guide

This document describes how the AI Intraday Trading Platform integrates with external APIs for market data.

## Overview

The platform uses a multi-source approach to fetch market data:
1. **Yahoo Finance** - Primary source for real-time quotes and charts
2. **NSE India** - Secondary source for Indian market data
3. **RSS Feeds** - News aggregation from financial sources
4. **MarketAux** - News API (optional, requires API key)

## Yahoo Finance API

### Endpoints Used

```javascript
// Get chart data
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}
  ?interval={1m|5m|15m|30m|60m|1d|1w}
  &range={1d|5d|1mo|3mo|6mo|1y|2y|5y|max}

// Get quote data
GET https://query1.finance.yahoo.com/v7/finance/quote
  ?symbols={symbol1},{symbol2}
  &modules=price,summaryDetail

// Search stocks
GET https://query1.finance.yahoo.com/v1/finance/search
  ?q={query}
  &quotesCount=10
```

### Symbol Format
- **NSE**: `RELIANCE.NS`, `TCS.NS`, `HDFCBANK.NS`
- **BSE**: `RELIANCE.BO`, `TCS.BO`
- **Indices**: `^NSEI`, `^BSESN`, `^NSEBANK`, `^INDIAVIX`

### Rate Limits
- Approximately 500 requests per minute
- No API key required for basic usage
- CORS enabled for browser requests

## NSE India API

### Endpoints Used

```javascript
// Get equity quote
GET https://www.nseindia.com/api/quote-equity?symbol={SYMBOL}

// Get all indices
GET https://www.nseindia.com/api/allIndices

// Get market status
GET https://www.nseindia.com/api/marketStatus

// Get top gainers/losers
GET https://www.nseindia.com/api/liveAnalysis?type={gainers|losers|mostActive}
```

### Requirements
- Session cookies required (handled automatically)
- User-Agent header must be set
- Referer header must be set to nseindia.com

## News APIs

### RSS Feeds (Default)
```javascript
// Moneycontrol Business News
GET https://api.rss2json.com/v1/api.json
  ?rss_url=https://www.moneycontrol.com/rss/business.xml

// Economic Times Markets
GET https://api.rss2json.com/v1/api.json
  ?rss_url=https://economictimes.indiatimes.com/markets/rssfeeds/1977021501
```

### MarketAux API (Optional)
```javascript
// Get news for symbols
GET https://api.marketaux.com/v1/news/all
  ?symbols=RELIANCE,TCS,HDFCBANK
  &filter_entities=true
  &language=en
  &api_token={YOUR_API_KEY}
```

## Data Flow

```
Browser Request
      ↓
JavaScript (fetch API)
      ↓
┌─────────────────────────────────┐
│         API Gateway             │
├─────────────────────────────────┤
│ Yahoo Finance ←→ NSE India     │
│ RSS Feeds    ←→ MarketAux       │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│      Data Processing            │
├─────────────────────────────────┤
│ Cache Layer (60s TTL)           │
│ Rate Limiter (200ms delay)      │
│ Fallback (mock data)            │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│    Analysis Engine              │
├─────────────────────────────────┤
│ Technical Indicators            │
│ Sentiment Analysis              │
│ AI Decision Engine              │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│      User Interface             │
├─────────────────────────────────┤
│ Dashboard | Scanner | Charts    │
│ Watchlist | Assistant            │
└─────────────────────────────────┘
```

## Caching Strategy

```javascript
// Cache configuration
const cacheConfig = {
    quoteCache: { ttl: 60000 },    // 1 minute
    chartCache: { ttl: 300000 },   // 5 minutes
    newsCache:  { ttl: 300000 },   // 5 minutes
    maxEntries: 100
};
```

## Error Handling

```javascript
// Fallback chain
async function getMarketData(symbol) {
    try {
        // 1. Try Yahoo Finance
        return await fetchYahooFinance(symbol);
    } catch (error) {
        try {
            // 2. Try NSE India
            return await fetchNSEIndia(symbol);
        } catch (error) {
            // 3. Generate mock data
            return generateMockData(symbol);
        }
    }
}
```

## Rate Limiting

```javascript
// Built-in rate limiter
const rateLimiter = {
    requestsPerMinute: 60,
    lastRequestTime: 0,
    minDelay: 200, // ms between requests
    
    async throttle() {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        if (elapsed < this.minDelay) {
            await sleep(this.minDelay - elapsed);
        }
        this.lastRequestTime = Date.now();
    }
};
```

## Security

- All API requests are made client-side (no server)
- No API keys stored in code (user can add their own)
- CORS is handled by the APIs (no proxy needed)
- HTTPS enforced for all API calls
- No authentication tokens exposed

## Troubleshooting API Issues

### Common Problems

1. **CORS Errors**
   - Yahoo Finance allows browser requests
   - NSE India may block some browsers
   - Try using a different browser

2. **Rate Limiting**
   - Wait 1-2 minutes between requests
   - Reduce refresh interval in settings
   - The app handles this automatically

3. **Empty Data**
   - Stock may be delisted or suspended
   - Check symbol spelling
   - Try a different time interval

4. **Mixed Content**
   - Ensure you're using HTTPS
   - GitHub Pages enforces HTTPS automatically

## Extending with New APIs

To add a new data source:

1. Create a new file in `src/js/api/`
2. Implement the fetch functions
3. Add error handling with fallbacks
4. Register the new source in `config.js`
5. Update the data flow in appropriate components

Example:
```javascript
// src/js/api/myapi.js
export const MyAPI = {
    async getQuote(symbol) {
        // Implementation
    }
};
```
