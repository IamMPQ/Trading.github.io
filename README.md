/**
 * AI Trading Platform - Configuration
 * Central configuration for all API endpoints, settings, and defaults
 */
const CONFIG = {
    APP: {
        name: 'AI Intraday Trading',
        version: '2.0.0',
        repo: 'https://github.com/IamMPQ/Trading.github.io',
        author: 'IamMPQ'
    },

    API: {
        // Yahoo Finance (free, works from browser)
        yahoo: {
            base: 'https://query1.finance.yahoo.com/v8/finance/chart',
            quote: 'https://query1.finance.yahoo.com/v7/finance/quote',
            search: 'https://query1.finance.yahoo.com/v1/finance/search',
            indicators: 'https://query1.finance.yahoo.com/v8/finance/chart'
        },
        // NSE India (free)
        nse: {
            quote: 'https://www.nseindia.com/api/quote-equity',
            indices: 'https://www.nseindia.com/api/allIndices',
            marketStatus: 'https://www.nseindia.com/api/marketStatus',
            // Using CORS proxy may be needed
            proxy: 'https://api.allorigins.win/raw?url='
        },
        // News API (free tier)
        news: {
            base: 'https://newsapi.org/v2',
            // Free API key - user should replace with theirs
            key: 'demo'
        },
        // Twelve Data (free tier - 800 requests/day)
        twelvedata: {
            base: 'https://api.twelvedata.com',
            key: 'demo'
        },
        // Market auxiliary data
        marketaux: {
            base: 'https://api.marketaux.com/v1',
            key: 'demo'
        }
    },

    MARKET: {
        indices: {
            '^NSEI': { name: 'Nifty 50', short: 'NIFTY' },
            '^BSESN': { name: 'Sensex', short: 'SENSEX' },
            '^NSEBANK': { name: 'Bank Nifty', short: 'BANKNIFTY' },
            '^CNXFINANCE': { name: 'Nifty Financial', short: 'FINNIFTY' },
            '^CNXIT': { name: 'Nifty IT', short: 'NIFTYIT' },
            '^INDIAVIX': { name: 'India VIX', short: 'VIX' }
        },
        nseSymbols: [
            'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
            'HINDUNILVR', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK',
            'BAJFINANCE', 'LT', 'WIPRO', 'AXISBANK', 'TITAN',
            'ADANIENT', 'ASIANPAINT', 'NTPC', 'MARUTI', 'SUNPHARMA',
            'TATAMOTORS', 'POWERGRID', 'ULTRACEMCO', 'HCLTECH', 'BAJAJFINSV',
            'ADANIPORTS', 'TATASTEEL', 'JSWSTEEL', 'TECHM', 'HINDALCO',
            'COALINDIA', 'BRITANNIA', 'DIVISLAB', 'GRASIM', 'SBILIFE',
            'DRREDDY', 'CIPLA', 'APOLLOHOSP', 'EICHERMOT', 'HDFCLIFE',
            'BPCL', 'IOC', 'HEROMOTOCO', 'BAJAJ-AUTO', 'M&M',
            'TRENT', 'INDUSINDBK', 'NESTLEIND', 'ONGC', 'BEL',
            'ZOMATO', 'VEDL', 'PFC', 'RECLTD', 'IDEA',
            'YESBANK', 'SAIL', 'BHEL', 'NHPC', 'HAL',
            'IRCTC', 'IEX', 'PNB', 'BANDHANBNK', 'MARICO',
            'DABUR', 'HINDZINC', 'SIEMENS', 'LTI', 'LTIM',
            'TVSMOTOR', 'MOTHERSON', 'HAVELLS', 'AMBUJACEM', 'ACC',
            'BERGEPAINT', 'PIDILITIND', 'COLPAL', 'GODREJCP', 'DIXON',
            'BIOCON', 'BANKBARODA', 'MCDOWELL-N', 'TORNTPHARM', 'AUROPHARMA',
            'POLYCAB', 'INDIGO', 'IDFCFIRSTB', 'NALCO', 'NATIONALUM',
            'CONCOR', 'ADANIGREEN', 'ADANITRANS', 'ADANIPOWER', 'ADANIGAS',
            'GAIL', 'PETRONET', 'MGL', 'IGL', 'HDFCAMC'
        ],
        refreshInterval: 5000, // 5 seconds
        historicalYears: 5
    },

    ANALYSIS: {
        // Technical indicator defaults
        emaPeriods: [9, 20, 50, 100, 200],
        smaPeriods: [20, 50, 100, 200],
        rsiPeriod: 14,
        macd: { fast: 12, slow: 26, signal: 9 },
        bollinger: { period: 20, stdDev: 2 },
        atrPeriod: 14,
        adxPeriod: 14,
        supertrend: { period: 10, multiplier: 3 },
        // Confidence thresholds
        strongBuy: 75,
        buy: 60,
        neutral: 45,
        sell: 30,
        strongSell: 15
    },

    UI: {
        theme: 'dark', // dark | light
        defaultView: 'dashboard',
        animations: true,
        notifications: true,
        chartConfig: {
            height: 400,
            width: '100%',
            crosshair: true,
            gridLines: true
        }
    },

    TRADING: {
        defaultCapital: 100000,
        maxRiskPerTrade: 0.02, // 2%
        dailyLossLimit: 0.05, // 5%
        minRiskReward: 1.5,
        positionSizing: 'fixed', // fixed | kelly | percent
        tradingHours: {
            start: '09:15',
            end: '15:30',
            timezone: 'Asia/Kolkata'
        }
    }
};

// Freeze config to prevent accidental mutation
Object.freeze(CONFIG);
