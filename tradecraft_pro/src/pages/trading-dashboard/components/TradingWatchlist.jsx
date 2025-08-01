import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../../../store/slices/marketDataSlice';
import Icon from '../../../components/AppIcon';

const TradingWatchlist = ({ onSymbolSelect }) => {
  const dispatch = useDispatch();
  const { watchlist, quotes, loading } = useSelector((state) => state.marketData);
  const [newSymbol, setNewSymbol] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleAddSymbol = (e) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      dispatch(addToWatchlist(newSymbol.trim().toUpperCase()));
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (symbol) => {
    dispatch(removeFromWatchlist(symbol));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedWatchlist = [...(watchlist || [])].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === 'symbol') {
      aValue = a;
      bValue = b;
    } else {
      const aQuote = quotes[a];
      const bQuote = quotes[b];
      
      switch (sortBy) {
        case 'price':
          aValue = aQuote?.price || 0;
          bValue = bQuote?.price || 0;
          break;
        case 'change':
          aValue = aQuote?.change || 0;
          bValue = bQuote?.change || 0;
          break;
        case 'changePercent':
          aValue = aQuote?.changePercent || 0;
          bValue = bQuote?.changePercent || 0;
          break;
        case 'volume':
          aValue = aQuote?.volume || 0;
          bValue = bQuote?.volume || 0;
          break;
        default:
          aValue = a;
          bValue = b;
      }
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume?.toLocaleString() || '0';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Watchlist ({watchlist?.length || 0})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="RefreshCw" size={16} />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="Settings" size={16} />
            </button>
          </div>
        </div>

        {/* Add Symbol Form */}
        <form onSubmit={handleAddSymbol} className="flex space-x-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Add symbol (e.g., AAPL)"
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            type="submit"
            disabled={!newSymbol.trim() || loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Icon name="Plus" size={16} />
          </button>
        </form>
      </div>

      {/* Watchlist Content */}
      <div className="overflow-x-auto">
        {!watchlist || watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 space-y-2">
            <Icon name="Eye" size={32} className="text-muted-foreground" />
            <span className="text-muted-foreground">No symbols in watchlist</span>
            <span className="text-sm text-muted-foreground">Add symbols to track their prices</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th 
                  className="text-left p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    {sortBy === 'symbol' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price</span>
                    {sortBy === 'price' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Change</span>
                    {sortBy === 'change' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('changePercent')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>%</span>
                    {sortBy === 'changePercent' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Volume</span>
                    {sortBy === 'volume' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedWatchlist.map((symbol) => {
                const quote = quotes[symbol];
                const isLoading = loading && !quote;

                return (
                  <tr 
                    key={symbol}
                    className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onSymbolSelect?.(symbol)}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{symbol}</span>
                        {isLoading && (
                          <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-foreground">
                      {quote?.price ? formatCurrency(quote.price) : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-mono ${
                        quote?.change >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {quote?.change ? formatCurrency(quote.change) : '-'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {quote?.changePercent !== undefined && (
                          <Icon 
                            name={quote.changePercent >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                            size={12} 
                            className={quote.changePercent >= 0 ? 'text-success' : 'text-error'}
                          />
                        )}
                        <span className={`font-mono text-sm ${
                          quote?.changePercent >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          {quote?.changePercent !== undefined ? formatPercent(quote.changePercent) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground text-sm">
                      {quote?.volume ? formatVolume(quote.volume) : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSymbolSelect?.(symbol);
                          }}
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                          title="View Chart"
                        >
                          <Icon name="BarChart3" size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSymbol(symbol);
                          }}
                          className="p-1 hover:bg-error/10 rounded text-muted-foreground hover:text-error"
                          title="Remove from Watchlist"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Market Summary Footer */}
      {watchlist && watchlist.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Gainers:</span>
              <span className="ml-2 font-medium text-success">
                {watchlist.filter(symbol => quotes[symbol]?.changePercent > 0).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Losers:</span>
              <span className="ml-2 font-medium text-error">
                {watchlist.filter(symbol => quotes[symbol]?.changePercent < 0).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Unchanged:</span>
              <span className="ml-2 font-medium text-muted-foreground">
                {watchlist.filter(symbol => quotes[symbol]?.changePercent === 0).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Update:</span>
              <span className="ml-2 font-medium text-foreground">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingWatchlist;