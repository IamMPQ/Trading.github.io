/**
 * AI Trading Platform - AI Decision Engine
 * Central intelligence that combines all analysis to generate recommendations
 */

class AIEngine {
    constructor() {
        this.lastAnalysis = {};
        this.recommendations = [];
        this.history = [];
    }

    /**
     * Analyze a single stock and generate recommendation
     */
    async analyzeStock(symbol, ohlcData, newsItems, sectorData) {
        try {
            // 1. Technical Analysis
            const technical = await TechnicalAnalysis.analyze(symbol, ohlcData);
            
            // 2. Sentiment Analysis
            const sentiment = SentimentAnalysis.getStockSentiment(symbol, newsItems);
            
            // 3. News Analysis
            const relevantNews = newsItems ? 
                newsItems.filter(n => n.title?.toUpperCase().includes(symbol) || 
                    n.description?.toUpperCase().includes(symbol)) : [];
            
            // 4. Calculate composite confidence
            const confidence = this._calculateConfidence(technical, sentiment);
            
            // 5. Determine risk level
            const riskLevel = this._calculateRiskLevel(technical, sentiment);
            
            // 6. Generate reasoning
            const reasoning = this._generateReasoning(technical, sentiment, symbol);
            
            // 7. Generate recommendation object
            const recommendation = {
                symbol,
                timestamp: Date.now(),
                currentPrice: technical.currentPrice,
                signal: technical.signal,
                confidence: confidence.score,
                confidenceLabel: confidence.label,
                score: technical.score,
                
                // Trade levels
                entry: technical.entry,
                stopLoss: technical.stopLoss,
                targets: technical.targets,
                riskReward: technical.riskReward,
                
                // Detailed scores
                technicalScore: technical.score,
                trendScore: technical.trendScore,
                momentumScore: technical.momentumScore,
                volumeScore: technical.volumeScore,
                sentimentScore: sentiment.score,
                
                // Analysis details
                technical: technical,
                sentiment: sentiment,
                newsCount: relevantNews.length,
                riskLevel: riskLevel,
                
                // Reasoning
                reasoning: reasoning,
                reasons: reasoning.split('. ').filter(r => r.trim()),
                keyLevels: technical.supportResistance,
                
                // Metadata
                patterns: technical.patterns,
                holdingTime: 'Intraday',
                expectedVolatility: technical.volatilityScore >= 70 ? 'High' : 
                                   technical.volatilityScore >= 45 ? 'Moderate' : 'Low',
                probability: Math.round(confidence.score * 0.8 + Math.random() * 20)
            };
            
            // Store in history
            this.history.push({
                ...recommendation,
                _cachedAt: Date.now()
            });
            
            // Keep only last 100 entries
            if (this.history.length > 100) {
                this.history = this.history.slice(-100);
            }
            
            return recommendation;
        } catch (error) {
            console.warn(`AI analysis failed for ${symbol}:`, error);
            return null;
        }
    }

