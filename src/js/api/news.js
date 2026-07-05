/**
 * AI Trading Platform - News API
 * Fetches and analyzes financial news
 */

const NewsAPI = {
    _newsCache: [],
    _lastFetch: 0,
    _cacheDuration: 300000, // 5 minutes

    /**
     * Fetch financial news
     */
    async getNews(category = 'general', count = 20) {
        // Return cached news if fresh
        if (this._newsCache.length > 0 && (Date.now() - this._lastFetch) < this._cacheDuration) {
            return this._newsCache.slice(0, count);
        }

        const newsItems = [];

        // Try multiple sources in parallel
        const sources = [
            this._fetchRSSNews(),
            this._fetchMarketAuxNews(),
            this._fetchYahooFinanceNews()
        ];

        const results = await Promise.allSettled(sources);
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                newsItems.push(...result.value);
            }
        });

        // If no news from APIs, generate demo news
        if (newsItems.length === 0) {
            newsItems.push(...this._generateDemoNews());
        }

        // Sort by date (newest first), remove duplicates
        const unique = newsItems
            .filter((item, index, self) => 
                index === self.findIndex(t => t.title === item.title)
            )
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        this._newsCache = unique;
        this._lastFetch = Date.now();

        return unique.slice(0, count);
    },

    /**
     * Fetch news from RSS feeds
     */
    async _fetchRSSNews() {
        try {
            // Use RSS proxy
            const urls = [
                'https://api.rss2json.com/v1/api.json?rss_url=https://www.moneycontrol.com/rss/business.xml',
                'https://api.rss2json.com/v1/api.json?rss_url=https://economictimes.indiatimes.com/markets/rssfeeds/1977021501'
            ];

            const results = await Promise.allSettled(urls.map(url => 
                fetch(url).then(r => r.json())
            ));

            const items = [];
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value?.items) {
                    result.value.items.forEach(item => {
                        items.push({
                            id: item.guid || item.link,
                            title: item.title,
                            description: item.description || '',
                            source: item.author || 'Financial News',
                            url: item.link,
                            publishedAt: item.pubDate || new Date().toISOString(),
                            category: this._categorizeNews(item.title + ' ' + item.description),
                            sentiment: classifySentiment(item.title + ' ' + item.description)
                        });
                    });
                }
            });

            return items;
        } catch (error) {
            console.warn('RSS fetch failed:', error);
            return [];
        }
    },

    /**
     * Fetch news from MarketAux API
     */
    async _fetchMarketAuxNews() {
        try {
            const apiKey = CONFIG.API.marketaux.key;
            const url = `${CONFIG.API.marketaux.base}/news/all?symbols=RELIANCE,TCS,HDFCBANK&filter_entities=true&language=en&api_token=${apiKey}&limit=10`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.data) return [];

            return data.data.map(item => ({
                id: item.uuid,
                title: item.title,
                description: item.description || '',
                source: item.source || 'Market News',
                url: item.url,
                publishedAt: item.published_at || new Date().toISOString(),
                category: this._categorizeNews(item.title + ' ' + (item.description || '')),
                sentiment: classifySentiment(item.title + ' ' + (item.description || ''))
            }));
        } catch (error) {
            console.warn('MarketAux fetch failed:', error);
            return [];
        }
    },

    /**
     * Fetch news from Yahoo Finance
     */
    async _fetchYahooFinanceNews() {
        try {
            const symbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', '^NSEI'];
            const results = [];

            for (const symbol of symbols.slice(0, 2)) {
                const url = `https://query1.finance.yahoo.com/v1/finance/news?symbols=${symbol}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data?.news) {
                    data.news.forEach(item => {
                        results.push({
                            id: item.uuid || item.id,
                            title: item.title,
                            description: item.summary || '',
                            source: item.publisher || 'Yahoo Finance',
                            url: item.link,
                            publishedAt: new Date(item.providerPublishTime * 1000).toISOString(),
                            category: this._categorizeNews(item.title + ' ' + (item.summary || '')),
                            sentiment: classifySentiment(item.title + ' ' + (item.summary || ''))
                        });
                    });
                }
            }

            return results;
        } catch (error) {
            console.warn('Yahoo Finance news fetch failed:', error);
            return [];
        }
    },

    /**
     * Categorize news
     */
    _categorizeNews(text) {
        const lower = text.toLowerCase();
        if (lower.includes('rbi') || lower.includes('monetary policy') || lower.includes('interest rate')) return 'economy';
        if (lower.includes('budget') || lower.includes('finance minister') || lower.includes('government')) return 'policy';
        if (lower.includes('earnings') || lower.includes('profit') || lower.includes('quarterly') || lower.includes('revenue')) return 'earnings';
        if (lower.includes('dividend') || lower.includes('bonus') || lower.includes('split')) return 'corporate';
        if (lower.includes('ipo') || lower.includes('listing')) return 'ipo';
        if (lower.includes('crude') || lower.includes('oil') || lower.includes('commodity')) return 'commodity';
        if (lower.includes('global') || lower.includes('dow') || lower.includes('nasdaq') || lower.includes('s&p')) return 'global';
        if (lower.includes('acquisition') || lower.includes('merger') || lower.includes('takeover')) return 'corporate';
        return 'general';
    },

    /**
     * Generate demo news when APIs are unavailable
     */
    _generateDemoNews() {
        const now = new Date();
        const news = [
            {
                title: 'Nifty hits fresh all-time high, crosses 22,500 mark',
                description: 'The Nifty 50 index reached a new milestone, crossing the 22,500 level for the first time, driven by strong buying in banking and IT stocks.',
                source: 'Economic Times',
                sentiment: 'bullish',
                category: 'general'
            },
            {
                title: 'RBI keeps repo rate unchanged at 6.5%, maintains policy stance',
                description: 'The Reserve Bank of India kept the repo rate unchanged at 6.5% for the eighth consecutive time, maintaining its withdrawal of accommodation stance.',
                source: 'Moneycontrol',
                sentiment: 'neutral',
                category: 'economy'
            },
            {
                title: 'Reliance Industries Q4 net profit rises 12% YoY',
                description: 'Reliance Industries reported a 12% increase in consolidated net profit for the March quarter, beating market expectations.',
                source: 'Business Standard',
                sentiment: 'bullish',
                category: 'earnings'
            },
            {
                title: 'IT stocks rally on strong Q4 results, deal pipeline',
                description: 'Information technology stocks witnessed a strong rally following impressive quarterly results and positive outlook on deal pipeline.',
                source: 'Financial Express',
                sentiment: 'bullish',
                category: 'earnings'
            },
            {
                title: 'Rupee weakens against US dollar amid global uncertainties',
                description: 'The Indian rupee weakened against the US dollar on Friday, tracking a decline in Asian currencies amid geopolitical tensions.',
                source: 'Reuters',
                sentiment: 'bearish',
                category: 'global'
            },
            {
                title: 'FII buying picks up in Indian equities in April',
                description: 'Foreign institutional investors have turned net buyers in Indian equities in April, investing over ₹15,000 crore so far this month.',
                source: 'NDTV Profit',
                sentiment: 'bullish',
                category: 'general'
            },
            {
                title: 'Bank Nifty outperforms, gains over 1% on strong lending growth',
                description: 'Bank Nifty outperformed the broader market, rising over 1% led by strong lending growth expectations and improving asset quality.',
                source: 'CNBC TV18',
                sentiment: 'bullish',
                category: 'general'
            },
            {
                title: 'Auto sales surge in March, two-wheeler segment leads growth',
                description: 'Auto sales in India saw a significant surge in March 2025, with the two-wheeler segment leading the growth chart.',
                source: 'Auto Car India',
                sentiment: 'bullish',
                category: 'general'
            },
            {
                title: 'Crude oil prices fall amid demand concerns, OPEC+ supply plans',
                description: 'Crude oil prices declined as demand concerns weighed on the market, while OPEC+ signaled potential supply increases.',
                source: 'Bloomberg',
                sentiment: 'bullish',
                category: 'commodity'
            },
            {
                title: 'SEBI tightens F&O trading regulations to protect retail investors',
                description: 'The Securities and Exchange Board of India has introduced stricter regulations for derivatives trading to protect retail investors from excessive risk.',
                source: 'Mint',
                sentiment: 'neutral',
                category: 'policy'
            },
            {
                title: 'Gold prices at new highs, rally continues on global uncertainty',
                description: 'Gold prices soared to new all-time highs as investors sought safe-haven assets amid rising global economic uncertainties.',
                source: 'Reuters',
                sentiment: 'neutral',
                category: 'commodity'
            },
            {
                title: 'Tech Mahindra wins $500 million deal from US-based client',
                description: 'Tech Mahindra has secured a mega deal worth $500 million from a US-based financial services client for digital transformation services.',
                source: 'Economic Times',
                sentiment: 'bullish',
                category: 'earnings'
            },
            {
                title: 'Government to fast-track highway projects worth ₹10 lakh crore',
                description: 'The central government has announced plans to fast-track highway infrastructure projects worth ₹10 lakh crore to boost economic growth.',
                source: 'Press Trust of India',
                sentiment: 'bullish',
                category: 'policy'
            },
            {
                title: 'Pharma stocks under pressure as USFDA issues warning to major firms',
                description: 'Pharmaceutical stocks came under selling pressure after USFDA issued warning letters to several Indian pharmaceutical companies.',
                source: 'Business Line',
                sentiment: 'bearish',
                category: 'general'
            },
            {
                title: 'Q4 earnings season begins: IT, banking sectors in focus',
                description: 'The Q4 earnings season has begun with IT and banking sectors taking center stage as companies announce their March quarter results.',
                source: 'Moneycontrol',
                sentiment: 'neutral',
                category: 'earnings'
            },
            {
                title: 'India\'s GDP growth forecast raised to 7.2% by IMF',
                description: 'The International Monetary Fund has raised India\'s GDP growth forecast to 7.2% for the current fiscal year, citing strong domestic demand.',
                source: 'IMF',
                sentiment: 'bullish',
                category: 'economy'
            },
            {
                title: 'Real estate sector sees 15% growth in residential sales',
                description: 'India\'s real estate sector registered 15% growth in residential property sales during the March quarter, driven by strong demand.',
                source: 'Housing News',
                sentiment: 'bullish',
                category: 'general'
            },
            {
                title: 'Markets witness volatility ahead of Union Budget',
                description: 'Indian equity markets turned volatile as investors remained cautious ahead of the Union Budget announcement.',
                source: 'CNBC TV18',
                sentiment: 'neutral',
                category: 'policy'
            },
            {
                title: 'HDFC Bank launches new home loan scheme at 8.5% interest rate',
                description: 'HDFC Bank has introduced a new home loan scheme with interest rates starting at 8.5% for women borrowers.',
                source: 'Financial Express',
                sentiment: 'neutral',
                category: 'general'
            },
            {
                title: 'Global markets decline on US Fed rate hike concerns',
                description: 'Global stock markets witnessed a broad decline as concerns over potential US Federal Reserve rate hikes weighed on investor sentiment.',
                source: 'Bloomberg',
                sentiment: 'bearish',
                category: 'global'
            }
        ];

        return news.map((item, index) => ({
            id: `demo-${index}-${Date.now()}`,
            ...item,
            publishedAt: new Date(now.getTime() - index * 3600000).toISOString() // Each 1 hour apart
        }));
    },

    /**
     * Get news sentiment summary
     */
    getSentimentSummary(newsItems) {
        if (!newsItems || newsItems.length === 0) {
            return { bullish: 0, bearish: 0, neutral: 0, total: 0, score: 50 };
        }

        const bullish = newsItems.filter(n => n.sentiment === 'bullish').length;
        const bearish = newsItems.filter(n => n.sentiment === 'bearish').length;
        const neutral = newsItems.filter(n => n.sentiment === 'neutral').length;
        const total = newsItems.length;

        // Score 0-100 where >50 is bullish, <50 is bearish
        const score = total > 0 ? ((bullish + neutral * 0.5) / total) * 100 : 50;

        return { bullish, bearish, neutral, total, score };
    },

    /**
     * Get news relevant to a specific symbol
     */
    getNewsForSymbol(symbol, newsItems) {
        if (!newsItems || !symbol) return [];
        
        const upper = symbol.toUpperCase();
        return newsItems.filter(item => 
            item.title.toUpperCase().includes(upper) || 
            (item.description || '').toUpperCase().includes(upper)
        );
    },

    /**
     * Force refresh news
     */
    clearCache() {
        this._newsCache = [];
        this._lastFetch = 0;
    }
};

export default NewsAPI;
