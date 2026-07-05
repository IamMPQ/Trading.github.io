/**
 * AI Trading Platform - Technical Analysis Engine
 * Comprehensive technical analysis of stocks
 */

class TechnicalAnalysis {
    /**
     * Perform full technical analysis on a stock
     */
    static async analyze(symbol, ohlcData) {
        if (!ohlcData || ohlcData.length < 50) {
            return this._getInsufficientDataResult(symbol);
        }

        const close = ohlcData.map(d => d.close);
        const high = ohlcData.map(d => d.high);
        const low = ohlcData.map(d => d.low);
        const open = ohlcData.map(d => d.open);
        const volume = ohlcData.map(d => d.volume);
        const currentPrice = close[close.length - 1];

        // Calculate all indicators
        const ema9 = Indicators.EMA(close, 9);
        const ema20 = Indicators.EMA(close, 20);
        const ema50 = Indicators.EMA(close, 50);
        const ema100 = Indicators.EMA(close, 100);
        const ema200 = Indicators.EMA(close, 200);
        
        const sma20 = Indicators.SMA(close, 20);
        const sma50 = Indicators.SMA(close, 50);
        
        const rsi = Indicators.RSI(close, 14);
        const macd = Indicators.MACD(close, 12, 26, 9);
        const bb = Indicators.BollingerBands(close, 20, 2);
        const atr = Indicators.ATR(high, low, close, 14);
        const supertrend = Indicators.SuperTrend(high, low, close, 10, 3);
        const obv = Indicators.OBV(close, volume);
        const mfi = Indicators.MFI(high, low, close, volume, 14);
        const stochRsi = Indicators.StochRSI(close, 14, 3, 3);
        const adx = Indicators.ADX(high, low, close, 14);
        const cmf = Indicators.CMF(high, low, close, volume, 20);
        const roc = Indicators.ROC(close, 12);
        
        // Detect candlestick patterns
        const patterns = Indicators.detectCandlestickPatterns(
            open, high, low, close
        );

        // Latest values
        const latest = {
            ema9: ema9[ema9.length - 1],
            ema20: ema20[ema20.length - 1],
            ema50: ema50[ema50.length - 1],
            ema100: ema100[ema100.length - 1],
            ema200: ema200[ema200.length - 1],
            sma20: sma20[sma20.length - 1],
            sma50: sma50[sma50.length - 1],
            rsi: rsi[rsi.length - 1],
            macd: macd.macd[macd.macd.length - 1],
            macdSignal: macd.signal[macd.signal.length - 1],
            macdHistogram: macd.histogram[macd.histogram.length - 1],
            bbUpper: bb.upper[bb.upper.length - 1],
            bbLower: bb.lower[bb.lower.length - 1],
            bbMiddle: bb.middle[bb.middle.length - 1],
            atr: atr[atr.length - 1],
            supertrend: supertrend.trend[supertrend.trend.length - 1],
            supertrendUpper: supertrend.upper[supertrend.upper.length - 1],
            supertrendLower: supertrend.lower[supertrend.lower.length - 1],
            obv: obv[obv.length - 1],
            mfi: mfi[mfi.length - 1],
            stochRsi: stochRsi.stochRsi[stochRsi.stochRsi.length - 1],
            stochRsiK: stochRsi.k[stochRsi.k.length - 1],
            stochRsiD: stochRsi.d[stochRsi.d.length - 1],
            adx: adx.adx[adx.adx.length - 1],
            plusDI: adx.plusDI[adx.plusDI.length - 1],
            minusDI: adx.minusDI[adx.minusDI.length - 1],
            cmf: cmf[cmf.length - 1],
            roc: roc[roc.length - 1],
            patterns: patterns[patterns.length - 1] || [],
            currentPrice
        };

        // Generate scores
        const trendScore = this._calculateTrendScore(latest);
        const momentumScore = this._calculateMomentumScore(latest);
        const volumeScore = this._calculateVolumeScore(latest);
        const volatilityScore = this._calculateVolatilityScore(latest, ohlcData);
        const supportResistance = this._calculateSRLevels(ohlcData);
        const patternScore = this._calculatePatternScore(latest.patterns);

        // Composite score
        const compositeScore = Math.round(
            trendScore * 0.30 +
            momentumScore * 0.25 +
            volumeScore * 0.15 +
            patternScore * 0.10 +
            (100 - volatilityScore) * 0.10 +
            supportResistance.score * 0.10
        );

        // Determine signal
        const signal = compositeScore >= 75 ? 'strong-buy' :
                       compositeScore >= 60 ? 'buy' :
                       compositeScore >= 40 ? 'neutral' :
                       compositeScore >= 25 ? 'sell' : 'strong-sell';

        // Calculate entry, SL, targets
        const { entry, stopLoss, targets } = this._calculateTradeLevels(
            currentPrice, latest, ohlcData
        );

        return {
            symbol,
            currentPrice,
            signal,
            score: compositeScore,
            trendScore,
            momentumScore,
            volumeScore,
            volatilityScore,
            patternScore,
            indicators: latest,
            supportResistance,
            patterns: latest.patterns,
            entry,
            stopLoss,
            targets,
            riskReward: targets.length > 0 && stopLoss ? 
                ((targets[0] - entry) / (entry - stopLoss)).toFixed(2) : 'N/A',
            timestamp: Date.now()
        };
    }

