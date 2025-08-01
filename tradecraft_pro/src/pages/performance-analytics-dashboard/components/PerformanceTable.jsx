import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'totalReturn', direction: 'desc' });
  const [selectedTab, setSelectedTab] = useState('strategies');

  const tabs = [
    { id: 'strategies', label: 'Strategies', icon: 'TrendingUp' },
    { id: 'trades', label: 'Recent Trades', icon: 'Activity' },
    { id: 'metrics', label: 'Risk Metrics', icon: 'Shield' }
  ];

  // Mock strategy performance data
  const strategyData = [
    {
      id: 1,
      name: 'Momentum Breakout',
      totalReturn: 24.5,
      sharpeRatio: 1.85,
      maxDrawdown: -8.2,
      winRate: 68.5,
      trades: 142,
      avgTrade: 0.85,
      status: 'active'
    },
    {
      id: 2,
      name: 'Mean Reversion',
      totalReturn: 18.3,
      sharpeRatio: 1.42,
      maxDrawdown: -12.1,
      winRate: 72.1,
      trades: 89,
      avgTrade: 1.12,
      status: 'active'
    },
    {
      id: 3,
      name: 'Trend Following',
      totalReturn: 31.2,
      sharpeRatio: 2.01,
      maxDrawdown: -6.8,
      winRate: 61.3,
      trades: 76,
      avgTrade: 1.85,
      status: 'active'
    },
    {
      id: 4,
      name: 'Scalping Strategy',
      totalReturn: 15.7,
      sharpeRatio: 1.23,
      maxDrawdown: -15.4,
      winRate: 78.9,
      trades: 324,
      avgTrade: 0.32,
      status: 'paused'
    },
    {
      id: 5,
      name: 'Swing Trading',
      totalReturn: 22.1,
      sharpeRatio: 1.67,
      maxDrawdown: -9.5,
      winRate: 65.2,
      trades: 54,
      avgTrade: 2.14,
      status: 'active'
    }
  ];

  // Mock recent trades data
  const tradesData = [
    {
      id: 1,
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 100,
      price: 185.42,
      pnl: 245.80,
      timestamp: '2024-07-30 09:15:23',
      strategy: 'Momentum Breakout'
    },
    {
      id: 2,
      symbol: 'MSFT',
      side: 'SELL',
      quantity: 50,
      price: 412.15,
      pnl: -128.50,
      timestamp: '2024-07-30 08:45:12',
      strategy: 'Mean Reversion'
    },
    {
      id: 3,
      symbol: 'GOOGL',
      side: 'BUY',
      quantity: 25,
      price: 2785.30,
      pnl: 892.40,
      timestamp: '2024-07-30 08:32:45',
      strategy: 'Trend Following'
    },
    {
      id: 4,
      symbol: 'TSLA',
      side: 'SELL',
      quantity: 75,
      price: 248.92,
      pnl: 156.75,
      timestamp: '2024-07-30 08:18:56',
      strategy: 'Swing Trading'
    },
    {
      id: 5,
      symbol: 'NVDA',
      side: 'BUY',
      quantity: 30,
      price: 118.85,
      pnl: 67.20,
      timestamp: '2024-07-30 08:05:33',
      strategy: 'Scalping Strategy'
    }
  ];

  // Mock risk metrics data
  const riskMetricsData = [
    {
      metric: 'Value at Risk (95%)',
      value: '$12,450',
      change: '+2.3%',
      status: 'warning'
    },
    {
      metric: 'Expected Shortfall',
      value: '$18,920',
      change: '+1.8%',
      status: 'error'
    },
    {
      metric: 'Beta to Market',
      value: '1.24',
      change: '-0.05',
      status: 'neutral'
    },
    {
      metric: 'Correlation to SPY',
      value: '0.78',
      change: '+0.02',
      status: 'neutral'
    },
    {
      metric: 'Volatility (30d)',
      value: '18.5%',
      change: '-1.2%',
      status: 'positive'
    },
    {
      metric: 'Skewness',
      value: '-0.15',
      change: '+0.08',
      status: 'neutral'
    }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...strategyData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'paused': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderStrategiesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center space-x-1 hover:text-foreground"
              >
                <span>Strategy</span>
                <Icon name={getSortIcon('name')} size={14} />
              </button>
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('totalReturn')}
                className="flex items-center space-x-1 hover:text-foreground ml-auto"
              >
                <span>Total Return</span>
                <Icon name={getSortIcon('totalReturn')} size={14} />
              </button>
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('sharpeRatio')}
                className="flex items-center space-x-1 hover:text-foreground ml-auto"
              >
                <span>Sharpe</span>
                <Icon name={getSortIcon('sharpeRatio')} size={14} />
              </button>
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('maxDrawdown')}
                className="flex items-center space-x-1 hover:text-foreground ml-auto"
              >
                <span>Max DD</span>
                <Icon name={getSortIcon('maxDrawdown')} size={14} />
              </button>
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('winRate')}
                className="flex items-center space-x-1 hover:text-foreground ml-auto"
              >
                <span>Win Rate</span>
                <Icon name={getSortIcon('winRate')} size={14} />
              </button>
            </th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">
              <button
                onClick={() => handleSort('trades')}
                className="flex items-center space-x-1 hover:text-foreground ml-auto"
              >
                <span>Trades</span>
                <Icon name={getSortIcon('trades')} size={14} />
              </button>
            </th>
            <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((strategy) => (
            <tr key={strategy.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="font-medium text-foreground">{strategy.name}</div>
                <div className="text-sm text-muted-foreground">
                  Avg: {formatPercentage(strategy.avgTrade)}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-medium ${strategy.totalReturn > 0 ? 'text-success' : 'text-error'}`}>
                  {formatPercentage(strategy.totalReturn)}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-medium text-foreground">
                {strategy.sharpeRatio.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                <span className="font-medium text-error">
                  {formatPercentage(strategy.maxDrawdown)}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-medium text-foreground">
                {strategy.winRate.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-right font-medium text-foreground">
                {strategy.trades}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                  {strategy.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTradesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
            <th className="text-center py-3 px-4 font-medium text-muted-foreground">Side</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">P&L</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Strategy</th>
          </tr>
        </thead>
        <tbody>
          {tradesData.map((trade) => (
            <tr key={trade.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4 font-medium text-foreground">{trade.symbol}</td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.side === 'BUY' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {trade.side}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-medium text-foreground">{trade.quantity}</td>
              <td className="py-3 px-4 text-right font-medium text-foreground">
                {formatCurrency(trade.price)}
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-medium ${trade.pnl > 0 ? 'text-success' : 'text-error'}`}>
                  {formatCurrency(trade.pnl)}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">{trade.timestamp}</td>
              <td className="py-3 px-4 text-sm text-muted-foreground">{trade.strategy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRiskMetricsTable = () => (
    <div className="space-y-3">
      {riskMetricsData.map((metric, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <div className="font-medium text-foreground">{metric.metric}</div>
            <div className="text-sm text-muted-foreground">Current value</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">{metric.value}</div>
            <div className={`text-sm font-medium ${
              metric.status === 'positive' ? 'text-success' :
              metric.status === 'error' ? 'text-error' :
              metric.status === 'warning'? 'text-warning' : 'text-muted-foreground'
            }`}>
              {metric.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Performance Details</h3>
          <p className="text-sm text-muted-foreground">Detailed breakdown of strategy performance</p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export Data
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              selectedTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="min-h-[400px]">
        {selectedTab === 'strategies' && renderStrategiesTable()}
        {selectedTab === 'trades' && renderTradesTable()}
        {selectedTab === 'metrics' && renderRiskMetricsTable()}
      </div>
    </div>
  );
};

export default PerformanceTable;