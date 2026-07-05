/**
 * AI Trading Platform - Technical Indicators Library
 * Full implementation of all major technical indicators
 */

class Indicators {
    /**
     * Simple Moving Average
     */
    static SMA(data, period) {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
                continue;
            }
            let sum = 0;
            for (let j = i - period + 1; j <= i; j++) {
                sum += data[j];
            }
            result.push(sum / period);
        }
        return result;
    }

    /**
     * Exponential Moving Average
     */
    static EMA(data, period) {
        const result = [];
        const multiplier = 2 / (period + 1);
        let ema = 0;
        
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) {
                result.push(null);
                continue;
            }
            if (i === period - 1) {
                let sum = 0;
                for (let j = 0; j < period; j++) {
                    sum += data[j];
                }
                ema = sum / period;
            } else {
                ema = (data[i] - ema) * multiplier + ema;
            }
            result.push(ema);
        }
        return result;
    }

    /**
     * Relative Strength Index
     */
    static RSI(data, period = 14) {
        const result = [];
        let gains = [];
        let losses = [];
        
        for (let i = 0; i < data.length; i++) {
            if (i < 1) {
                result.push(null);
                continue;
            }
            
            const change = data[i] - data[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
            
            if (i < period) {
                result.push(null);
                continue;
            }
            
            const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
            const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
            
            if (avgLoss === 0) {
                result.push(100);
            } else {
                const rs = avgGain / avgLoss;
                result.push(100 - (100 / (1 + rs)));
            }
        }
        return result;
    }

    /**
     * MACD (Moving Average Convergence Divergence)
     */
    static MACD(data, fast = 12, slow = 26, signal = 9) {
        const emaFast = this.EMA(data, fast);
        const emaSlow = this.EMA(data, slow);
        const macdLine = [];
        const signalLine = [];
        const histogram = [];
        
        for (let i = 0; i < data.length; i++) {
            if (emaFast[i] === null || emaSlow[i] === null) {
                macdLine.push(null);
                signalLine.push(null);
                histogram.push(null);
                continue;
            }
            macdLine.push(emaFast[i] - emaSlow[i]);
        }
        
        const emaSignal = this.EMA(macdLine.filter(v => v !== null), signal);
        let sigIdx = 0;
        for (let i = 0; i < data.length; i++) {
            if (macdLine[i] === null) {
                signalLine.push(null);
                histogram.push(null);
            } else {
                const sig = emaSignal[sigIdx] || 0;
                signalLine.push(sig);
                histogram.push(macdLine[i] - sig);
                sigIdx++;
            }
        }
        
        return { macd: macdLine, signal: signalLine, histogram };
    }

    /**
     * Bollinger Bands
     */
    static BollingerBands(data, period = 20, stdDev = 2) {
        const sma = this.SMA(data, period);
        const upper = [];
        const lower = [];
        
        for (let i = 0; i < data.length; i++) {
            if (sma[i] === null) {
                upper.push(null);
                lower.push(null);
                continue;
            }
            
            let sumSq = 0;
            for (let j = i - period + 1; j <= i; j++) {
                sumSq += Math.pow(data[j] - sma[i], 2);
            }
            const std = Math.sqrt(sumSq / period);
            
            upper.push(sma[i] + stdDev * std);
            lower.push(sma[i] - stdDev * std);
        }
        
        return { middle: sma, upper, lower };
    }

    /**
     * Average True Range
     */
    static ATR(high, low, close, period = 14) {
        const tr = [];
        const atr = [];
        
        for (let i = 0; i < close.length; i++) {
            if (i < 1) {
                tr.push(high[i] - low[i]);
                atr.push(null);
                continue;
            }
            
            const tr1 = high[i] - low[i];
            const tr2 = Math.abs(high[i] - close[i - 1]);
            const tr3 = Math.abs(low[i] - close[i - 1]);
            tr.push(Math.max(tr1, tr2, tr3));
            
            if (i < period) {
                atr.push(null);
                continue;
            }
            
            if (i === period) {
                const sum = tr.slice(0, period + 1).reduce((a, b) => a + b, 0);
                atr.push(sum / period);
            } else {
                atr.push(((atr[atr.length - 1] * (period - 1)) + tr[i]) / period);
            }
        }
        return atr;
    }

    /**
     * SuperTrend
     */
    static SuperTrend(high, low, close, period = 10, multiplier = 3) {
        const atr = this.ATR(high, low, close, period);
        const upperBand = [];
        const lowerBand = [];
        const trend = [];
        let prevUpper = 0;
        let prevLower = 0;
        let prevTrend = 1; // 1 = uptrend, -1 = downtrend
        
        for (let i = 0; i < close.length; i++) {
            if (i < period) {
                upperBand.push(null);
                lowerBand.push(null);
                trend.push(null);
                prevUpper = 0;
                prevLower = 0;
                continue;
            }
            
            const hl2 = (high[i] + low[i]) / 2;
            let upper = hl2 + (multiplier * (atr[i] || 0));
            let lower = hl2 - (multiplier * (atr[i] || 0));
            
            if (i > period) {
                if (upper < prevUpper || close[i - 1] > prevUpper) {
                    upper = upper;
                } else {
                    upper = prevUpper;
                }
                
                if (lower > prevLower || close[i - 1] < prevLower) {
                    lower = lower;
                } else {
                    lower = prevLower;
                }
            }
            
            upperBand.push(upper);
            lowerBand.push(lower);
            
            let currTrend;
            if (close[i] > prevLower && prevTrend === 1) {
                currTrend = 1;
            } else if (close[i] < prevUpper && prevTrend === -1) {
                currTrend = -1;
            } else {
                currTrend = prevTrend;
            }
            
            trend.push(currTrend);
            prevUpper = upper;
            prevLower = lower;
            prevTrend = currTrend;
        }
        
        return { upper: upperBand, lower: lowerBand, trend };
    }

    /**
     * ADX (Average Directional Index)
     */
    static ADX(high, low, close, period = 14) {
        const tr = [];
        const plusDM = [];
        const minusDM = [];
        const atr = this.ATR(high, low, close, period);
        const plusDI = [];
        const minusDI = [];
        const dx = [];
        const adx = [];
        
        for (let i = 0; i < close.length; i++) {
            if (i < 1) {
                tr.push(0);
                plusDM.push(0);
                minusDM.push(0);
                plusDI.push(null);
                minusDI.push(null);
                dx.push(null);
                adx.push(null);
                continue;
            }
            
            const move = high[i] - high[i - 1];
            const moveDown = low[i - 1] - low[i];
            
            plusDM.push(move > moveDown && move > 0 ? move : 0);
            minusDM.push(moveDown > move && moveDown > 0 ? moveDown : 0);
            
            if (i >= period) {
                const avgPlusDM = plusDM.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
                const avgMinusDM = minusDM.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
                const avgTR = atr[i] || 1;
                
                const pDI = 100 * avgPlusDM / avgTR;
                const mDI = 100 * avgMinusDM / avgTR;
                plusDI.push(pDI);
                minusDI.push(mDI);
                
                const diDiff = Math.abs(pDI - mDI);
                const diSum = pDI + mDI;
                dx.push(diSum > 0 ? 100 * diDiff / diSum : 0);
                
                if (i >= period * 2 - 1) {
                    const dxSlice = dx.slice(-period);
                    const avgDX = dxSlice.reduce((a, b) => a + b, 0) / dxSlice.length;
                    adx.push(avgDX);
                } else {
                    adx.push(null);
                }
            } else {
                plusDI.push(null);
                minusDI.push(null);
                dx.push(null);
                adx.push(null);
            }
        }
        
        return { adx, plusDI, minusDI };
    }

    /**
     * On-Balance Volume
     */
    static OBV(close, volume) {
        const obv = [0];
        for (let i = 1; i < close.length; i++) {
            if (close[i] > close[i - 1]) {
                obv.push(obv[i - 1] + volume[i]);
            } else if (close[i] < close[i - 1]) {
                obv.push(obv[i - 1] - volume[i]);
            } else {
                obv.push(obv[i - 1]);
            }
        }
        return obv;
    }

    /**
     * VWAP (Volume Weighted Average Price)
     */
    static VWAP(high, low, close, volume) {
        const vwap = [];
        let cumVol = 0;
        let cumPV = 0;
        
        for (let i = 0; i < close.length; i++) {
            const typicalPrice = (high[i] + low[i] + close[i]) / 3;
            cumPV += typicalPrice * volume[i];
            cumVol += volume[i];
            vwap.push(cumVol > 0 ? cumPV / cumVol : null);
        }
        return vwap;
    }

    /**
     * Money Flow Index
     */
    static MFI(high, low, close, volume, period = 14) {
        const mfi = [];
        const typicalPrice = [];
        const moneyFlow = [];
        const positiveFlow = [];
        const negativeFlow = [];
        
        for (let i = 0; i < close.length; i++) {
            const tp = (high[i] + low[i] + close[i]) / 3;
            typicalPrice.push(tp);
            moneyFlow.push(tp * volume[i]);
            
            if (i < 1) {
                mfi.push(null);
                positiveFlow.push(0);
                negativeFlow.push(0);
                continue;
            }
            
            if (typicalPrice[i] > typicalPrice[i - 1]) {
                positiveFlow.push(moneyFlow[i]);
                negativeFlow.push(0);
            } else {
                positiveFlow.push(0);
                negativeFlow.push(moneyFlow[i]);
            }
            
            if (i < period) {
                mfi.push(null);
                continue;
            }
            
            const posSum = positiveFlow.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            const negSum = negativeFlow.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            
            if (negSum === 0) {
                mfi.push(100);
            } else {
                const ratio = posSum / negSum;
                mfi.push(100 - (100 / (1 + ratio)));
            }
        }
        return mfi;
    }

    /**
     * Chaikin Money Flow
     */
    static CMF(high, low, close, volume, period = 20) {
        const cmf = [];
        const mfv = [];
        
        for (let i = 0; i < close.length; i++) {
            const hl = high[i] - low[i];
            if (hl === 0) {
                mfv.push(0);
            } else {
                const clv = ((close[i] - low[i]) - (high[i] - close[i])) / hl;
                mfv.push(clv * volume[i]);
            }
            
            if (i < period - 1) {
                cmf.push(null);
            } else {
                const volSum = volume.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
                const mfvSum = mfv.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
                cmf.push(volSum > 0 ? mfvSum / volSum : 0);
            }
        }
        return cmf;
    }

    /**
     * ROC (Rate of Change)
     */
    static ROC(data, period = 12) {
        const roc = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period) {
                roc.push(null);
            } else if (data[i - period] === 0) {
                roc.push(0);
            } else {
                roc.push(((data[i] - data[i - period]) / data[i - period]) * 100);
            }
        }
        return roc;
    }

    /**
     * Stochastic RSI
     */
    static StochRSI(data, period = 14, smoothK = 3, smoothD = 3) {
        const rsi = this.RSI(data, period);
        const stochRsi = [];
        const kValues = [];
        const dValues = [];
        
        for (let i = 0; i < rsi.length; i++) {
            if (i < period * 2 - 1) {
                stochRsi.push(null);
                kValues.push(null);
                dValues.push(null);
                continue;
            }
            
            const rsiSlice = rsi.slice(i - period + 1, i + 1);
            const minRsi = Math.min(...rsiSlice);
            const maxRsi = Math.max(...rsiSlice);
            
            if (maxRsi === minRsi) {
                stochRsi.push(0.5);
            } else {
                stochRsi.push((rsi[i] - minRsi) / (maxRsi - minRsi));
            }
            
            if (i >= period * 2 + smoothK - 2) {
                const kSlice = stochRsi.slice(-smoothK);
                const k = (kSlice.reduce((a, b) => a + b, 0) / smoothK) * 100;
                kValues.push(k);
                
                if (kValues.length >= smoothD) {
                    const dSlice = kValues.slice(-smoothD);
                    dValues.push(dSlice.reduce((a, b) => a + b, 0) / smoothD);
                } else {
                    dValues.push(null);
                }
            } else {
                kValues.push(null);
                dValues.push(null);
            }
        }
        
        return { stochRsi: stochRsi.map(v => v !== null ? v * 100 : null), k: kValues, d: dValues };
    }

    /**
     * Ichimoku Cloud
     */
    static Ichimoku(high, low, close, conversionPeriod = 9, basePeriod = 26, spanPeriod = 52, displacement = 26) {
        const conversion = [];
        const base = [];
        const spanA = [];
        const spanB = [];
        const lagging = [];
        
        for (let i = 0; i < close.length; i++) {
            // Tenkan-sen (Conversion Line)
            if (i < conversionPeriod - 1) {
                conversion.push(null);
            } else {
                const highSlice = high.slice(i - conversionPeriod + 1, i + 1);
                const lowSlice = low.slice(i - conversionPeriod + 1, i + 1);
                conversion.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
            }
            
            // Kijun-sen (Base Line)
            if (i < basePeriod - 1) {
                base.push(null);
            } else {
                const highSlice = high.slice(i - basePeriod + 1, i + 1);
                const lowSlice = low.slice(i - basePeriod + 1, i + 1);
                base.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
            }
            
            // Senkou Span A (Leading Span A)
            if (i < displacement - 1) {
                spanA.push(null);
            } else if (conversion[i] !== null && base[i] !== null) {
                spanA.push((conversion[i] + base[i]) / 2);
            } else {
                spanA.push(null);
            }
            
            // Senkou Span B (Leading Span B)
            if (i < spanPeriod - 1 + displacement) {
                spanB.push(null);
            } else {
                const highSlice = high.slice(i - spanPeriod + 1 - displacement, i + 1 - displacement);
                const lowSlice = low.slice(i - spanPeriod + 1 - displacement, i + 1 - displacement);
                spanB.push((Math.max(...highSlice) + Math.min(...lowSlice)) / 2);
            }
            
            // Chikou Span (Lagging Span)
            if (i < displacement) {
                lagging.push(close[i]);
            } else {
                lagging.push(close[i - displacement]);
            }
        }
        
        return { conversion, base, spanA, spanB, lagging };
    }

    /**
     * Pivot Points (Classic)
     */
    static PivotPoints(high, low, close) {
        const pivot = (high + low + close) / 3;
        const r1 = 2 * pivot - low;
        const r2 = pivot + (high - low);
        const r3 = high + 2 * (pivot - low);
        const s1 = 2 * pivot - high;
        const s2 = pivot - (high - low);
        const s3 = low - 2 * (high - pivot);
        
        return { pivot, r1, r2, r3, s1, s2, s3 };
    }

    /**
     * Fibonacci Retracement Levels
     */
    static FibonacciRetracement(high, low) {
        const diff = high - low;
        return {
            level_0: high,
            level_236: high - diff * 0.236,
            level_382: high - diff * 0.382,
            level_5: high - diff * 0.5,
            level_618: high - diff * 0.618,
            level_786: high - diff * 0.786,
            level_1: low
        };
    }

    /**
     * Fibonacci Extension Levels
     */
    static FibonacciExtension(swingLow, swingHigh, retracement) {
        const diff = swingHigh - swingLow;
        return {
            level_1272: retracement + diff * 1.272,
            level_1618: retracement + diff * 1.618,
            level_2618: retracement + diff * 2.618,
            level_4236: retracement + diff * 4.236
        };
    }

    /**
     * Candlestick Pattern Recognition
     */
    static detectCandlestickPatterns(open, high, low, close) {
        const patterns = [];
        const n = open.length;
        
        for (let i = 0; i < n; i++) {
            const o = open[i], h = high[i], l = low[i], c = close[i];
            const body = Math.abs(c - o);
            const upperShadow = h - Math.max(o, c);
            const lowerShadow = Math.min(o, c) - l;
            const totalRange = h - l;
            const isBullish = c > o;
            const isBearish = c < o;
            
            const candlePatterns = [];
            
            // Doji
            if (body / totalRange < 0.1 && totalRange > 0) {
                candlePatterns.push('doji');
            }
            
            // Hammer / Hanging Man
            if (lowerShadow / totalRange >= 0.6 && body / totalRange < 0.3 && upperShadow / totalRange < 0.1) {
                if (isBullish) candlePatterns.push('hammer');
                else candlePatterns.push('hanging-man');
            }
            
            // Shooting Star
            if (upperShadow / totalRange >= 0.6 && body / totalRange < 0.3 && lowerShadow / totalRange < 0.1) {
                candlePatterns.push('shooting-star');
            }
            
            // Marubozu
            if (body / totalRange > 0.95) {
                if (isBullish) candlePatterns.push('marubozu-green');
                else candlePatterns.push('marubozu-red');
            }
            
            // Spinning Top
            if (body / totalRange < 0.3 && totalRange > 0) {
                candlePatterns.push('spinning-top');
            }
            
            // Engulfing Pattern (needs previous candle)
            if (i > 0) {
                const prevBody = Math.abs(close[i - 1] - open[i - 1]);
                const prevIsBullish = close[i - 1] > open[i - 1];
                
                if (isBullish && !prevIsBullish && body > prevBody &&
                    c > open[i - 1] && o < close[i - 1]) {
                    candlePatterns.push('bullish-engulfing');
                }
                if (isBearish && prevIsBullish && body > prevBody &&
                    o > close[i - 1] && c < open[i - 1]) {
                    candlePatterns.push('bearish-engulfing');
                }
                
                // Morning Star (3 candle pattern)
                if (i > 1 && isBullish && body > prevBody * 1.5) {
                    const prev2Body = Math.abs(close[i - 2] - open[i - 2]);
                    const prev2IsBullish = close[i - 2] > open[i - 2];
                    if (!prevIsBullish && prev2IsBullish && prevBody < prev2Body * 0.3) {
                        candlePatterns.push('morning-star');
                    }
                }
                
                // Evening Star (3 candle pattern)
                if (i > 1 && isBearish && body > prevBody * 1.5) {
                    const prev2Body = Math.abs(close[i - 2] - open[i - 2]);
                    const prev2IsBullish = close[i - 2] > open[i - 2];
                    if (prevIsBullish && prev2IsBullish && prevBody < prev2Body * 0.3) {
                        candlePatterns.push('evening-star');
                    }
                }
                
                // Harami
                if (body < prevBody * 0.5 && body > 0) {
                    if (isBearish && prevIsBullish) candlePatterns.push('bearish-harami');
                    if (isBullish && !prevIsBullish) candlePatterns.push('bullish-harami');
                }
                
                // Inside Bar
                if (h <= high[i - 1] && l >= low[i - 1] && body < prevBody) {
                    candlePatterns.push('inside-bar');
                }
                
                // Outside Bar
                if (h > high[i - 1] && l < low[i - 1] && body > prevBody) {
                    candlePatterns.push('outside-bar');
                }
            }
            
            patterns.push(candlePatterns);
        }
        
        return patterns;
    }

    /**
     * Calculate trend strength
     */
    static getTrendStrength(ema9, ema20, ema50, close) {
        let score = 0;
        
        if (ema9 && ema20 && ema9 > ema20) score += 20;
        if (ema9 && ema20 && ema9 > ema20) score += 15;
        if (ema20 && ema50 && ema20 > ema50) score += 15;
        if (ema50 && close && ema50 < close) score += 10;
        
        return Math.min(100, score);
    }

    /**
     * Calculate momentum score
     */
    static getMomentumScore(rsi, stochRsi, macdHistogram) {
        let score = 50;
        
        if (rsi !== null) {
            if (rsi > 70) score += 20;
            else if (rsi > 60) score += 10;
            else if (rsi < 30) score -= 20;
            else if (rsi < 40) score -= 10;
        }
        
        if (stochRsi !== null) {
            if (stochRsi > 0.8) score += 15;
            else if (stochRsi < 0.2) score -= 15;
        }
        
        if (macdHistogram !== null) {
            if (macdHistogram > 0) score += 10;
            else score -= 10;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate volatility score
     */
    static getVolatilityScore(atr, currentPrice, avgATR) {
        if (!atr || !currentPrice || !avgATR) return 50;
        const volPercent = (atr / currentPrice) * 100;
        const avgVolPercent = (avgATR / currentPrice) * 100;
        
        if (volPercent > avgVolPercent * 1.5) return 80; // High volatility
        if (volPercent > avgVolPercent * 1.2) return 65;
        if (volPercent < avgVolPercent * 0.7) return 30; // Low volatility
        return 50;
    }
}

export default Indicators;
