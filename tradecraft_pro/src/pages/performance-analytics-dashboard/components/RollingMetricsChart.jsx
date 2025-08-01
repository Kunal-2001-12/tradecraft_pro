import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';

const RollingMetricsChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('sharpe');
  const [rollingWindow, setRollingWindow] = useState(30);

  const metrics = [
    { id: 'sharpe', label: 'Sharpe Ratio', color: 'var(--color-primary)' },
    { id: 'volatility', label: 'Volatility', color: 'var(--color-warning)' },
    { id: 'beta', label: 'Beta', color: 'var(--color-accent)' },
    { id: 'alpha', label: 'Alpha', color: 'var(--color-success)' }
  ];

  const windows = [
    { value: 15, label: '15D' },
    { value: 30, label: '30D' },
    { value: 60, label: '60D' },
    { value: 90, label: '90D' }
  ];

  // Mock rolling metrics data
  const rollingData = [
    { date: '2024-01-01', sharpe: 1.2, volatility: 15.2, beta: 1.1, alpha: 2.1 },
    { date: '2024-01-15', sharpe: 1.4, volatility: 16.8, beta: 1.2, alpha: 2.8 },
    { date: '2024-02-01', sharpe: 1.1, volatility: 18.5, beta: 1.3, alpha: 1.9 },
    { date: '2024-02-15', sharpe: 0.9, volatility: 22.1, beta: 1.4, alpha: 1.2 },
    { date: '2024-03-01', sharpe: 1.6, volatility: 14.2, beta: 1.1, alpha: 3.2 },
    { date: '2024-03-15', sharpe: 1.8, volatility: 12.8, beta: 0.9, alpha: 3.8 },
    { date: '2024-04-01', sharpe: 1.5, volatility: 16.4, beta: 1.2, alpha: 2.9 },
    { date: '2024-04-15', sharpe: 1.7, volatility: 13.9, beta: 1.0, alpha: 3.4 },
    { date: '2024-05-01', sharpe: 1.9, volatility: 11.5, beta: 0.8, alpha: 4.1 },
    { date: '2024-05-15', sharpe: 2.1, volatility: 10.8, beta: 0.7, alpha: 4.5 },
    { date: '2024-06-01', sharpe: 1.8, volatility: 14.1, beta: 1.1, alpha: 3.7 },
    { date: '2024-06-15', sharpe: 1.6, volatility: 16.2, beta: 1.3, alpha: 3.1 },
    { date: '2024-07-01', sharpe: 1.9, volatility: 12.4, beta: 0.9, alpha: 3.9 },
    { date: '2024-07-15', sharpe: 2.0, volatility: 11.7, beta: 0.8, alpha: 4.2 },
    { date: '2024-07-30', sharpe: 1.85, volatility: 13.2, beta: 1.0, alpha: 3.8 }
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatValue = (value, metric) => {
    switch (metric) {
      case 'volatility':
        return `${value.toFixed(1)}%`;
      case 'sharpe': case'beta': case'alpha':
        return value.toFixed(2);
      default:
        return value.toFixed(2);
    }
  };

  const getMetricUnit = (metric) => {
    switch (metric) {
      case 'volatility': return '%';
      case 'sharpe': return '';
      case 'beta': return '';
      case 'alpha': return '%';
      default: return '';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">
                {formatValue(entry.value, entry.dataKey)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentMetric = metrics.find(m => m.id === selectedMetric);
  const currentValue = rollingData[rollingData.length - 1][selectedMetric];
  const previousValue = rollingData[rollingData.length - 2][selectedMetric];
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Rolling Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            {rollingWindow}-day rolling window analysis
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Rolling Window Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {windows.map((window) => (
              <button
                key={window.value}
                onClick={() => setRollingWindow(window.value)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-150 ${
                  rollingWindow === window.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {window.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex items-center space-x-2 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              selectedMetric === metric.id
                ? 'bg-primary/10 text-primary border border-primary/20' :'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: metric.color }}
            />
            <span>{metric.label}</span>
          </button>
        ))}
      </div>

      {/* Current Value Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {formatValue(currentValue, selectedMetric)}
          </div>
          <div className="text-xs text-muted-foreground">Current {currentMetric.label}</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className={`text-2xl font-bold ${change > 0 ? 'text-success' : 'text-error'}`}>
            {change > 0 ? '+' : ''}{formatValue(change, selectedMetric)}
          </div>
          <div className="text-xs text-muted-foreground">Change</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className={`text-2xl font-bold ${changePercent > 0 ? 'text-success' : 'text-error'}`}>
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">% Change</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rollingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatValue(value, selectedMetric)}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={currentMetric.color}
              strokeWidth={2}
              dot={false}
              name={currentMetric.label}
              activeDot={{ r: 4, stroke: currentMetric.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Insights */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-muted-foreground">
            Avg: <span className="font-medium text-foreground">
              {formatValue(
                rollingData.reduce((sum, d) => sum + d[selectedMetric], 0) / rollingData.length,
                selectedMetric
              )}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Min: <span className="font-medium text-foreground">
              {formatValue(Math.min(...rollingData.map(d => d[selectedMetric])), selectedMetric)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Max: <span className="font-medium text-foreground">
              {formatValue(Math.max(...rollingData.map(d => d[selectedMetric])), selectedMetric)}
            </span>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export Chart
        </Button>
      </div>
    </div>
  );
};

export default RollingMetricsChart;