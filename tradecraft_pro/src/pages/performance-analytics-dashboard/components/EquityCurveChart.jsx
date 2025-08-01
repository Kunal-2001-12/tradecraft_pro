import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import Button from '../../../components/ui/Button';

const EquityCurveChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const timeframes = [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'All' }
  ];

  // Mock equity curve data
  const equityData = [
    { date: '2024-01-01', portfolio: 100000, benchmark: 100000, drawdown: 0 },
    { date: '2024-01-15', portfolio: 102500, benchmark: 101200, drawdown: -1200 },
    { date: '2024-02-01', portfolio: 105800, benchmark: 102800, drawdown: -800 },
    { date: '2024-02-15', portfolio: 103200, benchmark: 104100, drawdown: -2600 },
    { date: '2024-03-01', portfolio: 108900, benchmark: 105500, drawdown: -500 },
    { date: '2024-03-15', portfolio: 112400, benchmark: 107200, drawdown: 0 },
    { date: '2024-04-01', portfolio: 115600, benchmark: 108800, drawdown: -1100 },
    { date: '2024-04-15', portfolio: 118200, benchmark: 110500, drawdown: 0 },
    { date: '2024-05-01', portfolio: 121800, benchmark: 112100, drawdown: -900 },
    { date: '2024-05-15', portfolio: 125400, benchmark: 113800, drawdown: 0 },
    { date: '2024-06-01', portfolio: 128900, benchmark: 115200, drawdown: -1500 },
    { date: '2024-06-15', portfolio: 132100, benchmark: 116900, drawdown: 0 },
    { date: '2024-07-01', portfolio: 135800, benchmark: 118500, drawdown: -800 },
    { date: '2024-07-15', portfolio: 139200, benchmark: 120100, drawdown: 0 },
    { date: '2024-07-30', portfolio: 142600, benchmark: 121800, drawdown: -600 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Equity Curve</h3>
          <p className="text-sm text-muted-foreground">Portfolio performance over time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={showBenchmark ? "default" : "outline"}
              size="sm"
              onClick={() => setShowBenchmark(!showBenchmark)}
              iconName="BarChart3"
              iconPosition="left"
            >
              Benchmark
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-150 ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={100000} stroke="var(--color-muted-foreground)" strokeDasharray="2 2" />
            
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Portfolio"
              activeDot={{ r: 4, stroke: "var(--color-primary)", strokeWidth: 2 }}
            />
            
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Benchmark"
                activeDot={{ r: 4, stroke: "var(--color-secondary)", strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Portfolio</span>
          </div>
          {showBenchmark && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm text-muted-foreground">S&P 500</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-muted-foreground">
            Total Return: <span className="font-medium text-success">+42.6%</span>
          </div>
          <div className="text-muted-foreground">
            Annualized: <span className="font-medium text-success">+18.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquityCurveChart;