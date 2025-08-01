import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';

const OrderBook = ({ symbol }) => {
  const { quotes } = useSelector((state) => state.marketData);
  const [orderBookData, setOrderBookData] = useState({
    bids: [],
    asks: [],
    spread: 0,
    spreadPercent: 0
  });

  const currentQuote = quotes[symbol];

  // Generate mock order book data
  useEffect(() => {
    if (!currentQuote?.price) return;

    const basePrice = currentQuote.price;
    const bids = [];
    const asks = [];

    // Generate bid levels (below current price)
    for (let i = 0; i < 10; i++) {
      const price = basePrice - (i + 1) * 0.01;
      const size = Math.floor(Math.random() * 1000) + 100;
      bids.push({
        price: price,
        size: size,
        total: size * (i + 1)
      });
    }

    // Generate ask levels (above current price)
    for (let i = 0; i < 10; i++) {
      const price = basePrice + (i + 1) * 0.01;
      const size = Math.floor(Math.random() * 1000) + 100;
      asks.push({
        price: price,
        size: size,
        total: size * (i + 1)
      });
    }

    const spread = asks[0]?.price - bids[0]?.price || 0;
    const spreadPercent = (spread / basePrice) * 100;

    setOrderBookData({
      bids: bids.sort((a, b) => b.price - a.price), // Highest bid first
      asks: asks.sort((a, b) => a.price - b.price), // Lowest ask first
      spread,
      spreadPercent
    });
  }, [currentQuote?.price, symbol]);

  const maxBidSize = Math.max(...orderBookData.bids.map(b => b.size), 0);
  const maxAskSize = Math.max(...orderBookData.asks.map(a => a.size), 0);
  const maxSize = Math.max(maxBidSize, maxAskSize);

  const formatPrice = (price) => price?.toFixed(2) || '0.00';
  const formatSize = (size) => size?.toLocaleString() || '0';

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Order Book - {symbol}
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-muted-foreground">Spread:</span>
              <span className="text-foreground font-mono">
                ${orderBookData.spread.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                ({orderBookData.spreadPercent.toFixed(3)}%)
              </span>
            </div>
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Book Content */}
      <div className="p-4">
        {/* Column Headers */}
        <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground mb-2 pb-2 border-b border-border">
          <div className="text-right">Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
          <div></div>
          <div className="text-right">Size</div>
          <div className="text-right">Price</div>
        </div>

        {/* Order Book Rows */}
        <div className="space-y-1">
          {Array.from({ length: Math.max(orderBookData.bids.length, orderBookData.asks.length) }).map((_, index) => {
            const bid = orderBookData.bids[index];
            const ask = orderBookData.asks[index];

            return (
              <div key={index} className="grid grid-cols-6 gap-2 text-sm font-mono">
                {/* Bid Side */}
                <div className="text-right relative">
                  {bid && (
                    <>
                      <div
                        className="absolute inset-0 bg-success/10 rounded"
                        style={{
                          width: `${(bid.size / maxSize) * 100}%`,
                          marginLeft: 'auto'
                        }}
                      />
                      <span className="relative text-success hover:bg-success/20 px-1 rounded cursor-pointer">
                        {formatPrice(bid.price)}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-right text-foreground">
                  {bid && formatSize(bid.size)}
                </div>
                <div className="text-right text-muted-foreground">
                  {bid && formatSize(bid.total)}
                </div>

                {/* Separator */}
                <div className="flex items-center justify-center">
                  {index === 0 && (
                    <div className="w-full h-px bg-border"></div>
                  )}
                </div>

                {/* Ask Side */}
                <div className="text-right text-foreground">
                  {ask && formatSize(ask.size)}
                </div>
                <div className="text-right relative">
                  {ask && (
                    <>
                      <div
                        className="absolute inset-0 bg-error/10 rounded"
                        style={{
                          width: `${(ask.size / maxSize) * 100}%`
                        }}
                      />
                      <span className="relative text-error hover:bg-error/20 px-1 rounded cursor-pointer">
                        {formatPrice(ask.price)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Price Display */}
        {currentQuote && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={currentQuote.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={currentQuote.change >= 0 ? 'text-success' : 'text-error'}
              />
              <span className="text-lg font-bold text-foreground">
                ${formatPrice(currentQuote.price)}
              </span>
              <span className={`text-sm ${
                currentQuote.change >= 0 ? 'text-success' : 'text-error'
              }`}>
                {currentQuote.change >= 0 ? '+' : ''}{formatPrice(currentQuote.change)}
              </span>
            </div>
          </div>
        )}

        {/* Market Depth Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span className="text-muted-foreground">Total Bids</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="text-foreground font-mono">
                    {formatSize(orderBookData.bids.reduce((sum, bid) => sum + bid.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-foreground font-mono">
                    ${formatSize(orderBookData.bids.reduce((sum, bid) => sum + (bid.size * bid.price), 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span className="text-muted-foreground">Total Asks</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="text-foreground font-mono">
                    {formatSize(orderBookData.asks.reduce((sum, ask) => sum + ask.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-foreground font-mono">
                    ${formatSize(orderBookData.asks.reduce((sum, ask) => sum + (ask.size * ask.price), 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="mt-4 pt-2 border-t border-border text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;