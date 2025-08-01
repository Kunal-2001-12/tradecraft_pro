import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for strategy management
export const saveStrategy = createAsyncThunk(
  'strategies/saveStrategy',
  async (strategyData, { rejectWithValue }) => {
    try {
      // In a real app, this would save to a backend
      const strategy = {
        ...strategyData,
        id: strategyData.id || `strategy_${Date.now()}`,
        createdAt: strategyData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage for now
      const savedStrategies = JSON.parse(localStorage.getItem('strategies') || '[]');
      const existingIndex = savedStrategies.findIndex(s => s.id === strategy.id);
      
      if (existingIndex !== -1) {
        savedStrategies[existingIndex] = strategy;
      } else {
        savedStrategies.push(strategy);
      }
      
      localStorage.setItem('strategies', JSON.stringify(savedStrategies));
      return strategy;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadStrategies = createAsyncThunk(
  'strategies/loadStrategies',
  async (_, { rejectWithValue }) => {
    try {
      const savedStrategies = JSON.parse(localStorage.getItem('strategies') || '[]');
      return savedStrategies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStrategy = createAsyncThunk(
  'strategies/deleteStrategy',
  async (strategyId, { rejectWithValue }) => {
    try {
      const savedStrategies = JSON.parse(localStorage.getItem('strategies') || '[]');
      const filteredStrategies = savedStrategies.filter(s => s.id !== strategyId);
      localStorage.setItem('strategies', JSON.stringify(filteredStrategies));
      return strategyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const runBacktest = createAsyncThunk(
  'strategies/runBacktest',
  async ({ strategyId, backtestParams }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const strategy = state.strategies.strategies.find(s => s.id === strategyId);
      
      if (!strategy) {
        throw new Error('Strategy not found');
      }

      // Simulate backtest execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock backtest results
      const results = {
        id: `backtest_${Date.now()}`,
        strategyId,
        strategyName: strategy.name,
        startDate: backtestParams.startDate,
        endDate: backtestParams.endDate,
        initialCapital: backtestParams.initialCapital || 100000,
        finalValue: 100000 + (Math.random() * 50000 - 25000), // Random P&L
        totalReturn: 0,
        totalReturnPercent: 0,
        maxDrawdown: Math.random() * 20,
        sharpeRatio: Math.random() * 3,
        winRate: 40 + Math.random() * 40, // 40-80%
        totalTrades: Math.floor(Math.random() * 500) + 100,
        winningTrades: 0,
        losingTrades: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 1 + Math.random() * 2,
        volatility: Math.random() * 30,
        beta: Math.random() * 2,
        alpha: Math.random() * 10 - 5,
        trades: [],
        equity: [],
        drawdown: [],
        monthlyReturns: [],
        createdAt: new Date().toISOString(),
      };

      // Calculate derived metrics
      results.totalReturn = results.finalValue - results.initialCapital;
      results.totalReturnPercent = (results.totalReturn / results.initialCapital) * 100;
      results.winningTrades = Math.floor(results.totalTrades * (results.winRate / 100));
      results.losingTrades = results.totalTrades - results.winningTrades;
      results.averageWin = Math.random() * 500 + 100;
      results.averageLoss = -(Math.random() * 300 + 50);

      // Generate sample trades
      for (let i = 0; i < Math.min(results.totalTrades, 100); i++) {
        const isWin = Math.random() < (results.winRate / 100);
        results.trades.push({
          id: i + 1,
          symbol: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'][Math.floor(Math.random() * 5)],
          side: Math.random() > 0.5 ? 'buy' : 'sell',
          quantity: Math.floor(Math.random() * 100) + 1,
          entryPrice: 100 + Math.random() * 200,
          exitPrice: 0,
          entryDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          exitDate: new Date(Date.now() - Math.random() * 300 * 24 * 60 * 60 * 1000).toISOString(),
          pnl: isWin ? results.averageWin : results.averageLoss,
          pnlPercent: isWin ? Math.random() * 10 : -(Math.random() * 5),
          commission: 0,
          duration: Math.floor(Math.random() * 30) + 1, // days
        });
      }

      // Generate equity curve
      let equity = results.initialCapital;
      for (let i = 0; i < 252; i++) { // Trading days in a year
        const dailyReturn = (Math.random() - 0.5) * 0.04; // ±2% daily return
        equity *= (1 + dailyReturn);
        results.equity.push({
          date: new Date(Date.now() - (252 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: equity,
          return: dailyReturn * 100,
        });
      }

      // Save backtest results
      const savedBacktests = JSON.parse(localStorage.getItem('backtests') || '[]');
      savedBacktests.push(results);
      localStorage.setItem('backtests', JSON.stringify(savedBacktests));

      return results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadBacktests = createAsyncThunk(
  'strategies/loadBacktests',
  async (_, { rejectWithValue }) => {
    try {
      const savedBacktests = JSON.parse(localStorage.getItem('backtests') || '[]');
      return savedBacktests;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  strategies: [],
  backtests: [],
  currentStrategy: null,
  currentBacktest: null,
  loading: {
    strategies: false,
    backtests: false,
    saving: false,
    backtesting: false,
  },
  error: null,
  backtestProgress: 0,
};

const strategiesSlice = createSlice({
  name: 'strategies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStrategy: (state, action) => {
      state.currentStrategy = action.payload;
    },
    setCurrentBacktest: (state, action) => {
      state.currentBacktest = action.payload;
    },
    updateBacktestProgress: (state, action) => {
      state.backtestProgress = action.payload;
    },
    clearCurrentStrategy: (state) => {
      state.currentStrategy = null;
    },
    clearCurrentBacktest: (state) => {
      state.currentBacktest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Strategy
      .addCase(saveStrategy.pending, (state) => {
        state.loading.saving = true;
        state.error = null;
      })
      .addCase(saveStrategy.fulfilled, (state, action) => {
        state.loading.saving = false;
        const strategy = action.payload;
        const existingIndex = state.strategies.findIndex(s => s.id === strategy.id);
        
        if (existingIndex !== -1) {
          state.strategies[existingIndex] = strategy;
        } else {
          state.strategies.push(strategy);
        }
        
        state.currentStrategy = strategy;
        state.error = null;
      })
      .addCase(saveStrategy.rejected, (state, action) => {
        state.loading.saving = false;
        state.error = action.payload;
      })
      // Load Strategies
      .addCase(loadStrategies.pending, (state) => {
        state.loading.strategies = true;
        state.error = null;
      })
      .addCase(loadStrategies.fulfilled, (state, action) => {
        state.loading.strategies = false;
        state.strategies = action.payload;
        state.error = null;
      })
      .addCase(loadStrategies.rejected, (state, action) => {
        state.loading.strategies = false;
        state.error = action.payload;
      })
      // Delete Strategy
      .addCase(deleteStrategy.pending, (state) => {
        state.loading.strategies = true;
        state.error = null;
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.loading.strategies = false;
        const strategyId = action.payload;
        state.strategies = state.strategies.filter(s => s.id !== strategyId);
        
        if (state.currentStrategy?.id === strategyId) {
          state.currentStrategy = null;
        }
        
        state.error = null;
      })
      .addCase(deleteStrategy.rejected, (state, action) => {
        state.loading.strategies = false;
        state.error = action.payload;
      })
      // Run Backtest
      .addCase(runBacktest.pending, (state) => {
        state.loading.backtesting = true;
        state.backtestProgress = 0;
        state.error = null;
      })
      .addCase(runBacktest.fulfilled, (state, action) => {
        state.loading.backtesting = false;
        state.backtestProgress = 100;
        const backtest = action.payload;
        state.backtests.push(backtest);
        state.currentBacktest = backtest;
        state.error = null;
      })
      .addCase(runBacktest.rejected, (state, action) => {
        state.loading.backtesting = false;
        state.backtestProgress = 0;
        state.error = action.payload;
      })
      // Load Backtests
      .addCase(loadBacktests.pending, (state) => {
        state.loading.backtests = true;
        state.error = null;
      })
      .addCase(loadBacktests.fulfilled, (state, action) => {
        state.loading.backtests = false;
        state.backtests = action.payload;
        state.error = null;
      })
      .addCase(loadBacktests.rejected, (state, action) => {
        state.loading.backtests = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentStrategy,
  setCurrentBacktest,
  updateBacktestProgress,
  clearCurrentStrategy,
  clearCurrentBacktest,
} = strategiesSlice.actions;

export default strategiesSlice.reducer;