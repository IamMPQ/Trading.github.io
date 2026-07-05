/**
 * AI Trading Platform - Sentiment Analysis Engine
 * Analyzes market sentiment from multiple sources
 */

class SentimentAnalysis {
    /**
     * Calculate overall market sentiment
     */
    static analyzeMarketSentiment(newsItems, marketData, breadth) {
        const newsSentiment = this._analyzeNewsSentiment(newsItems);
        const marketSentiment = this._analyzeMarketDataSentiment(marketData);
        const breadthSentiment = this._analyzeBreadth(breadth);
        
        // Weighted composite
        const composite = {
            score: Math.round(
                newsSentiment.score * 0.25 +
                marketSentiment.score * 0.50 +
                breadthSentiment.score * 0.25
            ),
            news: newsSentiment,
            market: marketSentiment,
            breadth: breadthSentiment,
            label: '',
            timestamp: Date.now()
        };
        
        composite.label = composite.score >= 70 ? 'Bullish' :
                          composite.score >= 55 ? 'Mildly Bullish' :
                          composite.score >= 45 ? 'Neutral' :
                          composite.score >= 30 ? 'Mildly Bearish' : 'Bearish';
        
        return composite;
    }

    /**
     * Analyze news-based sentiment
     */
    static _analyzeNewsSentiment(newsItems) {
        if (!newsItems || newsItems.length === 0) {
            return { score: 50, bullish: 0, bearish: 0, neutral: 0, total: 0 };
        }
        
        const bullish = newsItems.filter(n => n.sentiment === 'bullish').length;
        const bearish = newsItems.filter(n => n.sentiment === 'bearish').length;
        const neutral = newsItems.filter(n => n.sentiment === 'neutral').length;
        const total = newsItems.length;
        
        // Weighted score: bullish = 1, neutral = 0.5, bearish = 0
        const score = total > 0 ? ((bullish * 1 + neutral * 0.5) / total) * 100 : 50;
        
        return { score: Math.round(score), bullish, bearish, neutral, total };
    }

    /**
     * Analyze market data sentiment
     */
    static _analyzeMarketDataSentiment(marketData) {
        let score = 50;
        
        if (!marketData) return { score, factors: ['No market data available'] };
        
        const factors = [];
        
        // Nifty performance
        if (marketData['^NSEI']) {
            const nifty = marketData['^NSEI'];
            if (nifty.changePercent > 0.5) {
                score += 10;
                factors.push('Nifty strongly positive');
            } else if (nifty.changePercent > 0) {
                score += 5;
                factors.push('Nifty mildly positive');
            } else if (nifty.changePercent < -0.5) {
                score -= 10;
                factors.push('Nifty strongly negative');
            } else if (nifty.changePercent < 0) {
                score -= 5;
                factors.push('Nifty mildly negative');
            }
        }
        
        // India VIX (low VIX = less fear)
        if (marketData['^INDIAVIX']) {
            const vix = marketData['^INDIAVIX'].price;
            if (vix < 12) {
                score += 10;
                factors.push('Low VIX - low fear');
            } else if (vix < 15) {
                score += 5;
                factors.push('Moderate VIX');
            } else if (vix > 20) {
                score -= 10;
                factors.push('High VIX - elevated fear');
            } else if (vix > 25) {
                score -= 15;
                factors.push('Very high VIX - extreme fear');
            }
        }
        
        // Bank Nifty as leading indicator
        if (marketData['^NSEBANK']) {
            const bankNifty = marketData['^NSEBANK'];
            if (bankNifty.changePercent > 0.5) score += 5;
            if (bankNifty.changePercent < -0.5) score -= 5;
        }
        
        return {
            score: Math.max(0, Math.min(100, score)),
            factors
        };
    }

