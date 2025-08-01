import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tradingService from '../../services/trading';

// Async thunks
export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchOrderHistory',
  async (limit, { rejectWithValue }) => {
    try {
      const orders = tradingService.getOrderHistory(limit);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOpenOrders = createAsyncThunk(
  'orders/fetchOpenOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = tradingService.getOpenOrders();
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orderHistory: [],
  openOrders: [],
  loading: {
    history: false,
    open: false,
  },
  error: null,
  lastUpdated: null,
  filters: {
    status: 'all', // 'all', 'filled', 'open', 'cancelled'
    side: 'all', // 'all', 'buy', 'sell'
    symbol: '',
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        side: 'all',
        symbol: '',
        dateRange: {
          start: null,
          end: null,
        },
      };
    },
    addOrder: (state, action) => {
      const order = action.payload;
      state.orderHistory.unshift(order);
      if (order.status === 'open' || order.status === 'pending') {
        state.openOrders.unshift(order);
      }
    },
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;
      
      // Update in order history
      const historyIndex = state.orderHistory.findIndex(order => order.id === updatedOrder.id);
      if (historyIndex !== -1) {
        state.orderHistory[historyIndex] = updatedOrder;
      }
      
      // Update in open orders
      const openIndex = state.openOrders.findIndex(order => order.id === updatedOrder.id);
      if (openIndex !== -1) {
        if (updatedOrder.status === 'open' || updatedOrder.status === 'pending') {
          state.openOrders[openIndex] = updatedOrder;
        } else {
          // Remove from open orders if status changed
          state.openOrders.splice(openIndex, 1);
        }
      }
    },
    removeOrder: (state, action) => {
      const orderId = action.payload;
      state.orderHistory = state.orderHistory.filter(order => order.id !== orderId);
      state.openOrders = state.openOrders.filter(order => order.id !== orderId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading.history = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.orderHistory = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload;
      })
      // Fetch Open Orders
      .addCase(fetchOpenOrders.pending, (state) => {
        state.loading.open = true;
        state.error = null;
      })
      .addCase(fetchOpenOrders.fulfilled, (state, action) => {
        state.loading.open = false;
        state.openOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchOpenOrders.rejected, (state, action) => {
        state.loading.open = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  addOrder,
  updateOrder,
  removeOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;