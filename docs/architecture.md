# Architecture Documentation

## Overview

The AI Intraday Trading Platform is a client-side single-page application (SPA) that runs entirely in the browser. It uses vanilla JavaScript (ES6+ modules), CSS3 with custom properties, and HTML5 semantic elements.

## Design Principles

1. **Zero Server Dependencies**
   - No backend server required
   - All data fetched directly from free APIs
   - All processing done in the browser
   - Data persisted in localStorage

2. **Modular Architecture**
   - Separation of concerns
   - Loose coupling between modules
   - Export/Import pattern for clean interfaces
   - Singleton state management

3. **Progressive Enhancement**
   - Works with or without JavaScript modules
   - Graceful degradation for older browsers
   - Responsive design for all screen sizes
   - PWA support for offline capability

4. **Performance First**
   - Minimal DOM manipulation
   - Efficient caching strategies
   - Debounced search operations
   - Lazy loading of components
   - Optimized bundle size

## Directory Structure

```
src/
├── css/
│   ├── main.css              # Core styles & layout
│   ├── dark.css              # Dark theme variables
│   ├── light.css             # Light theme variables
│   └── responsive.css        # Media queries
├── js/
│   ├── app.js                # Application entry point
│   ├── config.js             # Global configuration
│   ├── api/
│   │   ├── market.js         # Yahoo Finance integration
│   │   ├── nse.js            # NSE India integration
│   │   └── news.js           # News aggregation
│   ├── analysis/
│   │   ├── technical.js      # Technical analysis engine
│   │   ├── sentiment.js      # Sentiment analysis
│   │   └── ai-engine.js      # AI decision engine
│   ├── components/
│   │   ├── dashboard.js      # Dashboard rendering
│   │   ├── scanner.js        # Stock scanner
│   │   ├── watchlist.js      # Watchlist management
│   │   ├── charts.js         # Chart component
│   │   ├── assistant.js      # AI assistant UI
│   │   └── risk-manager.js   # Risk calculator
│   ├── utils/
│   │   ├── helpers.js        # Utility functions
│   │   └── indicators.js     # Technical indicators library
│   │   └── storage.js        # localStorage management
│   └── ui/
│       ├── theme.js          # Theme management
│       ├── router.js         # SPA routing
│       └── notifications.js  # Toast notifications
└── assets/
    ├── icons/
    ├── images/
    └── fonts/
```

## Data Flow Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User Input  │────▶│  Router/Events   │────▶│  View Renders   │
└──────────────┘     └──────────────────┘     └─────────────────┘
                                                    │
                                                    ▼
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  AI Engine   │◀────│  Analysis Engine │◀────│  Data Fetchers  │
└──────────────┘     └──────────────────┘     └─────────────────┘
       │                      │                        │
       ▼                      ▼                        ▼
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Decision    │     │  Indicators      │     │  API Gateway    │
│  Confidence  │     │  Patterns        │     │  Cache Layer    │
│  Reasoning   │     │  Sentiment       │     │  Rate Limiter   │
└──────────────┘     └──────────────────┘     └─────────────────┘
```

## Component Communication

### Event-Based Architecture

```javascript
// Custom events for inter-component communication
document.addEventListener('viewChange', (e) => {
    // Notify components when view changes
});

document.addEventListener('dataUpdate', (e) => {
    // Notify components when market data updates
});

document.addEventListener('recommendationUpdate', (e) => {
    // Notify components of new AI recommendations
});
```

### State Management

```javascript
window.AI_TRADER = {
    state: {
        marketData: {},     // Current market data cache
        indices: {},        // Index values (Nifty, Sensex, etc.)
        recommendations: [], // AI-generated recommendations
        watchlists: {},     // User watchlists
        portfolio: {},     // User portfolio
        settings: {},      // User settings
        scannerResults: [], // Scanner results
        initialized: false  // App initialization status
    }
};
```

## Caching Strategy

### Memory Cache (API Responses)
- **TTL**: 60 seconds for quotes, 5 minutes for charts
- **Max Entries**: 100 items (LRU eviction)
- **Purpose**: Reduce API calls, improve performance

### localStorage (User Data)
- **Watchlists**: Persistent across sessions
- **Portfolio**: Trade journal and performance data
- **Settings**: Theme, capital, risk preferences
- **Favorites**: Quick-access stock list

## Technical Indicators Engine

The technical analysis engine implements 20+ indicators:

```
Trend Indicators
├── EMA (Exponential Moving Average)
├── SMA (Simple Moving Average)
├── Supertrend
├── ADX (Average Directional Index)
└── Ichimoku Cloud

