# 🤖 AI Intraday Trading Platform

**AI-powered analysis for Indian stock market intraday trading**

[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)](https://iammpq.github.io/Trading.github.io)
[![Version](https://img.shields.io/badge/version-2.0.0-green)](https://github.com/IamMPQ/Trading.github.io)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## ⚠️ Disclaimer

> **This is an AI-powered decision support tool ONLY.**
> - It does **NOT** execute trades automatically
> - All trades must be placed manually through your broker (e.g., Groww, Zerodha)
> - Past performance does not guarantee future results
> - Trading in stock markets carries inherent financial risk
> - Always do your own research before making trading decisions

---

## 🚀 Features

### 📊 Live Market Dashboard
- Real-time Nifty 50, Sensex, Bank Nifty, and India VIX tracking
- Market heatmap with sector performance
- Top gainers, losers, and most active stocks
- Market breadth analysis
- AI-powered stock picks

### 🔍 AI Stock Scanner
- Continuous scanning of all NSE stocks
- Intelligent ranking based on multiple factors
- Filter by: Buy, Sell, Breakout, Momentum, Reversal, High Volume
- Real-time signal detection

### 📈 Professional Charts
- Interactive candlestick charts (TradingView Lightweight Charts)
- Multiple timeframes (1m, 5m, 15m, 30m, 1H, Daily, Weekly)
- Technical indicators: EMA, SMA, Bollinger Bands, RSI, MACD, Supertrend
- Support and resistance levels
- Stock information panel

### 🧠 AI Decision Engine
- Combines technical analysis, sentiment analysis, and market data
- Generates confidence scores (0-100%)
- Provides detailed reasoning for every recommendation
- Answers natural language queries about stocks

### 🎯 Trade Recommendations
- Entry price, stop loss, and multiple targets
- Risk/reward ratio calculation
- Confidence and probability estimates
- Expected volatility assessment
- Continuous updates based on market conditions

### ⭐ Watchlist Management
- Create multiple watchlists
- Real-time price monitoring
- AI-powered alerts
- Quick add/remove functionality

### 📋 Portfolio & Journal
- Track your trades
- Performance statistics
- Win rate calculation
- Export your portfolio data

### 🛡️ Risk Manager
- Position size calculator
- Risk/reward analysis
- Capital allocation
- Daily loss limits
- Risk alerts and rules

### 💬 AI Assistant
- Natural language queries
- Stock analysis requests
- Market sentiment assessment
- Risk management advice
- Quick suggestion chips

---

## 🏗️ Architecture

```
Trading.github.io/
├── index.html              # Main application entry point
├── manifest.json           # PWA manifest
├── README.md              # This file
├── docs/
│   ├── setup.md           # Setup guide
│   ├── api-guide.md       # API integration guide
│   └── architecture.md    # Architecture documentation
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions for deployment
├── data/
│   └── symbols.json       # Stock symbols database
├── src/
│   ├── css/
│   │   ├── main.css       # Core styles
│   │   ├── dark.css       # Dark theme
│   │   ├── light.css      # Light theme
│   │   └── responsive.css # Responsive design
│   ├── js/
│   │   ├── app.js         # Main application
│   │   ├── config.js      # Configuration
│   │   ├── api/
│   │   │   ├── market.js  # Market data API
│   │   │   ├── nse.js     # NSE-specific API
│   │   │   └── news.js    # News API
│   │   ├── analysis/
│   │   │   ├── technical.js   # Technical indicators
│   │   │   ├── sentiment.js   # Sentiment analysis
│   │   │   └── ai-engine.js   # AI decision engine
│   │   ├── components/
│   │   │   ├── dashboard.js   # Dashboard component
│   │   │   ├── scanner.js     # Stock scanner
│   │   │   ├── watchlist.js   # Watchlist management
│   │   │   ├── charts.js      # Chart component
│   │   │   ├── assistant.js   # AI assistant
│   │   │   └── risk-manager.js # Risk management
│   │   ├── utils/
│   │   │   ├── helpers.js     # Utility functions
│   │   │   └── indicators.js  # Technical indicators library
│   │   │   └── storage.js     # Local storage manager
│   │   └── ui/
│   │       ├── theme.js       # Theme manager
│   │       ├── router.js      # SPA router
│   │       └── notifications.js # Notification system
│   └── assets/
│       ├── icons/
│       ├── images/
│       └── fonts/
└── _config.yml            # GitHub Pages config
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure & semantics |
| **CSS3** | Styling with CSS custom properties |
| **JavaScript ES6+** | Core application logic |
| **Lightweight Charts** | Professional interactive charts |
| **Font Awesome** | Icon library |
| **Google Fonts (Inter)** | Typography |
| **GitHub Pages** | Hosting & deployment |
| **Yahoo Finance API** | Market data |
| **NSE India API** | Indian market data |
| **Local Storage** | User data persistence |

---

## 🔧 Setup & Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server required - runs entirely in the browser

### Option 1: Direct Usage
1. Visit: `https://iammpq.github.io/Trading.github.io`
2. The application loads automatically

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/IamMPQ/Trading.github.io.git

# Navigate to project directory
cd Trading.github.io

# Open in browser (no build step required)
open index.html
# OR
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Option 3: Deploy to GitHub Pages
1. Fork the repository
2. Go to Settings → Pages
3. Select `main` branch and `/` (root) folder
4. Click Save
5. Your site will be available at `https://[username].github.io/Trading.github.io`

---

## 📡 API Integration

The platform uses multiple free APIs for market data:

| API | Data Provided | Rate Limits |
|-----|--------------|-------------|
| **Yahoo Finance** | Real-time quotes, charts, historical data | ~500 req/min |
| **NSE India** | Indices, gainers/losers, announcements | ~100 req/min |
| **MarketAux** (optional) | Financial news | 100 req/day (free) |

### API Configuration
1. Open the Settings panel
2. Enter your API keys (if applicable)
3. Configure refresh intervals

---

## 🎯 Usage Guide

### Quick Start
1. **Dashboard**: View market overview, indices, and AI picks
2. **Scanner**: Click "Scan Now" to analyze NSE stocks
3. **Watchlist**: Add stocks to monitor in real-time
4. **Charts**: Select a stock and timeframe for detailed analysis
5. **AI Assistant**: Ask questions about stocks and market

### Trading Workflow
1. Run the **Stock Scanner** to find opportunities
2. Review **AI Recommendations** with confidence scores
3. Check the **Chart** for technical confirmation
4. Ask the **AI Assistant** for additional insights
5. Use the **Risk Manager** to calculate position size
6. **Manually place the trade** on your broker platform
7. Log the trade in your **Portfolio Journal**

---

## 🧪 AI Analysis Components

### Technical Indicators
- **Trend**: EMA (9, 20, 50, 100, 200), SMA, Supertrend, ADX, Ichimoku Cloud
- **Momentum**: RSI, MACD, ROC, Stochastic RSI
- **Volume**: OBV, VWAP, Money Flow Index, CMF
- **Volatility**: ATR, Bollinger Bands, Keltner Channels
- **Patterns**: Doji, Hammer, Engulfing, Morning/Evening Star, Harami, Marubozu, Inside/Outside Bar

### Scoring System
- **Technical Score** (50%): Composite of all technical indicators
- **Trend Score** (15%): EMA alignment, Supertrend, ADX
- **Momentum Score** (10%): RSI, MACD, Stochastic
- **Volume Score** (10%): OBV, MFI, CMF
- **Sentiment Score** (15%): News analysis, market sentiment

---

## 📱 Responsive Design

- **Desktop**: Full sidebar with detailed views
- **Tablet**: Collapsed sidebar, optimized grid
- **Mobile**: Hamburger menu, single column layout
- **Dark/Light Mode**: Toggle via button or settings

---

## 🔒 Security

- No automatic trade execution
- No server-side code execution
- Data stored locally in browser
- No personal information collected
- HTTPS enforced via GitHub Pages

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact

- **Author**: IamMPQ
- **Repository**: [https://github.com/IamMPQ/Trading.github.io](https://github.com/IamMPQ/Trading.github.io)
- **Issues**: [https://github.com/IamMPQ/Trading.github.io/issues](https://github.com/IamMPQ/Trading.github.io/issues)

---

## ⭐ Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 📤 Sharing with fellow traders
- 🐛 Reporting issues
- 💡 Suggesting features

---

*Happy Trading! 📈*
