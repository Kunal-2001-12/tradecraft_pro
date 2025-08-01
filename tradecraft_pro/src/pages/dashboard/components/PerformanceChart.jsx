import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../components/AppIcon';

const PerformanceChart = () => {
  const { totalValue, dayChange, dayChangePercent } = useSelector((state) => state.portfolio);
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate mock chart data based on timeframe
    generateChartData(timeframe);
  }, [timeframe, totalValue]);

  const generateChartData = (period) => {
    const dataPoints = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : 365;
    const data = [];
    let baseValue = totalValue - dayChange;
    
    for (let i = 0; i < dataPoints; i++) {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      baseValue *= (1 + variation);
      data.push({
        time: i,
        value: baseValue,
        change: variation * 100
      });
    }
    
    // Ensure the last point matches current portfolio value
    data[data.length - 1].value = totalValue;
    
    setChartData(data);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const timeframes = ['1D', '1W', '1M', '1Y'];

  const minValue = Math.min(...chartData.map(d => d.value));
  const maxValue = Math.max(...chartData.map(d => d.value));
  const range = maxValue - minValue;

  const getPathData = () => {
    if (chartData.length === 0) return '';
    
    const width = 100; // SVG viewBox width
    const height = 40; // SVG viewBox height
    
    return chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * width;
      const y = height - ((point.value - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const isPositive = dayChange >= 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Portfolio Performance</h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalValue)}
            </div>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} />
              <span className="font-medium">
                {formatCurrency(Math.abs(dayChange))} ({formatPercent(dayChangePercent)})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-6">
        {chartData.length > 0 ? (
          <svg
            viewBox="0 0 100 40"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-muted" />
              </pattern>
            </defs>
            <rect width="100" height="40" fill="url(#grid)" opacity="0.1" />
            
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <path
              d={`${getPathData()} L 100 40 L 0 40 Z`}
              fill="url(#areaGradient)"
            />
            
            {/* Line */}
            <path
              d={getPathData()}
              fill="none"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="0.5"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {chartData.map((point, index) => {
              const x = (index / (chartData.length - 1)) * 100;
              const y = 40 - ((point.value - minValue) / range) * 40;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="0.3"
                  fill={isPositive ? '#10b981' : '#ef4444'}
                  className="opacity-60"
                />
              );
            })}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Icon name="BarChart3" size={32} className="opacity-50" />
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-500">
            {formatCurrency(Math.max(...chartData.map(d => d.value)) || totalValue)}
          </div>
          <div className="text-sm text-muted-foreground">High</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-500">
            {formatCurrency(Math.min(...chartData.map(d => d.value)) || totalValue)}
          </div>
          <div className="text-sm text-muted-foreground">Low</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {formatCurrency(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length || totalValue)}
          </div>
          <div className="text-sm text-muted-foreground">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-500">
            {((Math.random() * 20) + 10).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Volatility</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;