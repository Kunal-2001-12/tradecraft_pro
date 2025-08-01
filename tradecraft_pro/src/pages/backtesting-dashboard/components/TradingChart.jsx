import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TradingChart = ({ data, trades, selectedTimeframe, onTimeframeChange }) => {
  const [hoveredTrade, setHoveredTrade] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const timeframes = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'ALL' }
  ];

  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      index,
      tradeMarker: trades.find(trade => 
        new Date(trade.entryDate).getTime() === new Date(item.date).getTime()
      )
    }));
  }, [data, trades]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const trade = data.tradeMarker;
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Price: <span className="text-foreground font-medium">${payload[0].value.toFixed(2)}</span>
            </p>
            {trade && (
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-sm font-medium text-foreground">Trade Details</p>
                <p className="text-xs text-muted-foreground">
                  Type: <span className={trade.type === 'buy' ? 'text-success' : 'text-error'}>
                    {trade.type.toUpperCase()}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  P&L: <span className={trade.pnl >= 0 ? 'text-success' : 'text-error'}>
                    ${trade.pnl.toFixed(2)}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const TradeMarker = ({ cx, cy, payload }) => {
    if (!payload.tradeMarker) return null;
    
    const trade = payload.tradeMarker;
    const isProfit = trade.pnl >= 0;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={isProfit ? 'var(--color-success)' : 'var(--color-error)'}
          stroke="white"
          strokeWidth={2}
          className="cursor-pointer"
          onMouseEnter={() => setHoveredTrade(trade)}
          onMouseLeave={() => setHoveredTrade(null)}
        />
        <Icon
          name={trade.type === 'buy' ? 'ArrowUp' : 'ArrowDown'}
          size={12}
          color="white"
          style={{ x: cx - 6, y: cy - 6, pointerEvents: 'none' }}
        />
      </g>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Strategy Performance</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              disabled={zoomLevel <= 0.5}
            >
              <Icon name="ZoomOut" size={16} />
            </Button>
            <span className="text-sm text-muted-foreground">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
              disabled={zoomLevel >= 3}
            >
              <Icon name="ZoomIn" size={16} />
            </Button>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant={selectedTimeframe === timeframe.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onTimeframeChange(timeframe.value)}
              className="h-8 px-3"
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Portfolio Value Line */}
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-primary)' }}
            />
            
            {/* Benchmark Line */}
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="var(--color-muted-foreground)"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
            
            {/* Trade Markers */}
            {chartData.map((point, index) => 
              point.tradeMarker ? (
                <ReferenceLine
                  key={`trade-${index}`}
                  x={point.date}
                  stroke={point.tradeMarker.pnl >= 0 ? 'var(--color-success)' : 'var(--color-error)'}
                  strokeDasharray="2 2"
                  strokeOpacity={0.5}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-primary"></div>
          <span className="text-sm text-muted-foreground">Portfolio Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-muted-foreground" style={{ borderTop: '1px dashed' }}></div>
          <span className="text-sm text-muted-foreground">Benchmark</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">Profitable Trades</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded-full"></div>
          <span className="text-sm text-muted-foreground">Loss Trades</span>
        </div>
      </div>

      {/* Hovered Trade Details */}
      {hoveredTrade && (
        <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-3 shadow-lg z-10">
          <h4 className="text-sm font-medium text-foreground mb-2">Trade Details</h4>
          <div className="space-y-1 text-xs">
            <p className="text-muted-foreground">
              Entry: <span className="text-foreground">${hoveredTrade.entryPrice.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              Exit: <span className="text-foreground">${hoveredTrade.exitPrice.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              Duration: <span className="text-foreground">{hoveredTrade.duration}</span>
            </p>
            <p className="text-muted-foreground">
              P&L: <span className={hoveredTrade.pnl >= 0 ? 'text-success' : 'text-error'}>
                ${hoveredTrade.pnl.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingChart;