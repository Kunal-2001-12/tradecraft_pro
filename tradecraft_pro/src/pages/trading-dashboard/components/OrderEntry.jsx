import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../../../store/slices/portfolioSlice';
import Icon from '../../../components/AppIcon';

const OrderEntry = ({ symbol }) => {
  const dispatch = useDispatch();
  const { quotes } = useSelector((state) => state.marketData);
  const { totalValue, cash } = useSelector((state) => state.portfolio);
  const { loading } = useSelector((state) => state.portfolio);

  const [orderData, setOrderData] = useState({
    symbol: symbol || 'AAPL',
    side: 'buy',
    type: 'market',
    quantity: '',
    price: '',
    stopPrice: '',
    timeInForce: 'day'
  });

  const [errors, setErrors] = useState({});
  const [estimatedCost, setEstimatedCost] = useState(0);

  const currentQuote = quotes[orderData.symbol];
  const currentPrice = currentQuote?.price || 0;

  useEffect(() => {
    if (symbol) {
      setOrderData(prev => ({ ...prev, symbol }));
    }
  }, [symbol]);

  useEffect(() => {
    // Calculate estimated cost
    const quantity = parseFloat(orderData.quantity) || 0;
    let price = 0;

    if (orderData.type === 'market') {
      price = currentPrice;
    } else {
      price = parseFloat(orderData.price) || 0;
    }

    setEstimatedCost(quantity * price);
  }, [orderData.quantity, orderData.price, orderData.type, currentPrice]);

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateOrder = () => {
    const newErrors = {};

    if (!orderData.symbol) {
      newErrors.symbol = 'Symbol is required';
    }

    if (!orderData.quantity || parseFloat(orderData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (orderData.type !== 'market' && (!orderData.price || parseFloat(orderData.price) <= 0)) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (orderData.type === 'stop' || orderData.type === 'stop-limit') {
      if (!orderData.stopPrice || parseFloat(orderData.stopPrice) <= 0) {
        newErrors.stopPrice = 'Stop price must be greater than 0';
      }
    }

    // Check buying power
    if (orderData.side === 'buy' && estimatedCost > cash) {
      newErrors.quantity = 'Insufficient buying power';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOrder()) {
      return;
    }

    try {
      const order = {
        ...orderData,
        quantity: parseFloat(orderData.quantity),
        price: orderData.type === 'market' ? currentPrice : parseFloat(orderData.price),
        stopPrice: orderData.stopPrice ? parseFloat(orderData.stopPrice) : null,
        estimatedValue: estimatedCost
      };

      await dispatch(placeOrder(order)).unwrap();
      
      // Reset form
      setOrderData(prev => ({
        ...prev,
        quantity: '',
        price: '',
        stopPrice: ''
      }));
      
      // Show success message (you could add a toast notification here)
      console.log('Order placed successfully');
      
    } catch (error) {
      console.error('Failed to place order:', error);
      setErrors({ submit: error.message || 'Failed to place order' });
    }
  };

  const getMaxQuantity = () => {
    if (orderData.side === 'sell') {
      // In a real app, you'd check actual positions
      return 100; // Mock value
    } else {
      const price = orderData.type === 'market' ? currentPrice : parseFloat(orderData.price) || currentPrice;
      return Math.floor(cash / price);
    }
  };

  const setMaxQuantity = () => {
    const maxQty = getMaxQuantity();
    handleInputChange('quantity', maxQty.toString());
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Place Order</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="DollarSign" size={16} />
          <span>Buying Power: ${cash?.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Symbol
          </label>
          <input
            type="text"
            value={orderData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="AAPL"
          />
          {errors.symbol && (
            <p className="text-error text-xs mt-1">{errors.symbol}</p>
          )}
        </div>

        {/* Side Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Side
          </label>
          <div className="flex bg-muted rounded-md p-1">
            <button
              type="button"
              onClick={() => handleInputChange('side', 'buy')}
              className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                orderData.side === 'buy'
                  ? 'bg-success text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('side', 'sell')}
              className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                orderData.side === 'sell'
                  ? 'bg-error text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Order Type
          </label>
          <select
            value={orderData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
            <option value="stop-limit">Stop Limit</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Quantity
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={orderData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              step="1"
            />
            <button
              type="button"
              onClick={setMaxQuantity}
              className="px-3 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 text-sm"
            >
              Max
            </button>
          </div>
          {errors.quantity && (
            <p className="text-error text-xs mt-1">{errors.quantity}</p>
          )}
        </div>

        {/* Price (for limit orders) */}
        {(orderData.type === 'limit' || orderData.type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Limit Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <input
                type="number"
                value={orderData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={currentPrice?.toFixed(2) || '0.00'}
                min="0"
                step="0.01"
              />
            </div>
            {errors.price && (
              <p className="text-error text-xs mt-1">{errors.price}</p>
            )}
          </div>
        )}

        {/* Stop Price (for stop orders) */}
        {(orderData.type === 'stop' || orderData.type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Stop Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <input
                type="number"
                value={orderData.stopPrice}
                onChange={(e) => handleInputChange('stopPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={currentPrice?.toFixed(2) || '0.00'}
                min="0"
                step="0.01"
              />
            </div>
            {errors.stopPrice && (
              <p className="text-error text-xs mt-1">{errors.stopPrice}</p>
            )}
          </div>
        )}

        {/* Time in Force */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Time in Force
          </label>
          <select
            value={orderData.timeInForce}
            onChange={(e) => handleInputChange('timeInForce', e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="day">Day</option>
            <option value="gtc">Good Till Canceled</option>
            <option value="ioc">Immediate or Cancel</option>
            <option value="fok">Fill or Kill</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Price:</span>
            <span className="text-foreground font-mono">
              ${currentPrice?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Cost:</span>
            <span className="text-foreground font-mono">
              ${estimatedCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available:</span>
            <span className="text-foreground font-mono">
              ${cash?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            orderData.side === 'buy'
              ? 'bg-success hover:bg-success/90 text-white'
              : 'bg-error hover:bg-error/90 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Placing Order...</span>
            </div>
          ) : (
            `${orderData.side === 'buy' ? 'Buy' : 'Sell'} ${orderData.symbol}`
          )}
        </button>

        {errors.submit && (
          <p className="text-error text-sm text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default OrderEntry;