    /**
     * Analyze market breadth sentiment
     */
    static _analyzeBreadth(breadth) {
        if (!breadth || breadth.advances === undefined || breadth.declines === undefined) {
            return { score: 50, ratio: 0, advances: 0, declines: 0 };
        }
        
        const { advances, declines, unchanged } = breadth;
        const total = advances + declines + (unchanged || 0);
        const ratio = total > 0 ? advances / (declines || 1) : 1;
        
        // Breadth ratio: > 1.5 = strong, > 1 = positive, < 1 = negative, < 0.5 = weak
        let score = 50;
        if (ratio > 2) score += 20;
        else if (ratio > 1.5) score += 15;
        else if (ratio > 1.2) score += 10;
        else if (ratio > 0.8) score += 0;
        else if (ratio > 0.5) score -= 10;
        else score -= 20;
        
        return {
            score: Math.max(0, Math.min(100, score)),
            ratio: ratio.toFixed(2),
            advances,
            declines,
            unchanged: unchanged || 0
        };
    }

    /**
     * Analyze FII/DII data
     */
    static analyzeFIIDII(fiiData) {
        if (!fiiData) return { score: 50, fii: 0, dii: 0 };
        
        let score = 50;
        
        if (fiiData.fii?.net > 0) score += 15;
        else score -= 15;
        
        if (fiiData.dii?.net > 0) score += 5;
        else score -= 5;
        
        return {
            score: Math.max(0, Math.min(100, score)),
            fiiNet: fiiData.fii?.net || 0,
            diiNet: fiiData.dii?.net || 0
        };
    }

    /**
     * Get sentiment for a specific stock based on news
     */
    static getStockSentiment(symbol, newsItems) {
        const relevantNews = NewsAPI.getNewsForSymbol(symbol, newsItems);
        
        if (relevantNews.length === 0) {
            return { score: 50, sentiment: 'neutral', newsCount: 0 };
        }
        
        const bullish = relevantNews.filter(n => n.sentiment === 'bullish').length;
        const bearish = relevantNews.filter(n => n.sentiment === 'bearish').length;
        
        // Weight by recency (simplified)
        const score = (bullish / relevantNews.length) * 100;
        
        return {
            score: Math.round(score),
            sentiment: score >= 60 ? 'bullish' : score >= 40 ? 'neutral' : 'bearish',
            newsCount: relevantNews.length,
            relevantNews
        };
    }

    /**
     * Analyze global market influence
     */
    static analyzeGlobalInfluence() {
        // Simplified global market analysis
        // In production, would fetch real-time US, Asian, European markets
        
        const mockGlobalData = {
            'US Markets': { change: Math.random() * 2 - 1, sentiment: Math.random() > 0.5 ? 'positive' : 'negative' },
            'Asian Markets': { change: Math.random() * 2 - 1, sentiment: Math.random() > 0.5 ? 'positive' : 'negative' },
            'European Markets': { change: Math.random() * 2 - 1, sentiment: Math.random() > 0.5 ? 'positive' : 'negative' },
            'USD/INR': { change: Math.random() * 1 - 0.5, sentiment: Math.random() > 0.5 ? 'positive' : 'negative' },
            'Crude Oil': { change: Math.random() * 3 - 1.5, sentiment: Math.random() > 0.5 ? 'positive' : 'negative' }
        };
        
        let score = 50;
        Object.entries(mockGlobalData).forEach(([key, data]) => {
            if (data.sentiment === 'positive') score += 3;
            else score -= 3;
        });
        
        return {
            score: Math.max(0, Math.min(100, score)),
            markets: mockGlobalData
        };
    }

    /**
     * Get fear & greed index estimation
     */
    static getFearGreedIndex(sentimentData) {
        if (!sentimentData || !sentimentData.score) return 50;
        
        const score = sentimentData.score;
        
        if (score >= 80) return { value: 'Extreme Greed', score, color: '#22c55e' };
        if (score >= 65) return { value: 'Greed', score, color: '#4ade80' };
        if (score >= 45) return { value: 'Neutral', score, color: '#f59e0b' };
        if (score >= 30) return { value: 'Fear', score, color: '#fb923c' };
        return { value: 'Extreme Fear', score, color: '#ef4444' };
    }
}

export default SentimentAnalysis;
