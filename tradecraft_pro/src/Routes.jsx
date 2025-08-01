import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import BacktestingDashboard from './pages/backtesting-dashboard';
import StrategyOptimizationEngine from './pages/strategy-optimization-engine';
import TradeVerificationCenter from './pages/trade-verification-center';
import StrategyBuilder from './pages/strategy-builder';
import PerformanceAnalyticsDashboard from './pages/performance-analytics-dashboard';
import TradingDashboard from './pages/trading-dashboard';
import Portfolio from './pages/portfolio';
import Settings from './pages/settings';
import NotFound from './pages/NotFound';

const Routes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/trading" element={
          <ProtectedRoute>
            <TradingDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />
        
        <Route path="/strategy-builder" element={
          <ProtectedRoute>
            <StrategyBuilder />
          </ProtectedRoute>
        } />
        
        <Route path="/backtesting-dashboard" element={
          <ProtectedRoute>
            <BacktestingDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/strategy-optimization-engine" element={
          <ProtectedRoute>
            <StrategyOptimizationEngine />
          </ProtectedRoute>
        } />
        
        <Route path="/trade-verification-center" element={
          <ProtectedRoute>
            <TradeVerificationCenter />
          </ProtectedRoute>
        } />
        
        <Route path="/performance-analytics-dashboard" element={
          <ProtectedRoute>
            <PerformanceAnalyticsDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;