    /**
     * Analyze multiple stocks
     */
    async analyzeStocks(symbols, ohlcDataMap, newsItems, sectorData) {
        const results = [];
        const batchSize = 3; // Process in batches to avoid overwhelming the system
        
        for (let i = 0; i < symbols.length; i += batchSize) {
            const batch = symbols.slice(i, i + batchSize);
            const promises = batch.map(async (symbol) => {
                const ohlc = ohlcDataMap[symbol];
                if (!ohlc || ohlc.length < 20) return null;
                return await this.analyzeStock(symbol, ohlc, newsItems, sectorData);
            });
            
            const batchResults = await Promise.allSettled(promises);
            batchResults.forEach(r => {
                if (r.status === 'fulfilled' && r.value) {
                    results.push(r.value);
                }
            });
            
            // Small delay between batches
            if (i + batchSize < symbols.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        // Sort by confidence score (highest first)
        results.sort((a, b) => b.confidence - a.confidence);
        
        this.recommendations = results;
        return results;
    }

    /**
     * Calculate confidence score
     */
    _calculateConfidence(technical, sentiment) {
        const weights = {
            technicalScore: 0.50,
            trendScore: 0.15,
            momentumScore: 0.10,
            volumeScore: 0.10,
            sentimentScore: 0.15
        };
        
        const rawScore = 
            (technical.score || 50) * weights.technicalScore +
            (technical.trendScore || 50) * weights.trendScore +
            (technical.momentumScore || 50) * weights.momentumScore +
            (technical.volumeScore || 50) * weights.volumeScore +
            (sentiment.score || 50) * weights.sentimentScore;
        
        // Apply confidence modifiers
        let modifier = 0;
        
        // Strong signals get higher confidence
        if (technical.signal === 'strong-buy' || technical.signal === 'strong-sell') modifier += 5;
        if (technical.score > 80 || technical.score < 20) modifier += 5;
        
        // Multiple confirming factors
        const confirmingFactors = [
            technical.score > 60 && sentiment.score > 60,
            technical.trendScore > 60 && technical.momentumScore > 60,
            technical.volumeScore > 60 && technical.score > 55,
            technical.signal === 'strong-buy' && technical.score > 70
        ].filter(Boolean).length;
        
        modifier += confirmingFactors * 3;
        
        // Trend alignment
        if ((technical.signal === 'buy' || technical.signal === 'strong-buy') && 
            sentiment.score > 55) modifier += 5;
        if ((technical.signal === 'sell' || technical.signal === 'strong-sell') && 
            sentiment.score < 45) modifier += 5;
        
        const finalScore = Math.max(0, Math.min(100, rawScore + modifier));
        
        let label;
        if (finalScore >= 80) label = 'Very High Confidence';
        else if (finalScore >= 65) label = 'High Confidence';
        else if (finalScore >= 50) label = 'Moderate Confidence';
        else if (finalScore >= 35) label = 'Low Confidence';
        else label = 'Very Low Confidence';
        
        return { score: Math.round(finalScore), label };
    }

    /**
     * Calculate risk level
     */
    _calculateRiskLevel(technical, sentiment) {
        let riskScore = 0;
        const factors = [];
        
        // Volatility risk
        if (technical.volatilityScore >= 70) {
            riskScore += 20;
            factors.push('High volatility');
        } else if (technical.volatilityScore >= 50) {
            riskScore += 10;
            factors.push('Moderate volatility');
        }
        
        // Volume risk
        if (technical.volumeScore < 40) {
            riskScore += 15;
            factors.push('Low volume');
        }
        
        // Trend risk
        if (technical.trendScore >= 40 && technical.trendScore <= 60) {
            riskScore += 10;
            factors.push('Unclear trend');
        }
        
        // Sentiment risk
        if (sentiment.score < 40) {
            riskScore += 15;
            factors.push('Negative sentiment');
        }
        
        // Overbought/oversold risk
        const rsi = technical.indicators?.rsi;
        if (rsi !== null && rsi !== undefined) {
            if (rsi > 80) {
                riskScore += 10;
                factors.push('Overbought (RSI > 80)');
            } else if (rsi < 20) {
                riskScore += 5;
                factors.push('Oversold (RSI < 20)');
            }
        }
        
        const level = riskScore >= 50 ? 'High' : riskScore >= 30 ? 'Medium' : 'Low';
        
        return { level, score: riskScore, factors };
    }

    /**
     * Generate human-readable reasoning
     */
    _generateReasoning(technical, sentiment, symbol) {
        const parts = [];
        
        // Signal summary
        if (technical.signal === 'strong-buy' || technical.signal === 'buy') {
            parts.push(`${symbol} shows a ${getSignalLabel(technical.signal)} signal with strong technical setup.`);
        } else if (technical.signal === 'strong-sell' || technical.signal === 'sell') {
            parts.push(`${symbol} shows a ${getSignalLabel(technical.signal)} signal. Caution advised for long positions.`);
        } else {
            parts.push(`${symbol} shows neutral signals. Wait for clearer setup.`);
        }
        
        // Trend analysis
        if (technical.trendScore >= 70) {
            parts.push('The stock is in a strong uptrend with bullish EMA alignment.');
        } else if (technical.trendScore >= 55) {
            parts.push('Trend is moderately positive.');
        } else if (technical.trendScore <= 35) {
            parts.push('The stock is in a downtrend.');
        } else {
            parts.push('Trend direction is unclear.');
        }
        
        // Momentum
        if (technical.momentumScore >= 65) {
            parts.push('Momentum indicators like RSI and MACD confirm bullish momentum.');
        } else if (technical.momentumScore <= 35) {
            parts.push('Momentum is bearish. RSI and MACD suggest weakness.');
        }
        
        // Volume
        if (technical.volumeScore >= 65) {
            parts.push('Volume analysis shows strong participation confirming the move.');
        } else if (technical.volumeScore <= 40) {
            parts.push('Volume is weak, which may indicate lack of conviction.');
        }
        
        // Support/Resistance
        const sr = technical.supportResistance;
        if (sr) {
            if (sr.resistance && sr.resistance > technical.currentPrice) {
                parts.push(`Key resistance at ${formatPrice(sr.resistance)}.`);
            }
            if (sr.support && sr.support < technical.currentPrice) {
                parts.push(`Key support at ${formatPrice(sr.support)}.`);
            }
            if (sr.resistance && Math.abs(sr.resistance - technical.currentPrice) / technical.currentPrice < 0.01) {
                parts.push('Price is near resistance level. Watch for breakout or rejection.');
            }
            if (sr.support && Math.abs(technical.currentPrice - sr.support) / technical.currentPrice < 0.01) {
                parts.push('Price is near support level. Watch for bounce or breakdown.');
            }
        }
        
        // Patterns
        if (technical.patterns && technical.patterns.length > 0) {
            parts.push(`Detected candlestick pattern: ${technical.patterns.join(', ')}.`);
        }
        
        // Sentiment
        if (sentiment.score > 60) {
            parts.push('News sentiment is positive for this stock.');
        } else if (sentiment.score < 40) {
            parts.push('News sentiment is negative for this stock.');
        }
        
        // Risk/reward
        if (technical.riskReward && technical.riskReward !== 'N/A') {
            parts.push(`Risk/Reward ratio is 1:${technical.riskReward}.`);
            if (parseFloat(technical.riskReward) >= 2) {
                parts.push('Attractive risk/reward setup.');
            } else if (parseFloat(technical.riskReward) < 1.5) {
                parts.push('Risk/reward is not favorable. Consider waiting for better levels.');
            }
        }
        
        // Volatility warning
        if (technical.volatilityScore >= 70) {
            parts.push('⚠️ Volatility is elevated. Consider wider stops or smaller position size.');
        }
        
        return parts.join(' ');
    }

    /**
     * Get top recommendations
     */
    getTopRecommendations(count = 10) {
        return this.recommendations.slice(0, count);
    }

    /**
     * Get recommendations by signal type
     */
    getRecommendationsBySignal(signalType) {
        if (signalType === 'all') return this.recommendations;
        return this.recommendations.filter(r => r.signal === signalType);
    }

    /**
     * Get recommendation for a specific symbol
     */
    getRecommendation(symbol) {
        return this.recommendations.find(r => r.symbol === symbol);
    }

    /**
     * Get scanner data (sorted by various criteria)
     */
    getScannerData(filter = 'all') {
        let results = [...this.recommendations];
        
        switch (filter) {
            case 'buy':
                results = results.filter(r => r.signal === 'buy' || r.signal === 'strong-buy');
                break;
            case 'sell':
                results = results.filter(r => r.signal === 'sell' || r.signal === 'strong-sell');
                break;
            case 'breakout':
                results = results.filter(r => r.patterns?.includes('outside-bar') || 
                    (r.trendScore > 65 && r.momentumScore > 65 && r.volumeScore > 60));
                break;
            case 'breakdown':
                results = results.filter(r => r.signal === 'strong-sell' && r.volumeScore > 60);
                break;
            case 'momentum':
                results = results.sort((a, b) => b.momentumScore - a.momentumScore).slice(0, 20);
                break;
            case 'reversal':
                results = results.filter(r => r.patterns?.includes('hammer') || 
                    r.patterns?.includes('morning-star') || 
                    r.patterns?.includes('bullish-engulfing'));
                break;
            case 'high-volume':
                results = results.filter(r => r.volumeScore > 65);
                break;
            default:
                break;
        }
        
        // Sort by confidence
        results.sort((a, b) => b.confidence - a.confidence);
        
        return results;
    }

    /**
     * Answer user queries using AI analysis
     */
    answerQuery(query, context = {}) {
        const q = query.toLowerCase();
        const response = {
            text: '',
            data: null,
            confidence: 0
        };
        
        // Analyze stock queries
        const stockMatch = q.match(/analyze\s+(\w+)/i) || q.match(/(\w+)\s+stock/i) || 
                          q.match(/about\s+(\w+)/i) || q.match(/buy\s+(\w+)/i);
        
        if (stockMatch) {
            const symbol = stockMatch[1].toUpperCase();
            const rec = this.getRecommendation(symbol);
            
            if (rec) {
                response.data = rec;
                response.text = this._generateStockResponse(symbol, rec, q);
                response.confidence = 85;
            } else {
                response.text = `I don't have enough data on ${symbol} yet. I recommend using the Stock Scanner to analyze it first.`;
                response.confidence = 60;
            }
            return response;
        }
        
        // Market sentiment
        if (q.includes('market') && (q.includes('sentiment') || q.includes('bullish') || q.includes('bearish'))) {
            const sentiment = context.sentimentData;
            if (sentiment) {
                response.text = `Current market sentiment is ${sentiment.label.toLowerCase()} with a score of ${sentiment.score}/100. `;
                if (sentiment.score > 60) {
                    response.text += 'Markets are showing positive momentum with broad-based buying.';
                } else if (sentiment.score < 40) {
                    response.text += 'Markets are under pressure with negative breadth. Caution advised.';
                } else {
                    response.text += 'Markets are in a neutral zone without clear direction.';
                }
                response.confidence = 75;
            }
            return response;
        }
        
        // Best intraday opportunity
        if (q.includes('best intraday') || q.includes('top pick') || q.includes('opportunity today')) {
            const topPicks = this.getTopRecommendations(3);
            if (topPicks.length > 0) {
                const best = topPicks.filter(r => r.signal === 'strong-buy' || r.signal === 'buy');
                if (best.length > 0) {
                    response.text = `Today's top intraday opportunities:\n\n`;
                    best.slice(0, 3).forEach((r, i) => {
                        response.text += `${i + 1}. ${r.symbol} - ${getSignalLabel(r.signal)} at ₹${formatPrice(r.currentPrice)} `;
                        response.text += `(Confidence: ${r.confidence}%) - Target: ₹${formatPrice(r.targets?.[0] || 'N/A')}\n`;
                    });
                    response.text += `\nAlways use proper stop losses and position sizing.`;
                } else {
                    response.text = `Currently no strong buy signals. Market may be in a consolidation phase. Consider waiting for clearer setups.`;
                }
                response.data = best;
                response.confidence = 80;
            } else {
                response.text = `I haven't scanned stocks yet. Please run the Stock Scanner first.`;
                response.confidence = 50;
            }
            return response;
        }
        
        // Is the trend strong?
        if (q.includes('trend') && (q.includes('strong') || q.includes('weak'))) {
            const symbol = this._extractSymbol(q);
            if (symbol) {
                const rec = this.getRecommendation(symbol);
                if (rec) {
                    const trendDesc = rec.trendScore >= 70 ? 'very strong' : 
                                     rec.trendScore >= 55 ? 'moderately strong' :
                                     rec.trendScore >= 45 ? 'neither strong nor weak' :
                                     rec.trendScore >= 30 ? 'weak' : 'very weak';
                    response.text = `The trend for ${symbol} is ${trendDesc} (trend score: ${rec.trendScore}/100). `;
                    if (rec.indicators?.ema9 && rec.indicators?.ema20) {
                        response.text += `The 9 EMA is ${rec.indicators.ema9 > rec.indicators.ema20 ? 'above' : 'below'} the 20 EMA, `;
                        response.text += `indicating a ${rec.indicators.ema9 > rec.indicators.ema20 ? 'bullish' : 'bearish'} short-term trend.`;
                    }
                    response.confidence = 80;
                }
            }
            if (!response.text) {
                response.text = `The overall market trend depends on the specific stock. Use the scanner for individual stock trend analysis.`;
                response.confidence = 50;
            }
            return response;
        }
        
        // Overbought/Oversold
        if (q.includes('overbought') || q.includes('oversold')) {
            const symbol = this._extractSymbol(q);
            if (symbol) {
                const rec = this.getRecommendation(symbol);
                if (rec?.indicators?.rsi) {
                    const rsi = rec.indicators.rsi;
                    if (rsi > 70) {
                        response.text = `${symbol} RSI is ${rsi.toFixed(1)} which is OVERBOUGHT. Consider booking profits or waiting for a pullback.`;
                    } else if (rsi < 30) {
                        response.text = `${symbol} RSI is ${rsi.toFixed(1)} which is OVERSOLD. Could see a bounce, but confirm with other indicators.`;
                    } else {
                        response.text = `${symbol} RSI is ${rsi.toFixed(1)} which is in neutral territory. Neither overbought nor oversold.`;
                    }
                    response.confidence = 85;
                }
            }
            if (!response.text) {
                response.text = `Please specify which stock you're asking about. For example: 'Is RELIANCE overbought?'`;
                response.confidence = 50;
            }
            return response;
        }
        
        // Risk management
        if (q.includes('risk') || q.includes('position size') || q.includes('capital')) {
            response.text = `Here are some key risk management rules for intraday trading:\n\n` +
                `1. Never risk more than 2% of capital on a single trade\n` +
                `2. Maintain at least 1:2 risk/reward ratio\n` +
                `3. Set a daily loss limit of 5% of your capital\n` +
                `4. Don't trade more than 3-5 stocks simultaneously\n` +
                `5. Always use a stop loss\n` +
                `6. Keep total exposure under 80% of your capital\n\n` +
                `Use the Risk Manager tool to calculate position sizes.`;
            response.confidence = 90;
            return response;
        }
        
        // Default response
        response.text = `I can help you with:\n\n` +
            `📊 Analyzing specific stocks (e.g., "Analyze RELIANCE")\n` +
            `📈 Checking overbought/oversold conditions\n` +
            `💡 Finding the best intraday opportunities\n` +
            `📉 Assessing market sentiment\n` +
            `⚡ Evaluating trend strength\n` +
            `📋 Risk management and position sizing\n\n` +
            `What would you like to know?`;
        response.confidence = 95;
        return response;
    }

    /**
     * Generate stock response
     */
    _generateStockResponse(symbol, rec, query) {
        let response = `**${symbol} Analysis Summary:**\n\n`;
        response += `💰 Current Price: ₹${formatPrice(rec.currentPrice)}\n`;
        response += `🎯 Signal: ${getSignalLabel(rec.signal)} (Confidence: ${rec.confidence}%)\n`;
        response += `📊 Technical Score: ${rec.score}/100\n\n`;
        
        if (rec.signal === 'strong-buy' || rec.signal === 'buy') {
            response += `✅ **Why BUY?**\n`;
            if (rec.trendScore > 60) response += `• Strong trend (Score: ${rec.trendScore}/100)\n`;
            if (rec.momentumScore > 60) response += `• Bullish momentum (Score: ${rec.momentumScore}/100)\n`;
            if (rec.volumeScore > 60) response += `• Volume confirming the move\n`;
            if (rec.sentimentScore > 60) response += `• Positive news sentiment\n`;
            response += `\n📋 **Trade Plan:**\n`;
            response += `• Entry: ₹${formatPrice(rec.entry)}\n`;
            response += `• Stop Loss: ₹${formatPrice(rec.stopLoss)}\n`;
            response += `• Target 1: ₹${formatPrice(rec.targets?.[0] || 'N/A')}\n`;
            response += `• Target 2: ₹${formatPrice(rec.targets?.[1] || 'N/A')}\n`;
            response += `• Risk/Reward: 1:${rec.riskReward}\n`;
        } else if (rec.signal === 'strong-sell' || rec.signal === 'sell') {
            response += `❌ **Why SELL?**\n`;
            if (rec.trendScore < 40) response += `• Weak/downtrend (Score: ${rec.trendScore}/100)\n`;
            if (rec.momentumScore < 40) response += `• Bearish momentum\n`;
            response += `\n⚠️ Consider booking profits or staying away.\n`;
        } else {
            response += `➡️ **Neutral Signal**\n`;
            response += `The stock lacks a clear directional bias. Wait for a clearer setup before entering.\n`;
        }
        
        response += `\n⚠️ *This is an AI-generated analysis. Always do your own research.*`;
        
        return response;
    }

    /**
     * Extract stock symbol from query
     */
    _extractSymbol(query) {
        const commonStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL',
            'ITC', 'KOTAKBANK', 'BAJFINANCE', 'LT', 'WIPRO', 'AXISBANK', 'TITAN', 'ADANIENT',
            'ASIANPAINT', 'NTPC', 'MARUTI', 'SUNPHARMA', 'TATAMOTORS', 'HCLTECH', 'TATASTEEL'];
        
        const upper = query.toUpperCase();
        for (const stock of commonStocks) {
            if (upper.includes(stock)) return stock;
        }
        
        // Try to find any word that looks like a symbol (all caps, 2-5 chars)
        const words = upper.split(/\s+/);
        for (const word of words) {
            if (word.length >= 2 && word.length <= 5 && /^[A-Z]+$/.test(word)) {
                if (CONFIG.MARKET.nseSymbols.includes(word)) return word;
            }
        }
        
        return null;
    }

    /**
     * Get AI assistant response
     */
    async getAIResponse(query, context = {}) {
        return this.answerQuery(query, context);
    }
}

// Singleton instance
const aiEngine = new AIEngine();
export default aiEngine;
