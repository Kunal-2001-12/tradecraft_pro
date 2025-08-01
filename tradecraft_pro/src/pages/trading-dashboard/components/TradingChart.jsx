import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';

const TradingChart = ({ symbol, height = 400 }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [indicators, setIndicators] = useState(['SMA', 'Volume']);
  const { quotes } = useSelector((state) => state.marketData);

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];
  const chartTypes = ['line', 'candlestick', 'area'];
  const availableIndicators = ['SMA', 'EMA', 'RSI', 'MACD', 'Bollinger Bands', 'Volume'];

  const currentQuote = quotes[symbol];

  // Mock chart data - in a real app, this would come from your market data service
  const generateMockData = () => {
    const data = [];
    const basePrice = currentQuote?.price || 150;
    const now = new Date();
    
    for (let i = 100; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      const price = basePrice + (Math.random() - 0.5) * 10;
      const volume = Math.floor(Math.random() * 1000000);
      
      data.push({
        time: time.toISOString(),
        open: price + (Math.random() - 0.5) * 2,
        high: price + Math.random() * 3,
        low: price - Math.random() * 3,
        close: price,
        volume: volume
      });
    }
    return data;
  };

  const [chartData] = useState(generateMockData());

  const toggleIndicator = (indicator) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Chart Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">
              {symbol} Chart
            </h3>
            {currentQuote && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  ${currentQuote.price?.toFixed(2)}
                </span>
                <span className={`flex items-center text-sm ${
                  currentQuote.change >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={currentQuote.change >= 0 ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className="mr-1" 
                  />
                  {currentQuote.change >= 0 ? '+' : ''}{currentQuote.change?.toFixed(2)} 
                  ({currentQuote.changePercent >= 0 ? '+' : ''}{currentQuote.changePercent?.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Timeframe Selector */}
            <div className="flex bg-muted rounded-md p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    timeframe === tf
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-background border border-border rounded px-3 py-1 text-sm"
            >
              {chartTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Indicators Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-1 bg-background border border-border rounded px-3 py-1 text-sm hover:bg-muted">
                <Icon name="TrendingUp" size={16} />
                <span>Indicators</span>
                <Icon name="ChevronDown" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Indicators */}
        {indicators.length > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-muted-foreground">Active:</span>
            {indicators.map((indicator) => (
              <span
                key={indicator}
                className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs"
              >
                <span>{indicator}</span>
                <button
                  onClick={() => toggleIndicator(indicator)}
                  className="hover:bg-primary/20 rounded"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div 
          className="w-full bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {/* Mock Chart Visualization */}
          <div className="absolute inset-0 p-4">
            {/* Price Line Chart */}
            <svg className="w-full h-full">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Mock Price Line */}
              <polyline
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="2"
                points={chartData.map((point, index) => 
                  `${(index / chartData.length) * 100}%,${50 + (Math.sin(index * 0.1) * 20)}%`
                ).join(' ')}
              />
              
              {/* Volume Bars */}
              {chartData.slice(-20).map((point, index) => (
                <rect
                  key={index}
                  x={`${(index / 20) * 100}%`}
                  y="80%"
                  width="3%"
                  height={`${(point.volume / 2000000) * 15}%`}
                  fill="rgb(59, 130, 246)"
                  opacity="0.6"
                />
              ))}
            </svg>

            {/* Chart Overlay Info */}
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded p-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">O:</span>
                  <span className="text-foreground font-mono">{currentQuote?.price?.toFixed(2) || '150.00'}</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">H:</span>
                  <span className="text-foreground font-mono">{(currentQuote?.price * 1.02)?.toFixed(2) || '153.00'}</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">L:</span>
                  <span className="text-foreground font-mono">{(currentQuote?.price * 0.98)?.toFixed(2) || '147.00'}</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">C:</span>
                  <span className="text-foreground font-mono">{currentQuote?.price?.toFixed(2) || '150.00'}</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">V:</span>
                  <span className="text-foreground font-mono">1.2M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Tools */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="p-2 bg-background/80 backdrop-blur-sm rounded hover:bg-muted transition-colors">
              <Icon name="ZoomIn" size={16} />
            </button>
            <button className="p-2 bg-background/80 backdrop-blur-sm rounded hover:bg-muted transition-colors">
              <Icon name="ZoomOut" size={16} />
            </button>
            <button className="p-2 bg-background/80 backdrop-blur-sm rounded hover:bg-muted transition-colors">
              <Icon name="Move" size={16} />
            </button>
            <button className="p-2 bg-background/80 backdrop-blur-sm rounded hover:bg-muted transition-colors">
              <Icon name="Crosshair" size={16} />
            </button>
          </div>
        </div>

        {/* Chart Footer */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>Real-time data</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;