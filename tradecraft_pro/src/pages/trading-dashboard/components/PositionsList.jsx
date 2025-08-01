import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../../../store/slices/portfolioSlice';
import Icon from '../../../components/AppIcon';

const PositionsList = ({ onSymbolSelect }) => {
  const dispatch = useDispatch();
  const { positions, loading } = useSelector((state) => state.portfolio);
  const { quotes } = useSelector((state) => state.marketData);
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedPositions = [...(positions || [])].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

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

  const handleClosePosition = async (position) => {
    try {
      const currentPrice = quotes[position.symbol]?.price || position.currentPrice;
      
      await dispatch(placeOrder({
        symbol: position.symbol,
        side: 'sell',
        type: 'market',
        quantity: position.quantity,
        price: currentPrice
      })).unwrap();
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  const calculateUnrealizedPnL = (position) => {
    const currentPrice = quotes[position.symbol]?.price || position.currentPrice;
    const unrealizedPnL = (currentPrice - position.averagePrice) * position.quantity;
    const unrealizedPnLPercent = ((currentPrice - position.averagePrice) / position.averagePrice) * 100;
    
    return {
      unrealizedPnL,
      unrealizedPnLPercent,
      currentPrice
    };
  };

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

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Loading positions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col items-center justify-center h-32 space-y-2">
          <Icon name="TrendingUp" size={32} className="text-muted-foreground" />
          <span className="text-muted-foreground">No open positions</span>
          <span className="text-sm text-muted-foreground">Place your first trade to get started</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Open Positions ({positions.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="RefreshCw" size={16} />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Quantity</span>
                  {sortBy === 'quantity' && (
                    <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th 
                className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => handleSort('averagePrice')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Avg Price</span>
                  {sortBy === 'averagePrice' && (
                    <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                  )}
                </div>
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Current Price
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Market Value
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Unrealized P&L
              </th>
              <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position, index) => {
              const { unrealizedPnL, unrealizedPnLPercent, currentPrice } = calculateUnrealizedPnL(position);
              const marketValue = currentPrice * position.quantity;

              return (
                <tr 
                  key={`${position.symbol}-${index}`}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <button
                      onClick={() => onSymbolSelect?.(position.symbol)}
                      className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                      <span className="font-medium text-foreground">{position.symbol}</span>
                      <Icon name="ExternalLink" size={12} className="text-muted-foreground" />
                    </button>
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {position.quantity.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {formatCurrency(position.averagePrice)}
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {formatCurrency(currentPrice)}
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {formatCurrency(marketValue)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="space-y-1">
                      <div className={`font-mono ${
                        unrealizedPnL >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {formatCurrency(unrealizedPnL)}
                      </div>
                      <div className={`text-xs ${
                        unrealizedPnL >= 0 ? 'text-success' : 'text-error'
                      }`}>
                        {formatPercent(unrealizedPnLPercent)}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onSymbolSelect?.(position.symbol)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        title="View Chart"
                      >
                        <Icon name="BarChart3" size={14} />
                      </button>
                      <button
                        onClick={() => handleClosePosition(position)}
                        className="p-1 hover:bg-error/10 rounded text-muted-foreground hover:text-error"
                        title="Close Position"
                        disabled={loading}
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
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total Positions:</span>
            <span className="ml-2 font-medium text-foreground">{positions.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Market Value:</span>
            <span className="ml-2 font-mono text-foreground">
              {formatCurrency(
                positions.reduce((sum, pos) => {
                  const currentPrice = quotes[pos.symbol]?.price || pos.currentPrice;
                  return sum + (currentPrice * pos.quantity);
                }, 0)
              )}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Unrealized P&L:</span>
            <span className={`ml-2 font-mono ${
              positions.reduce((sum, pos) => {
                const currentPrice = quotes[pos.symbol]?.price || pos.currentPrice;
                return sum + ((currentPrice - pos.averagePrice) * pos.quantity);
              }, 0) >= 0 ? 'text-success' : 'text-error'
            }`}>
              {formatCurrency(
                positions.reduce((sum, pos) => {
                  const currentPrice = quotes[pos.symbol]?.price || pos.currentPrice;
                  return sum + ((currentPrice - pos.averagePrice) * pos.quantity);
                }, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionsList;