import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { store } from './store';
import Routes from "./Routes";
import { loadPreferences } from './store/slices/uiSlice';
import ErrorBoundary from './components/ErrorBoundary';
import dbInitService from './services/dbInit';
import appHealthCheck from './utils/appHealthCheck';
import startupVerification from './utils/startupVerification';
import errorMonitor from './utils/errorMonitor';

function App() {
  const theme = localStorage.getItem('theme') || 'dark';

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    // Initialize database connection
    const initializeApp = async () => {
      try {
        // Run startup verification first
        const startupOk = await startupVerification.runStartupChecks();
        if (!startupOk) {
          console.warn('⚠️ Startup verification found issues, but continuing...');
        }

        await dbInitService.initialize();
        // Load user preferences on app start
        store.dispatch(loadPreferences());
        
        // Run health check in development
        if (import.meta.env.DEV) {
          setTimeout(() => {
            appHealthCheck.quickCheck();
            // Display error report after 5 seconds
            setTimeout(() => {
              errorMonitor.displayErrorReport();
            }, 2000);
          }, 3000);
        }
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
