import React from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';

const PortfolioSummary = () => {
  const { totalValue, cash, dayChange, dayChangePercent, loading } = useSelector((state) => state.portfolio);

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
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(totalValue),
      icon: 'TrendingUp',
      color: 'text-primary',
    },
    {
      label: 'Available Cash',
      value: formatCurrency(cash),
      icon: 'DollarSign',
      color: 'text-green-500',
    },
    {
      label: 'Day Change',
      value: formatCurrency(dayChange),
      icon: dayChange >= 0 ? 'ArrowUp' : 'ArrowDown',
      color: dayChange >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Day Change %',
      value: formatPercent(dayChangePercent),
      icon: dayChangePercent >= 0 ? 'TrendingUp' : 'TrendingDown',
      color: dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Portfolio Summary</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name={stat.icon} size={16} className={stat.color} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Bar for Portfolio Performance */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Portfolio Performance</span>
          <span className={`text-sm font-medium ${dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatPercent(dayChangePercent)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              dayChangePercent >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ 
              width: `${Math.min(Math.abs(dayChangePercent) * 10, 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;