import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelOrder } from '../../../store/slices/portfolioSlice';
import Icon from '../../../components/AppIcon';

const OrdersTable = ({ onSymbolSelect }) => {
  const dispatch = useDispatch();
  const { orderHistory, openOrders, loading } = useSelector((state) => state.orders);
  const [activeTab, setActiveTab] = useState('open');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'filled':
        return 'text-success';
      case 'cancelled':
        return 'text-muted-foreground';
      case 'rejected':
        return 'text-error';
      case 'pending':
      case 'open':
        return 'text-warning';
      default:
        return 'text-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'filled':
        return 'CheckCircle';
      case 'cancelled':
        return 'XCircle';
      case 'rejected':
        return 'AlertCircle';
      case 'pending':
      case 'open':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const currentOrders = activeTab === 'open' ? (openOrders || []) : (orderHistory || []);
  
  const sortedOrders = [...currentOrders].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'executedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
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

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-center h-32">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header with Tabs */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Orders</h3>
            <div className="flex bg-muted rounded-md p-1">
              <button
                onClick={() => setActiveTab('open')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'open'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Open ({openOrders?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'history'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                History ({orderHistory?.length || 0})
              </button>
            </div>
          </div>
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
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 space-y-2">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {activeTab === 'open' ? 'No open orders' : 'No order history'}
            </span>
            <span className="text-sm text-muted-foreground">
              {activeTab === 'open' 
                ? 'Place your first order to get started' 
                : 'Your completed orders will appear here'
              }
            </span>
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
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Side
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Type
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
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price</span>
                    {sortBy === 'price' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th 
                  className="text-right p-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Time</span>
                    {sortBy === 'createdAt' && (
                      <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} />
                    )}
                  </div>
                </th>
                {activeTab === 'open' && (
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr 
                  key={order.id || index}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <button
                      onClick={() => onSymbolSelect?.(order.symbol)}
                      className="flex items-center space-x-2 hover:text-primary transition-colors"
                    >
                      <span className="font-medium text-foreground">{order.symbol}</span>
                      <Icon name="ExternalLink" size={12} className="text-muted-foreground" />
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.side === 'buy' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-error/10 text-error'
                    }`}>
                      {order.side?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-sm text-muted-foreground capitalize">
                      {order.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {order.quantity?.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-foreground">
                    {formatCurrency(order.price || order.averageFillPrice || 0)}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Icon 
                        name={getStatusIcon(order.status)} 
                        size={14} 
                        className={getStatusColor(order.status)}
                      />
                      <span className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-sm text-muted-foreground">
                    {formatDateTime(order.createdAt || order.executedAt)}
                  </td>
                  {activeTab === 'open' && (
                    <td className="p-3 text-center">
                      {order.status === 'pending' || order.status === 'open' ? (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="p-1 hover:bg-error/10 rounded text-muted-foreground hover:text-error"
                          title="Cancel Order"
                          disabled={loading}
                        >
                          <Icon name="X" size={14} />
                        </button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Footer */}
      {sortedOrders.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Orders:</span>
              <span className="ml-2 font-medium text-foreground">{sortedOrders.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Filled:</span>
              <span className="ml-2 font-medium text-success">
                {sortedOrders.filter(o => o.status === 'filled').length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pending:</span>
              <span className="ml-2 font-medium text-warning">
                {sortedOrders.filter(o => o.status === 'pending' || o.status === 'open').length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Cancelled:</span>
              <span className="ml-2 font-medium text-muted-foreground">
                {sortedOrders.filter(o => o.status === 'cancelled').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;