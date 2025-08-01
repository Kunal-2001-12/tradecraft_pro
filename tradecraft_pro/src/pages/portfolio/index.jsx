import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { fetchPortfolio, resetPaperAccount } from '../../store/slices/portfolioSlice';
import { fetchMultipleQuotes } from '../../store/slices/marketDataSlice';
import { setPerformanceMetrics } from '../../store/slices/portfolioSlice';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Portfolio = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const { 
    totalValue, 
    cash, 
    dayChange, 
    dayChangePercent, 
    positions, 
    balance,
    performance,
    loading 
  } = useSelector((state) => state.portfolio);

  const [viewMode, setViewMode] = useState('positions'); // 'positions', 'performance', 'history'

  useEffect(() => {
    loadPortfolioData();
    
    // Update performance metrics
    const metrics = {
      totalReturn: totalValue - 100000, // Starting amount
      totalReturnPercent: ((totalValue - 100000) / 100000) * 100,
      totalTrades: Math.floor(Math.random() * 100) + 50,
      winningTrades: Math.floor(Math.random() * 60) + 30,
      winRate: (Math.random() * 40) + 40, // 40-80%
      sharpeRatio: Math.random() * 2,
      maxDrawdown: Math.random() * 15,
      volatility: Math.random() * 25
    };
    dispatch(setPerformanceMetrics(metrics));
  }, [dispatch, totalValue]);

  const loadPortfolioData = async () => {
    try {
      await dispatch(fetchPortfolio());
      
      // Get quotes for all positions
      const symbols = positions.map(p => p.symbol);
      if (symbols.length > 0) {
        await dispatch(fetchMultipleQuotes(symbols));
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    }
  };

  const handleResetAccount = async () => {
    if (window.confirm('Are you sure you want to reset your paper trading account? This will clear all positions and reset your balance to $100,000.')) {
      await dispatch(resetPaperAccount());
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className={`transition-all duration-300 ease-out ${
          sidebarCollapsed ? 'ml-16' : 'ml-80'
        } mt-16`}>
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 ease-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-80'
      } mt-16`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
              <p className="text-muted-foreground mt-1">
                Manage your positions and track performance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={loadPortfolioData}
                variant="outline"
                size="sm"
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleResetAccount}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Reset Account
              </Button>
            </div>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Cash</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(cash)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Day Change</p>
                  <p className={`text-2xl font-bold ${dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(dayChange)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  dayChange >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Icon 
                    name={dayChange >= 0 ? 'ArrowUp' : 'ArrowDown'} 
                    size={24} 
                    className={dayChange >= 0 ? 'text-green-600' : 'text-red-600'} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Return</p>
                  <p className={`text-2xl font-bold ${performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercent(performance.totalReturnPercent)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  performance.totalReturn >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Icon 
                    name="Target" 
                    size={24} 
                    className={performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 mb-6 bg-muted rounded-lg p-1">
            {[
              { key: 'positions', label: 'Positions', icon: 'PieChart' },
              { key: 'performance', label: 'Performance', icon: 'TrendingUp' },
              { key: 'history', label: 'History', icon: 'Clock' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setViewMode(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on view mode */}
          {viewMode === 'positions' && (
            <div className="bg-card border border-border rounded-lg">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Current Positions</h2>
              </div>
              
              {positions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Icon name="PieChart" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No positions</p>
                  <p>Start trading to see your positions here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Symbol</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Quantity</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Avg Price</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Current Price</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Market Value</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">P&L</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">P&L %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((position) => {
                        const pnl = position.unrealizedPnL || 0;
                        const pnlPercent = position.averagePrice > 0 
                          ? ((position.currentPrice - position.averagePrice) / position.averagePrice) * 100 
                          : 0;
                        
                        return (
                          <tr key={position.symbol} className="border-t border-border hover:bg-muted/25">
                            <td className="p-4">
                              <div className="font-medium text-foreground">{position.symbol}</div>
                            </td>
                            <td className="p-4 text-right text-foreground">{position.quantity}</td>
                            <td className="p-4 text-right text-foreground">
                              {formatCurrency(position.averagePrice)}
                            </td>
                            <td className="p-4 text-right text-foreground">
                              {formatCurrency(position.currentPrice || position.averagePrice)}
                            </td>
                            <td className="p-4 text-right text-foreground">
                              {formatCurrency(position.marketValue)}
                            </td>
                            <td className={`p-4 text-right font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {formatCurrency(pnl)}
                            </td>
                            <td className={`p-4 text-right font-medium ${pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {formatPercent(pnlPercent)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {viewMode === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Return</span>
                    <span className={`font-medium ${performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(performance.totalReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium text-foreground">{performance.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharpe Ratio</span>
                    <span className="font-medium text-foreground">{performance.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="font-medium text-red-500">-{performance.maxDrawdown.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volatility</span>
                    <span className="font-medium text-foreground">{performance.volatility.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Trading Statistics</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-medium text-foreground">{performance.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Winning Trades</span>
                    <span className="font-medium text-green-500">{performance.winningTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Losing Trades</span>
                    <span className="font-medium text-red-500">
                      {performance.totalTrades - performance.winningTrades}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Positions</span>
                    <span className="font-medium text-foreground">{positions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'history' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Account History</h2>
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Clock" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Account history feature coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;