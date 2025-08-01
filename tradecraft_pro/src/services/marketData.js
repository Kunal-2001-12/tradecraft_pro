import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  // Get real-time stock quote
  async getQuote(symbol) {
    const cacheKey = `quote_${symbol}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Try real API sources first if keys are available
      if (ALPHA_VANTAGE_API_KEY || FINNHUB_API_KEY || POLYGON_API_KEY) {
        let data = await this.getQuoteFromAlphaVantage(symbol);
        if (!data) {
          data = await this.getQuoteFromFinnhub(symbol);
        }
        if (!data) {
          data = await this.getQuoteFromPolygon(symbol);
        }
        
        if (data) {
          this.setCache(cacheKey, data);
          return data;
        }
      }

      // Fallback to mock data for demo
      const mockData = this.getMockQuote(symbol);
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Return mock data on error
      const mockData = this.getMockQuote(symbol);
      this.setCache(cacheKey, mockData);
      return mockData;
    }
  }

  async getQuoteFromAlphaVantage(symbol) {
    if (!ALPHA_VANTAGE_API_KEY) return null;

    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote) return null;

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        timestamp: new Date().toISOString(),
        source: 'alphavantage'
      };
    } catch (error) {
      console.error('Alpha Vantage error:', error);
      return null;
    }
  }

  async getQuoteFromFinnhub(symbol) {
    if (!FINNHUB_API_KEY) return null;

    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: symbol,
          token: FINNHUB_API_KEY
        }
      });

      const data = response.data;
      if (!data.c) return null;

      return {
        symbol: symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        volume: null,
        previousClose: data.pc,
        open: data.o,
        high: data.h,
        low: data.l,
        timestamp: new Date(data.t * 1000).toISOString(),
        source: 'finnhub'
      };
    } catch (error) {
      console.error('Finnhub error:', error);
      return null;
    }
  }

  async getQuoteFromPolygon(symbol) {
    if (!POLYGON_API_KEY) return null;

    try {
      const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev`, {
        params: {
          adjusted: 'true',
          apikey: POLYGON_API_KEY
        }
      });

      const data = response.data.results?.[0];
      if (!data) return null;

      return {
        symbol: symbol,
        price: data.c,
        change: data.c - data.o,
        changePercent: ((data.c - data.o) / data.o) * 100,
        volume: data.v,
        previousClose: data.c,
        open: data.o,
        high: data.h,
        low: data.l,
        timestamp: new Date(data.t).toISOString(),
        source: 'polygon'
      };
    } catch (error) {
      console.error('Polygon error:', error);
      return null;
    }
  }

  // Get historical data
  async getHistoricalData(symbol, interval = 'daily', outputSize = 'compact') {
    const cacheKey = `historical_${symbol}_${interval}_${outputSize}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Try real API if available
      if (ALPHA_VANTAGE_API_KEY) {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: interval === 'daily' ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_INTRADAY',
            symbol: symbol,
            interval: interval === 'daily' ? undefined : interval,
            outputsize: outputSize,
            apikey: ALPHA_VANTAGE_API_KEY
          }
        });

        const timeSeriesKey = interval === 'daily' 
          ? 'Time Series (Daily)' 
          : `Time Series (${interval})`;
        
        const timeSeries = response.data[timeSeriesKey];
        if (timeSeries) {
          const data = Object.entries(timeSeries).map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
          })).sort((a, b) => new Date(a.date) - new Date(b.date));

          this.setCache(cacheKey, data, 300000); // 5 minute cache for historical data
          return data;
        }
      }

      // Fallback to mock data
      const days = outputSize === 'compact' ? 30 : 100;
      const mockData = this.getMockHistoricalData(symbol, days);
      this.setCache(cacheKey, mockData, 300000);
      return mockData;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Return mock data on error
      const days = outputSize === 'compact' ? 30 : 100;
      const mockData = this.getMockHistoricalData(symbol, days);
      this.setCache(cacheKey, mockData, 300000);
      return mockData;
    }
  }

  // Search for symbols
  async searchSymbols(query) {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('API key not configured');
    }

    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: ALPHA_VANTAGE_API_KEY
        }
      });

      const matches = response.data.bestMatches || [];
      return matches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore'])
      }));
    } catch (error) {
      console.error('Error searching symbols:', error);
      throw error;
    }
  }

  // Get market news
  async getMarketNews(symbol = null, limit = 10) {
    try {
      const params = {
        token: FINNHUB_API_KEY,
        category: 'general'
      };

      if (symbol) {
        params.symbol = symbol;
      }

      const response = await axios.get('https://finnhub.io/api/v1/news', { params });
      
      return response.data.slice(0, limit).map(article => ({
        id: article.id,
        headline: article.headline,
        summary: article.summary,
        source: article.source,
        url: article.url,
        image: article.image,
        datetime: new Date(article.datetime * 1000).toISOString(),
        related: article.related
      }));
    } catch (error) {
      console.error('Error fetching market news:', error);
      return [];
    }
  }

  // Get crypto data
  async getCryptoQuote(symbol) {
    try {
      const response = await axios.get(`https://api.coinbase.com/v2/exchange-rates`, {
        params: {
          currency: symbol
        }
      });

      const rates = response.data.data.rates;
      const usdRate = parseFloat(rates.USD);

      return {
        symbol: symbol,
        price: usdRate,
        change: null, // Would need historical data to calculate
        changePercent: null,
        volume: null,
        timestamp: new Date().toISOString(),
        source: 'coinbase'
      };
    } catch (error) {
      console.error('Error fetching crypto quote:', error);
      throw error;
    }
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // WebSocket for real-time data
  subscribeToRealTimeData(symbols, callback) {
    if (!FINNHUB_API_KEY) {
      console.error('Finnhub API key required for real-time data');
      return null;
    }

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
    
    ws.onopen = () => {
      symbols.forEach(symbol => {
        ws.send(JSON.stringify({ type: 'subscribe', symbol }));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade') {
        callback(data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }

  // Mock data for demo purposes
  getMockQuote(symbol) {
    const mockPrices = {
      'AAPL': { base: 175.50, name: 'Apple Inc.' },
      'GOOGL': { base: 2750.00, name: 'Alphabet Inc.' },
      'MSFT': { base: 415.25, name: 'Microsoft Corporation' },
      'AMZN': { base: 3380.00, name: 'Amazon.com Inc.' },
      'TSLA': { base: 245.75, name: 'Tesla Inc.' },
      'NVDA': { base: 875.50, name: 'NVIDIA Corporation' },
      'META': { base: 485.25, name: 'Meta Platforms Inc.' },
      'NFLX': { base: 425.75, name: 'Netflix Inc.' },
      'SPY': { base: 445.50, name: 'SPDR S&P 500 ETF' },
      'QQQ': { base: 385.25, name: 'Invesco QQQ Trust' }
    };

    const stockData = mockPrices[symbol] || { base: 100 + Math.random() * 200, name: `${symbol} Corp.` };
    
    // Generate realistic price movement
    const volatility = 0.02; // 2% volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const currentPrice = stockData.base * (1 + randomChange);
    const previousClose = stockData.base;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    // Generate realistic OHLC data
    const high = currentPrice + (Math.random() * currentPrice * 0.01);
    const low = currentPrice - (Math.random() * currentPrice * 0.01);
    const open = previousClose + (Math.random() - 0.5) * change * 0.5;
    const volume = Math.floor(Math.random() * 10000000) + 1000000; // 1M to 11M volume

    return {
      symbol: symbol,
      name: stockData.name,
      price: parseFloat(currentPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: volume,
      previousClose: parseFloat(previousClose.toFixed(2)),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      timestamp: new Date().toISOString(),
      source: 'mock',
      marketCap: Math.floor(Math.random() * 1000000000000), // Random market cap
      pe: parseFloat((15 + Math.random() * 20).toFixed(2)), // P/E ratio 15-35
      dividend: parseFloat((Math.random() * 5).toFixed(2)), // Dividend yield 0-5%
      beta: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)) // Beta 0.5-2.0
    };
  }

  // Mock historical data
  getMockHistoricalData(symbol, days = 30) {
    const data = [];
    const basePrice = this.getMockQuote(symbol).price;
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const volatility = 0.02;
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      currentPrice = currentPrice * (1 + randomChange);
      
      const high = currentPrice * (1 + Math.random() * 0.02);
      const low = currentPrice * (1 - Math.random() * 0.02);
      const open = i === days ? basePrice : data[data.length - 1]?.close || currentPrice;
      const volume = Math.floor(Math.random() * 5000000) + 1000000;

      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(currentPrice.toFixed(2)),
        volume: volume
      });
    }

    return data;
  }
}

export default new MarketDataService();