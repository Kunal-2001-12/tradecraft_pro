import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tradingService from '../../services/trading';
import portfolioService from '../../services/portfolio';

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      const portfolio = await portfolioService.getPortfolio(userId);
      return portfolio;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'portfolio/placeOrder',
  async (orderData, { rejectWithValue, dispatch, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      const order = await portfolioService.placeOrder(userId, orderData);
      // Refresh portfolio after order placement
      dispatch(fetchPortfolio());
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'portfolio/cancelOrder',
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      const order = await tradingService.cancelOrder(orderId);
      dispatch(fetchPortfolio());
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPaperAccount = createAsyncThunk(
  'portfolio/resetPaperAccount',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?.id;
      const resetPortfolio = await portfolioService.resetPaperAccount(userId);
      dispatch(fetchPortfolio());
      return resetPortfolio;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  totalValue: 0,
  cash: 0,
  dayChange: 0,
  dayChangePercent: 0,
  positions: [],
  balance: {
    cash: 0,
    equity: 0,
    buyingPower: 0,
    dayTradeCount: 0,
    marginUsed: 0
  },
  performance: {
    totalReturn: 0,
    totalReturnPercent: 0,
    totalTrades: 0,
    winningTrades: 0,
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    volatility: 0
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePosition: (state, action) => {
      const { symbol, data } = action.payload;
      const positionIndex = state.positions.findIndex(p => p.symbol === symbol);
      if (positionIndex !== -1) {
        state.positions[positionIndex] = { ...state.positions[positionIndex], ...data };
      }
    },
    setPerformanceMetrics: (state, action) => {
      state.performance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.totalValue = action.payload.totalValue;
        state.cash = action.payload.cash;
        state.dayChange = action.payload.dayChange;
        state.dayChangePercent = action.payload.dayChangePercent;
        state.positions = action.payload.positions;
        state.balance = action.payload.balance;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Paper Account
      .addCase(resetPaperAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPaperAccount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPaperAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updatePosition, setPerformanceMetrics } = portfolioSlice.actions;
export default portfolioSlice.reducer;