    /**
     * Calculate trend score (0-100)
     */
    static _calculateTrendScore(latest) {
        let score = 50;
        const { currentPrice, ema9, ema20, ema50, ema100, ema200, supertrend } = latest;
        
        // EMA alignment (bullish: 9 > 20 > 50 > 100 > 200)
        if (ema9 && ema20 && ema9 > ema20) score += 10;
        if (ema20 && ema50 && ema20 > ema50) score += 10;
        if (ema50 && ema100 && ema50 > ema100) score += 8;
        if (ema100 && ema200 && ema100 > ema200) score += 7;
        
        // Price vs EMAs
        if (currentPrice && ema9 && currentPrice > ema9) score += 5;
        if (currentPrice && ema50 && currentPrice > ema50) score += 5;
        if (currentPrice && ema200 && currentPrice > ema200) score += 5;
        
        // Supertrend
        if (supertrend === 1) score += 10;
        if (supertrend === -1) score -= 10;
        
        // ADX trend strength
        if (latest.adx && latest.adx > 25) score += 5;
        if (latest.adx && latest.adx > 40) score += 3;
        if (latest.adx && latest.adx < 20) score -= 5;
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate momentum score (0-100)
     */
    static _calculateMomentumScore(latest) {
        let score = 50;
        
        // RSI
        if (latest.rsi !== null) {
            if (latest.rsi > 70) score += 5;
            else if (latest.rsi > 60) score += 10;
            else if (latest.rsi > 50) score += 5;
            else if (latest.rsi < 30) score -= 10;
            else if (latest.rsi < 40) score -= 5;
            
            // RSI divergence (simplified)
            if (latest.rsi > 50 && latest.rsi < 70) score += 5;
        }
        
        // MACD
        if (latest.macd !== null && latest.macdSignal !== null) {
            if (latest.macd > latest.macdSignal) score += 10;
            else score -= 10;
            if (latest.macdHistogram > 0) score += 5;
            else score -= 5;
        }
        
        // Stochastic RSI
        if (latest.stochRsiK !== null && latest.stochRsiD !== null) {
            if (latest.stochRsiK > latest.stochRsiD) score += 5;
            if (latest.stochRsiK > 80) score += 3;
            if (latest.stochRsiK < 20) score -= 5;
        }
        
        // ROC
        if (latest.roc !== null) {
            if (latest.roc > 0) score += 5;
            else score -= 5;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate volume score (0-100)
     */
    static _calculateVolumeScore(latest) {
        let score = 50;
        
        // OBV trend (simplified)
        if (latest.obv !== null) score += 10;
        
        // MFI
        if (latest.mfi !== null) {
            if (latest.mfi > 80) score += 10;
            else if (latest.mfi > 60) score += 5;
            else if (latest.mfi < 20) score -= 10;
            else if (latest.mfi < 40) score -= 5;
        }
        
        // CMF
        if (latest.cmf !== null) {
            if (latest.cmf > 0.1) score += 10;
            else if (latest.cmf > 0) score += 5;
            else if (latest.cmf < -0.1) score -= 10;
            else if (latest.cmf < 0) score -= 5;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate volatility score (0-100)
     */
    static _calculateVolatilityScore(latest, ohlcData) {
        if (!latest.atr || !latest.currentPrice || ohlcData.length < 20) return 50;
        
        const atrPercent = (latest.atr / latest.currentPrice) * 100;
        
        // Calculate average ATR%
        let totalATRPercent = 0;
        let count = 0;
        for (let i = ohlcData.length - 20; i < ohlcData.length - 1; i++) {
            if (i >= 0) {
                const p = ohlcData[i].close;
                if (p > 0) {
                    totalATRPercent += (Math.abs(ohlcData[i].high - ohlcData[i].low) / p) * 100;
                    count++;
                }
            }
        }
        const avgATRPercent = count > 0 ? totalATRPercent / count : atrPercent;
        
        if (atrPercent > avgATRPercent * 2) return 85; // Very high volatility
        if (atrPercent > avgATRPercent * 1.5) return 70;
        if (atrPercent < avgATRPercent * 0.5) return 25; // Very low volatility
        if (atrPercent < avgATRPercent * 0.7) return 35;
        return 50;
    }

    /**
     * Calculate support and resistance levels
     */
    static _calculateSRLevels(ohlcData) {
        if (ohlcData.length < 20) {
            return { support: 0, resistance: 0, score: 50 };
        }

        const close = ohlcData.map(d => d.close);
        const high = ohlcData.map(d => d.high);
        const low = ohlcData.map(d => d.low);
        const currentPrice = close[close.length - 1];
        
        // Use recent data (last 20 periods)
        const recentHigh = Math.max(...high.slice(-20));
        const recentLow = Math.min(...low.slice(-20));
        
        // Pivot Points
        const prevClose = close.length > 1 ? close[close.length - 2] : currentPrice;
        const prevHigh = high.slice(-2)[0] || recentHigh;
        const prevLow = low.slice(-2)[0] || recentLow;
        const pivots = Indicators.PivotPoints(prevHigh, prevLow, prevClose);
        
        // Find nearest resistance and support
        const resistances = [pivots.r1, pivots.r2, pivots.r3, recentHigh]
            .filter(r => r > currentPrice)
            .sort((a, b) => a - b);
            
        const supports = [pivots.s1, pivots.s2, pivots.s3, recentLow]
            .filter(s => s < currentPrice)
            .sort((a, b) => b - a);
        
        const nearestResistance = resistances.length > 0 ? resistances[0] : currentPrice * 1.02;
        const nearestSupport = supports.length > 0 ? supports[0] : currentPrice * 0.98;
        
        // Calculate proximity score
        const resistanceDist = ((nearestResistance - currentPrice) / currentPrice) * 100;
        const supportDist = ((currentPrice - nearestSupport) / currentPrice) * 100;
        
        let score = 50;
        if (resistanceDist < 0.5) score -= 15; // Near resistance
        if (supportDist < 0.5) score += 15; // Near support
        if (resistanceDist < 1) score -= 10;
        if (supportDist < 1) score += 10;
        
        return {
            support: nearestSupport,
            resistance: nearestResistance,
            pivot: pivots.pivot,
            score: Math.max(0, Math.min(100, score))
        };
    }

    /**
     * Calculate candlestick pattern score
     */
    static _calculatePatternScore(patterns) {
        if (!patterns || patterns.length === 0) return 50;
        
        let score = 50;
        const bullishPatterns = ['hammer', 'morning-star', 'bullish-engulfing', 'bullish-harami', 'marubozu-green'];
        const bearishPatterns = ['shooting-star', 'evening-star', 'bearish-engulfing', 'bearish-harami', 'marubozu-red'];
        const neutralPatterns = ['doji', 'spinning-top', 'inside-bar'];
        
        patterns.forEach(pattern => {
            if (bullishPatterns.includes(pattern)) score += 15;
            if (bearishPatterns.includes(pattern)) score -= 15;
            if (pattern === 'outside-bar') {
                // Outside bar suggests volatility, direction unknown
                score += 5;
            }
        });
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate trade levels (entry, stop-loss, targets)
     */
    static _calculateTradeLevels(currentPrice, latest, ohlcData) {
        const atr = latest.atr || currentPrice * 0.01;
        const recentLow = Math.min(...ohlcData.slice(-10).map(d => d.low));
        const recentHigh = Math.max(...ohlcData.slice(-10).map(d => d.high));
        
        // Entry: current price for intraday
        const entry = currentPrice;
        
        // Stop loss: below recent low or 1.5x ATR
        const stopLoss = Math.min(
            entry - atr * 1.5,
            recentLow - (recentLow * 0.001)
        );
        
        // Targets based on ATR
        const targets = [
            entry + atr * 1.5,
            entry + atr * 2.5,
            entry + atr * 4
        ];
        
        return { entry, stopLoss: Math.round(stopLoss * 100) / 100, targets: targets.map(t => Math.round(t * 100) / 100) };
    }

    /**
     * Get result for insufficient data
     */
    static _getInsufficientDataResult(symbol) {
        return {
            symbol,
            currentPrice: 0,
            signal: 'neutral',
            score: 50,
            trendScore: 50,
            momentumScore: 50,
            volumeScore: 50,
            volatilityScore: 50,
            patternScore: 50,
            indicators: {},
            supportResistance: { support: 0, resistance: 0, score: 50 },
            patterns: [],
            entry: 0,
            stopLoss: 0,
            targets: [],
            riskReward: 'N/A',
            error: 'Insufficient data for analysis',
            timestamp: Date.now()
        };
    }

    /**
     * Generate technical summary text
     */
    static generateSummary(analysis) {
        if (!analysis || analysis.error) {
            return 'Insufficient data to generate technical summary.';
        }

        const parts = [];
        
        // Trend
        if (analysis.trendScore >= 70) parts.push('Strong uptrend with bullish EMA alignment.');
        else if (analysis.trendScore >= 55) parts.push('Moderate uptrend. Trend is generally positive.');
        else if (analysis.trendScore >= 45) parts.push('Trend is sideways with no clear direction.');
        else if (analysis.trendScore >= 30) parts.push('Mild downtrend. Caution advised.');
        else parts.push('Strong downtrend. Avoid long positions.');
        
        // Momentum
        if (analysis.momentumScore >= 70) parts.push('Strong bullish momentum with RSI in bullish territory.');
        else if (analysis.momentumScore >= 55) parts.push('Positive momentum but not overbought.');
        else if (analysis.momentumScore >= 45) parts.push('Momentum is neutral.');
        else if (analysis.momentumScore >= 30) parts.push('Bearish momentum building.');
        else parts.push('Strong bearish momentum. RSI indicates oversold conditions.');
        
        // Volume
        if (analysis.volumeScore >= 65) parts.push('Volume confirms the price movement.');
        else if (analysis.volumeScore >= 45) parts.push('Volume is average.');
        else parts.push('Volume does not support the price move.');
        
        // Patterns
        if (analysis.patterns && analysis.patterns.length > 0) {
            parts.push(`Detected pattern: ${analysis.patterns.join(', ')}.`);
        }
        
        // Support/Resistance
        const sr = analysis.supportResistance;
        if (sr) {
            parts.push(`Key support at ${formatPrice(sr.support)} and resistance at ${formatPrice(sr.resistance)}.`);
        }
        
        // Overall
        parts.push(`Overall technical score: ${analysis.score}/100 (${getSignalLabel(analysis.signal)}).`);
        
        return parts.join(' ');
    }
}

export default TechnicalAnalysis;
