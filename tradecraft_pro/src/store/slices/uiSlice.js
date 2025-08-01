import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  theme: localStorage.getItem('theme') || 'dark',
  notifications: [],
  modals: {
    orderEntry: false,
    strategyPreview: false,
    backtestResults: false,
    settings: false,
    help: false,
  },
  alerts: [],
  loading: {
    global: false,
  },
  layout: {
    chartHeight: 400,
    watchlistVisible: true,
    newsVisible: true,
    ordersVisible: true,
  },
  preferences: {
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    soundEnabled: true,
    notificationsEnabled: true,
    compactMode: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    addAlert: (state, action) => {
      const alert = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.alerts.push(alert);
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    updateLayout: (state, action) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    loadPreferences: (state) => {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        try {
          state.preferences = { ...state.preferences, ...JSON.parse(saved) };
        } catch (error) {
          console.error('Error loading preferences:', error);
        }
      }
    },
    resetLayout: (state) => {
      state.layout = {
        chartHeight: 400,
        watchlistVisible: true,
        newsVisible: true,
        ordersVisible: true,
      };
    },
    showToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: new Date().toISOString(),
      };
      
      // Add to notifications as well
      state.notifications.unshift({
        ...toast,
        title: action.payload.title || 'Notification',
        read: false,
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  toggleTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  openModal,
  closeModal,
  closeAllModals,
  addAlert,
  removeAlert,
  clearAlerts,
  setGlobalLoading,
  updateLayout,
  updatePreferences,
  loadPreferences,
  resetLayout,
  showToast,
} = uiSlice.actions;

export default uiSlice.reducer;