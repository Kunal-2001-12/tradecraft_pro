import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMultipleQuotes } from '../../../store/slices/marketDataSlice';
import Icon from '../../../components/AppIcon';

const MarketOverview = () => {
  const dispatch = useDispatch();
  const { quotes, loading } = useSelector((state) => state.marketData);

  const majorIndices = ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI'];

  useEffect(() => {
    dispatch(fetchMultipleQuotes(majorIndices));
  }, [dispatch]);

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

  if (loading.quotes) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Market Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Activity" size={14} />
          <span>Live</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {majorIndices.map((symbol) => {
          const quote = quotes[symbol];
          if (!quote || quote.error) {
            return (
              <div key={symbol} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {getIndexName(symbol)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">No data</div>
                </div>
              </div>
            );
          }

          const isPositive = quote.changePercent >= 0;

          return (
            <div key={symbol} className="flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Icon 
                    name={isPositive ? "TrendingUp" : "TrendingDown"} 
                    size={16} 
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">{symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {getIndexName(symbol)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-foreground">
                  {formatCurrency(quote.price)}
                </div>
                <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercent(quote.changePercent)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Market Status */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Market Status</span>
          </div>
          <span className="text-sm font-medium text-green-500">
            {isMarketOpen() ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Next: {getNextMarketEvent()}
        </div>
      </div>
    </div>
  );
};

const getIndexName = (symbol) => {
  const names = {
    'SPY': 'S&P 500 ETF',
    'QQQ': 'Nasdaq 100 ETF',
    'IWM': 'Russell 2000 ETF',
    'DIA': 'Dow Jones ETF',
    'VTI': 'Total Stock Market ETF',
  };
  return names[symbol] || symbol;
};

const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;
  
  // Market is closed on weekends
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM ET
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  
  return time >= marketOpen && time < marketClose;
};

const getNextMarketEvent = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour * 60 + minute;
  
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  
  if (day === 0) return 'Monday 9:30 AM ET';
  if (day === 6) return 'Monday 9:30 AM ET';
  
  if (time < marketOpen) {
    const minutesToOpen = marketOpen - time;
    const hours = Math.floor(minutesToOpen / 60);
    const mins = minutesToOpen % 60;
    return `Opens in ${hours}h ${mins}m`;
  } else if (time < marketClose) {
    const minutesToClose = marketClose - time;
    const hours = Math.floor(minutesToClose / 60);
    const mins = minutesToClose % 60;
    return `Closes in ${hours}h ${mins}m`;
  } else {
    return 'Tomorrow 9:30 AM ET';
  }
};

export default MarketOverview;