import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist, fetchQuote } from '../../../store/slices/marketDataSlice';
import { openModal } from '../../../store/slices/uiSlice';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const Watchlist = () => {
  const dispatch = useDispatch();
  const { watchlist, quotes, loading } = useSelector((state) => state.marketData);
  const [newSymbol, setNewSymbol] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSymbol = (e) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      const symbol = newSymbol.trim().toUpperCase();
      dispatch(addToWatchlist(symbol));
      dispatch(fetchQuote(symbol));
      setNewSymbol('');
      setShowAddForm(false);
    }
  };

  const handleRemoveSymbol = (symbol) => {
    dispatch(removeFromWatchlist(symbol));
  };

  const handleTradeSymbol = (symbol) => {
    // Open order entry modal with pre-filled symbol
    dispatch(openModal('orderEntry'));
    // You would also dispatch an action to set the selected symbol
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

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Watchlist</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
        >
          <Icon name="Plus" size={16} />
          <span className="text-sm">Add</span>
        </button>
      </div>

      {/* Add Symbol Form */}
      {showAddForm && (
        <form onSubmit={handleAddSymbol} className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              Add
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Watchlist Items */}
      <div className="space-y-2">
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Eye" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No symbols in watchlist</p>
            <p className="text-sm">Add symbols to track their performance</p>
          </div>
        ) : (
          watchlist.map((symbol) => {
            const quote = quotes[symbol];
            const isLoading = loading.quotes && !quote;
            const hasError = quote?.error;
            const isPositive = quote?.changePercent >= 0;

            return (
              <div
                key={symbol}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="font-medium text-foreground">{symbol}</div>
                  
                  {isLoading ? (
                    <div className="flex space-x-2">
                      <div className="w-16 h-4 bg-muted animate-pulse rounded"></div>
                      <div className="w-12 h-4 bg-muted animate-pulse rounded"></div>
                    </div>
                  ) : hasError ? (
                    <div className="text-sm text-red-500">Error loading</div>
                  ) : quote ? (
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          {formatCurrency(quote.price)}
                        </div>
                        <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercent(quote.changePercent)}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTradeSymbol(symbol)}
                    className="p-1 text-primary hover:text-primary/80 transition-colors"
                    title="Trade"
                  >
                    <Icon name="ShoppingCart" size={14} />
                  </button>
                  <button
                    onClick={() => handleRemoveSymbol(symbol)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Watchlist Stats */}
      {watchlist.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-500">
                {watchlist.filter(symbol => {
                  const quote = quotes[symbol];
                  return quote && !quote.error && quote.changePercent >= 0;
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Gainers</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-500">
                {watchlist.filter(symbol => {
                  const quote = quotes[symbol];
                  return quote && !quote.error && quote.changePercent < 0;
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Losers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;