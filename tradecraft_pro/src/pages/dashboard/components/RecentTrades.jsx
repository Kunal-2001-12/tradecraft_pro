import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderHistory } from '../../../store/slices/ordersSlice';
import Icon from '../../../components/AppIcon';

const RecentTrades = () => {
  const dispatch = useDispatch();
  const { orderHistory, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderHistory(10)); // Get last 10 trades
  }, [dispatch]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'filled':
        return 'text-green-500 bg-green-100';
      case 'cancelled':
        return 'text-red-500 bg-red-100';
      case 'open':
        return 'text-blue-500 bg-blue-100';
      case 'pending':
        return 'text-yellow-500 bg-yellow-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getSideColor = (side) => {
    return side === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  if (loading.history) {
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
                <div className="h-4 bg-muted rounded w-1/8"></div>
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
        <h2 className="text-xl font-semibold text-foreground">Recent Trades</h2>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      {orderHistory.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Activity" size={32} className="mx-auto mb-2 opacity-50" />
          <p>No recent trades</p>
          <p className="text-sm">Your trading activity will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.side === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Icon 
                    name={order.side === 'buy' ? 'ArrowUp' : 'ArrowDown'} 
                    size={16} 
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {order.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getSideColor(order.side)}`}>
                    {order.side.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {order.quantity} shares
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  @ {formatCurrency(order.averageFillPrice || order.price)}
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency((order.averageFillPrice || order.price) * order.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {orderHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {orderHistory.filter(o => o.status === 'filled').length}
              </div>
              <div className="text-sm text-muted-foreground">Filled</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-500">
                {orderHistory.filter(o => o.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-500">
                {orderHistory.filter(o => o.status === 'cancelled').length}
              </div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTrades;