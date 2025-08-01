import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { fetchPortfolio, placeOrder } from '../../store/slices/portfolioSlice';
import { fetchMultipleQuotes, addToWatchlist } from '../../store/slices/marketDataSlice';
import { fetchOrderHistory, fetchOpenOrders } from '../../store/slices/ordersSlice';
import { openModal, closeModal } from '../../store/slices/uiSlice';
import TradingChart from './components/TradingChart';
import OrderEntry from './components/OrderEntry';
import OrderBook from './components/OrderBook';
import PositionsTable from './components/PositionsTable';
import OrdersTable from './components/OrdersTable';
import TradingWatchlist from './components/TradingWatchlist';
import MarketDepth from './components/MarketDepth';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TradingDashboard = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { modals } = useSelector((state) => state.ui);
  const { positions, loading: portfolioLoading } = useSelector((state) => state.portfolio);
  const { watchlist, quotes } = useSelector((state) => state.marketData);
  const { orderHistory, openOrders } = useSelector((state) => state.orders);

  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [layoutConfig, setLayoutConfig] = useState({
    showChart: true,
    showOrderBook: true,
    showMarketDepth: true,
    chartHeight: 400,
  });

  useEffect(() => {
    // Load initial trading data
    loadTradingData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (watchlist.length > 0) {
        dispatch(fetchMultipleQuotes(watchlist));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const loadTradingData = async () => {
    try {
      await Promise.all([
        dispatch(fetchPortfolio()),
        dispatch(fetchOrderHistory(50)),
        dispatch(fetchOpenOrders()),
        dispatch(fetchMultipleQuotes(watchlist)),
      ]);
    } catch (error) {
      console.error('Error loading trading data:', error);
    }
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    // Add to watchlist if not already there
    if (!watchlist.includes(symbol)) {
      dispatch(addToWatchlist(symbol));
    }
  };

  const handleQuickTrade = (side) => {
    dispatch(openModal('orderEntry'));
    // You would also set the order side and symbol in the modal state
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      await dispatch(placeOrder({
        ...orderData,
        symbol: selectedSymbol,
      })).unwrap();
      
      dispatch(closeModal('orderEntry'));
      // Refresh data after order placement
      loadTradingData();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const toggleLayoutPanel = (panel) => {
    setLayoutConfig(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 ease-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-80'
      } mt-16`}>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Trading Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Trading Dashboard</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Market Open</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quick Trade Buttons */}
              <Button
                onClick={() => handleQuickTrade('buy')}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Icon name="TrendingUp" size={16} className="mr-1" />
                Quick Buy
              </Button>
              <Button
                onClick={() => handleQuickTrade('sell')}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <Icon name="TrendingDown" size={16} className="mr-1" />
                Quick Sell
              </Button>
              
              {/* Layout Controls */}
              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={() => toggleLayoutPanel('showChart')}
                  className={`p-2 rounded-md transition-colors ${
                    layoutConfig.showChart ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                  title="Toggle Chart"
                >
                  <Icon name="BarChart3" size={16} />
                </button>
                <button
                  onClick={() => toggleLayoutPanel('showOrderBook')}
                  className={`p-2 rounded-md transition-colors ${
                    layoutConfig.showOrderBook ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                  title="Toggle Order Book"
                >
                  <Icon name="BookOpen" size={16} />
                </button>
                <button
                  onClick={() => toggleLayoutPanel('showMarketDepth')}
                  className={`p-2 rounded-md transition-colors ${
                    layoutConfig.showMarketDepth ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                  title="Toggle Market Depth"
                >
                  <Icon name="Activity" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Trading Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Watchlist */}
            <div className="w-80 border-r border-border bg-card">
              <TradingWatchlist
                selectedSymbol={selectedSymbol}
                onSymbolSelect={handleSymbolSelect}
              />
            </div>

            {/* Center Panel - Chart and Trading */}
            <div className="flex-1 flex flex-col">
              {/* Chart */}
              {layoutConfig.showChart && (
                <div className="border-b border-border" style={{ height: `${layoutConfig.chartHeight}px` }}>
                  <TradingChart
                    symbol={selectedSymbol}
                    height={layoutConfig.chartHeight}
                  />
                </div>
              )}

              {/* Order Entry */}
              <div className="border-b border-border bg-card">
                <OrderEntry
                  symbol={selectedSymbol}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>

              {/* Positions and Orders Tables */}
              <div className="flex-1 flex">
                <div className="flex-1 border-r border-border">
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <PositionsTable positions={positions} />
                    </div>
                    <div className="flex-1 border-t border-border">
                      <OrdersTable 
                        orders={[...openOrders, ...orderHistory.slice(0, 10)]}
                        onCancelOrder={(orderId) => {
                          // Handle order cancellation
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Order Book and Market Depth */}
            <div className="w-80 border-l border-border bg-card flex flex-col">
              {layoutConfig.showOrderBook && (
                <div className="flex-1 border-b border-border">
                  <OrderBook symbol={selectedSymbol} />
                </div>
              )}
              
              {layoutConfig.showMarketDepth && (
                <div className="flex-1">
                  <MarketDepth symbol={selectedSymbol} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Entry Modal */}
      {modals.orderEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Place Order</h2>
              <button
                onClick={() => dispatch(closeModal('orderEntry'))}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <OrderEntry
              symbol={selectedSymbol}
              onPlaceOrder={handlePlaceOrder}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingDashboard;