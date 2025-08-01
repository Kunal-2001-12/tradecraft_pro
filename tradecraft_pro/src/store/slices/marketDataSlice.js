import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import marketDataService from '../../services/marketData';

// Async thunks
export const fetchQuote = createAsyncThunk(
  'marketData/fetchQuote',
  async (symbol, { rejectWithValue }) => {
    try {
      const quote = await marketDataService.getQuote(symbol);
      return { symbol, quote };
    } catch (error) {
      return rejectWithValue({ symbol, error: error.message });
    }
  }
);

export const fetchMultipleQuotes = createAsyncThunk(
  'marketData/fetchMultipleQuotes',
  async (symbols, { rejectWithValue }) => {
    try {
      const quotes = await Promise.allSettled(
        symbols.map(symbol => marketDataService.getQuote(symbol))
      );
      
      const results = {};
      quotes.forEach((result, index) => {
        const symbol = symbols[index];
        if (result.status === 'fulfilled') {
          results[symbol] = result.value;
        } else {
          results[symbol] = { error: result.reason.message };
        }
      });
      
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHistoricalData = createAsyncThunk(
  'marketData/fetchHistoricalData',
  async ({ symbol, interval, outputSize }, { rejectWithValue }) => {
    try {
      const data = await marketDataService.getHistoricalData(symbol, interval, outputSize);
      return { symbol, interval, data };
    } catch (error) {
      return rejectWithValue({ symbol, error: error.message });
    }
  }
);

export const searchSymbols = createAsyncThunk(
  'marketData/searchSymbols',
  async (query, { rejectWithValue }) => {
    try {
      const results = await marketDataService.searchSymbols(query);
      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMarketNews = createAsyncThunk(
  'marketData/fetchMarketNews',
  async ({ symbol, limit }, { rejectWithValue }) => {
    try {
      const news = await marketDataService.getMarketNews(symbol, limit);
      return news;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  quotes: {},
  historicalData: {},
  searchResults: [],
  news: [],
  watchlist: JSON.parse(localStorage.getItem('watchlist') || '["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]'),
  loading: {
    quotes: false,
    historical: false,
    search: false,
    news: false,
  },
  errors: {
    quotes: null,
    historical: null,
    search: null,
    news: null,
  },
  lastUpdated: {},
  realTimeConnected: false,
  realTimeData: {},
};

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = {
        quotes: null,
        historical: null,
        search: null,
        news: null,
      };
    },
    addToWatchlist: (state, action) => {
      const symbol = action.payload.toUpperCase();
      if (!state.watchlist.includes(symbol)) {
        state.watchlist.push(symbol);
        localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      }
    },
    removeFromWatchlist: (state, action) => {
      const symbol = action.payload.toUpperCase();
      state.watchlist = state.watchlist.filter(s => s !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    },
    updateRealTimeData: (state, action) => {
      const { symbol, data } = action.payload;
      state.realTimeData[symbol] = {
        ...state.realTimeData[symbol],
        ...data,
        timestamp: new Date().toISOString(),
      };
    },
    setRealTimeConnected: (state, action) => {
      state.realTimeConnected = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateQuoteInRealTime: (state, action) => {
      const { symbol, price, change, changePercent } = action.payload;
      if (state.quotes[symbol]) {
        state.quotes[symbol] = {
          ...state.quotes[symbol],
          price,
          change,
          changePercent,
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quote
      .addCase(fetchQuote.pending, (state) => {
        state.loading.quotes = true;
        state.errors.quotes = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading.quotes = false;
        const { symbol, quote } = action.payload;
        state.quotes[symbol] = quote;
        state.lastUpdated[symbol] = new Date().toISOString();
        state.errors.quotes = null;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading.quotes = false;
        state.errors.quotes = action.payload.error;
      })
      // Fetch Multiple Quotes
      .addCase(fetchMultipleQuotes.pending, (state) => {
        state.loading.quotes = true;
        state.errors.quotes = null;
      })
      .addCase(fetchMultipleQuotes.fulfilled, (state, action) => {
        state.loading.quotes = false;
        const quotes = action.payload;
        Object.entries(quotes).forEach(([symbol, quote]) => {
          if (!quote.error) {
            state.quotes[symbol] = quote;
            state.lastUpdated[symbol] = new Date().toISOString();
          }
        });
        state.errors.quotes = null;
      })
      .addCase(fetchMultipleQuotes.rejected, (state, action) => {
        state.loading.quotes = false;
        state.errors.quotes = action.payload;
      })
      // Fetch Historical Data
      .addCase(fetchHistoricalData.pending, (state) => {
        state.loading.historical = true;
        state.errors.historical = null;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.loading.historical = false;
        const { symbol, interval, data } = action.payload;
        if (!state.historicalData[symbol]) {
          state.historicalData[symbol] = {};
        }
        state.historicalData[symbol][interval] = data;
        state.errors.historical = null;
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.loading.historical = false;
        state.errors.historical = action.payload.error;
      })
      // Search Symbols
      .addCase(searchSymbols.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(searchSymbols.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
        state.errors.search = null;
      })
      .addCase(searchSymbols.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
        state.searchResults = [];
      })
      // Fetch Market News
      .addCase(fetchMarketNews.pending, (state) => {
        state.loading.news = true;
        state.errors.news = null;
      })
      .addCase(fetchMarketNews.fulfilled, (state, action) => {
        state.loading.news = false;
        state.news = action.payload;
        state.errors.news = null;
      })
      .addCase(fetchMarketNews.rejected, (state, action) => {
        state.loading.news = false;
        state.errors.news = action.payload;
      });
  },
});

export const {
  clearErrors,
  addToWatchlist,
  removeFromWatchlist,
  updateRealTimeData,
  setRealTimeConnected,
  clearSearchResults,
  updateQuoteInRealTime,
} = marketDataSlice.actions;

export default marketDataSlice.reducer;