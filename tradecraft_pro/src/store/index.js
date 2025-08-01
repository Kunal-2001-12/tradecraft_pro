import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import portfolioSlice from './slices/portfolioSlice';
import marketDataSlice from './slices/marketDataSlice';
import strategiesSlice from './slices/strategiesSlice';
import ordersSlice from './slices/ordersSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    portfolio: portfolioSlice,
    marketData: marketDataSlice,
    strategies: strategiesSlice,
    orders: ordersSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript (commented out for JS project)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;