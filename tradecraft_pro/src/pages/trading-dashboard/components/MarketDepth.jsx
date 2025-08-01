import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';

const MarketDepth = ({ symbol }) => {
  const { quotes } = useSelector((state) => state.marketData);
  const [depthData, setDepthData] = useState({
    bids: [],
    asks: [],
    maxCumulative: 0
  });

  const currentQuote = quotes[symbol];

  // Generate mock market depth data
  useEffect(() => {
    if (!currentQuote?.price) return;

    const basePrice = currentQuote.price;
    const bids = [];
    const asks = [];

    // Generate bid levels with cumulative sizes
    let cumulativeBidSize = 0;
    for (let i = 0; i < 20; i++) {
      const price = basePrice - (i + 1) * 0.01;
      const size = Math.floor(Math.random() * 500) + 50;
      cumulativeBidSize += size;
      
      bids.push({
        price: price,
        size: size,
        cumulative: cumulativeBidSize
      });
    }

    // Generate ask levels with cumulative sizes
    let cumulativeAskSize = 0;
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (i + 1) * 0.01;
      const size = Math.floor(Math.random() * 500) + 50;
      cumulativeAskSize += size;
      
      asks.push({
        price: price,
        size: size,
        cumulative: cumulativeAskSize
      });
    }

    const maxCumulative = Math.max(cumulativeBidSize, cumulativeAskSize);

    setDepthData({
      bids: bids.sort((a, b) => b.price - a.price), // Highest bid first
      asks: asks.sort((a, b) => a.price - b.price), // Lowest ask first
      maxCumulative
    });
  }, [currentQuote?.price, symbol]);

  const formatPrice = (price) => price?.toFixed(2) || '0.00';
  const formatSize = (size) => size?.toLocaleString() || '0';

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Market Depth - {symbol}
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="ZoomIn" size={16} />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="ZoomOut" size={16} />
            </button>
            <button className="p-1 hover:bg-muted rounded">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Market Depth Chart */}
      <div className="p-4">
        <div className="h-64 relative bg-muted/20 rounded-lg overflow-hidden">
          <svg className="w-full h-full">
            {/* Grid Lines */}
            <defs>
              <pattern id="depthGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#depthGrid)" />

            {/* Bid Area (Left Side - Green) */}
            <path
              d={`M 0,100% ${depthData.bids.slice(0, 10).map((bid, index) => {
                const x = (index / 10) * 50; // Left half
                const y = 100 - (bid.cumulative / depthData.maxCumulative) * 100;
                return `L ${x}%,${y}%`;
              }).join(' ')} L 50%,100% Z`}
              fill="rgba(34, 197, 94, 0.3)"
              stroke="rgb(34, 197, 94)"
              strokeWidth="2"
            />

            {/* Ask Area (Right Side - Red) */}
            <path
              d={`M 50%,100% ${depthData.asks.slice(0, 10).map((ask, index) => {
                const x = 50 + (index / 10) * 50; // Right half
                const y = 100 - (ask.cumulative / depthData.maxCumulative) * 100;
                return `L ${x}%,${y}%`;
              }).join(' ')} L 100%,100% Z`}
              fill="rgba(239, 68, 68, 0.3)"
              stroke="rgb(239, 68, 68)"
              strokeWidth="2"
            />

            {/* Current Price Line */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.7"
            />
          </svg>

          {/* Price Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Current Price Label */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-mono">
              ${formatPrice(currentQuote?.price)}
            </div>

            {/* Bid Price Range */}
            <div className="absolute bottom-2 left-2 bg-success/90 text-white px-2 py-1 rounded text-xs">
              Bids: ${formatPrice(depthData.bids[depthData.bids.length - 1]?.price)} - ${formatPrice(depthData.bids[0]?.price)}
            </div>

            {/* Ask Price Range */}
            <div className="absolute bottom-2 right-2 bg-error/90 text-white px-2 py-1 rounded text-xs">
              Asks: ${formatPrice(depthData.asks[0]?.price)} - ${formatPrice(depthData.asks[depthData.asks.length - 1]?.price)}
            </div>
          </div>
        </div>

        {/* Depth Statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Bid Side Stats */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-sm font-medium text-foreground">Bid Depth</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume:</span>
                <span className="text-foreground font-mono">
                  {formatSize(depthData.bids.reduce((sum, bid) => sum + bid.size, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Price:</span>
                <span className="text-foreground font-mono">
                  ${formatPrice(depthData.bids.reduce((sum, bid) => sum + bid.price, 0) / depthData.bids.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Bid:</span>
                <span className="text-success font-mono">
                  ${formatPrice(depthData.bids[0]?.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Ask Side Stats */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-sm font-medium text-foreground">Ask Depth</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume:</span>
                <span className="text-foreground font-mono">
                  {formatSize(depthData.asks.reduce((sum, ask) => sum + ask.size, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Price:</span>
                <span className="text-foreground font-mono">
                  ${formatPrice(depthData.asks.reduce((sum, ask) => sum + ask.price, 0) / depthData.asks.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Ask:</span>
                <span className="text-error font-mono">
                  ${formatPrice(depthData.asks[0]?.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Imbalance */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Market Imbalance</span>
            <div className="flex items-center space-x-2">
              {(() => {
                const bidVolume = depthData.bids.reduce((sum, bid) => sum + bid.size, 0);
                const askVolume = depthData.asks.reduce((sum, ask) => sum + ask.size, 0);
                const totalVolume = bidVolume + askVolume;
                const bidRatio = bidVolume / totalVolume;
                const imbalance = bidRatio - 0.5;
                
                return (
                  <>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-success to-error"
                        style={{
                          background: imbalance > 0 
                            ? `linear-gradient(to right, rgb(34, 197, 94) ${bidRatio * 100}%, rgb(239, 68, 68) ${bidRatio * 100}%)`
                            : `linear-gradient(to right, rgb(34, 197, 94) ${bidRatio * 100}%, rgb(239, 68, 68) ${bidRatio * 100}%)`
                        }}
                      />
                    </div>
                    <span className={`text-sm font-mono ${
                      imbalance > 0.1 ? 'text-success' : 
                      imbalance < -0.1 ? 'text-error' : 'text-muted-foreground'
                    }`}>
                      {imbalance > 0 ? 'Bid Heavy' : imbalance < 0 ? 'Ask Heavy' : 'Balanced'}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="mt-4 pt-2 border-t border-border text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Activity" size={12} />
            <span>Real-time market depth</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;