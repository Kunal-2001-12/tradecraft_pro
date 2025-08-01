import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { fetchPortfolio } from '../../store/slices/portfolioSlice';
import { fetchMultipleQuotes } from '../../store/slices/marketDataSlice';
import { fetchMarketNews } from '../../store/slices/marketDataSlice';
import PortfolioSummary from './components/PortfolioSummary';
import MarketOverview from './components/MarketOverview';
import Watchlist from './components/Watchlist';
import RecentTrades from './components/RecentTrades';
import MarketNews from './components/MarketNews';
import QuickActions from './components/QuickActions';
import PerformanceChart from './components/PerformanceChart';
import Icon from '../../components/AppIcon';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { totalValue, dayChange, dayChangePercent, loading: portfolioLoading } = useSelector((state) => state.portfolio);
  const { watchlist, quotes, loading: marketLoading } = useSelector((state) => state.marketData);
  const { user } = useSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      // Load portfolio data
      await dispatch(fetchPortfolio());
      
      // Load market data for watchlist
      if (watchlist.length > 0) {
        await dispatch(fetchMultipleQuotes(watchlist));
      }
      
      // Load market news
      await dispatch(fetchMarketNews({ limit: 10 }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 ease-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-80'
      } mt-16`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user?.firstName || 'Trader'}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your trading overview for today
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Icon 
                  name={refreshing ? "LoaderCircle" : "RefreshCw"} 
                  size={16} 
                  className={refreshing ? "animate-spin" : ""} 
                />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="mb-8">
            <PortfolioSummary />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Market Overview & Performance */}
            <div className="lg:col-span-2 space-y-6">
              <MarketOverview />
              <PerformanceChart />
            </div>
            
            {/* Right Column - Watchlist & Quick Actions */}
            <div className="space-y-6">
              <QuickActions />
              <Watchlist />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTrades />
            <MarketNews />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;