Momentum Indicators
├── RSI (Relative Strength Index)
├── MACD (Moving Average Convergence Divergence)
├── ROC (Rate of Change)
├── Stochastic RSI
└── Momentum

Volume Indicators
├── OBV (On-Balance Volume)
├── VWAP (Volume Weighted Average Price)
├── MFI (Money Flow Index)
└── CMF (Chaikin Money Flow)

Volatility Indicators
├── ATR (Average True Range)
├── Bollinger Bands
└── Keltner Channels

Pattern Recognition
├── Doji, Hammer, Shooting Star
├── Engulfing, Harami
├── Morning Star, Evening Star
├── Marubozu
├── Inside Bar, Outside Bar
└── Spinning Top
```

## AI Decision Engine

### Scoring Weights

```javascript
const SCORE_WEIGHTS = {
    technicalScore:  0.50,  // Overall technical analysis
    trendScore:      0.15,  // EMA alignment, Supertrend
    momentumScore:   0.10,  // RSI, MACD, Stochastic
    volumeScore:     0.10,  // OBV, MFI, CMF
    sentimentScore:  0.15   // News analysis
};
```

### Confidence Modifiers

- **Signal strength**: +5 for strong signals
- **Convergence**: +3 per confirming factor
- **Trend alignment**: +5 when signal matches sentiment
- **Max confidence**: 100%

### Signal Classification

| Score Range | Signal | Action |
|-------------|--------|--------|
| 75-100 | Strong Buy | High confidence long |
| 60-74 | Buy | Moderate confidence long |
| 40-59 | Neutral | Wait / No action |
| 25-39 | Sell | Consider exiting |
| 0-24 | Strong Sell | High confidence short/exit |

## Performance Considerations

### Bundle Size
- Total CSS: ~25 KB (minified)
- Total JS: ~120 KB (minified)
- External CDN: Lightweight Charts (~50 KB)
- Icons: Font Awesome CDN

### Optimization Techniques
- Debounced input handlers (200ms)
- Throttled API calls (min 200ms between)
- Batched DOM updates
- CSS animations (GPU accelerated)
- Lazy-loaded views
- Efficient cache management

### Browser Memory
- Max cached entries: 100 API responses
- LocalStorage limit: ~5-10 MB
- Chart data points: ~500
- News items cached: 50

## Security Architecture

### No Server-Side Code
- All JavaScript executes client-side
- No database connections
- No authentication tokens
- No sensitive data storage

### Data Protection
- All data stored in browser localStorage
- No data transmitted to external servers (except API calls)
- API calls use HTTPS
- No cookies set by the application

### Risk Controls
- No automatic trade execution
- No financial advice disclaimer
- Confidence scores indicate uncertainty
- Clear communication of limitations

## Deployment Architecture

```
GitHub Repository
       │
       ▼
GitHub Actions (CI/CD)
       │
       ▼
GitHub Pages (CDN)
       │
       ▼
DNS → https://iammpq.github.io/Trading.github.io
       │
       ├── index.html (Entry point)
       ├── src/ (Static assets)
       └── manifest.json (PWA)
```

## Testing Strategy

### Manual Testing Checklist
- [ ] Dashboard loads with market data
- [ ] Scanner identifies stocks
- [ ] Charts render correctly
- [ ] Watchlist saves persistently
- [ ] Theme toggle works
- [ ] Mobile responsive layout
- [ ] AI assistant responds to queries
- [ ] Risk calculator functions

### Browser Testing
- Chrome, Firefox, Edge, Safari
- Mobile browsers (iOS Safari, Android Chrome)
- Tablet viewports

## Future Enhancements

1. **WebSocket Integration** for real-time streaming data
2. **IndexedDB** for larger local data storage
3. **Service Workers** for offline support
4. **Web Workers** for background computation
5. **Machine Learning models** for pattern recognition
6. **Export to CSV/Excel** for trade data
7. **Multi-language support** (Hindi, Tamil, etc.)
8. **Dark mode auto-switch** based on time
