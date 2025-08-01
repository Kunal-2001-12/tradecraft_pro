import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import Button from '../../../components/ui/Button';

const DrawdownChart = () => {
  const [showUnderwaterPlot, setShowUnderwaterPlot] = useState(false);

  // Mock drawdown data
  const drawdownData = [
    { date: '2024-01-01', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-01-15', drawdown: -1.2, underwater: -1.2, recovery: 15 },
    { date: '2024-02-01', drawdown: -0.8, underwater: -0.8, recovery: 8 },
    { date: '2024-02-15', drawdown: -2.6, underwater: -2.6, recovery: 32 },
    { date: '2024-03-01', drawdown: -0.5, underwater: -0.5, recovery: 5 },
    { date: '2024-03-15', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-04-01', drawdown: -1.1, underwater: -1.1, recovery: 12 },
    { date: '2024-04-15', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-05-01', drawdown: -0.9, underwater: -0.9, recovery: 9 },
    { date: '2024-05-15', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-06-01', drawdown: -1.5, underwater: -1.5, recovery: 18 },
    { date: '2024-06-15', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-07-01', drawdown: -0.8, underwater: -0.8, recovery: 7 },
    { date: '2024-07-15', drawdown: 0, underwater: 0, recovery: 0 },
    { date: '2024-07-30', drawdown: -0.6, underwater: -0.6, recovery: 4 }
  ];

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
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
                {entry.name === 'Recovery Days' ? `${entry.value} days` : formatPercentage(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const maxDrawdown = Math.min(...drawdownData.map(d => d.drawdown));
  const avgDrawdown = drawdownData.reduce((sum, d) => sum + Math.abs(d.drawdown), 0) / drawdownData.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Drawdown Analysis</h3>
          <p className="text-sm text-muted-foreground">Portfolio drawdown and recovery periods</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={showUnderwaterPlot ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnderwaterPlot(!showUnderwaterPlot)}
            iconName="Waves"
            iconPosition="left"
          >
            Underwater Plot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-error">{formatPercentage(maxDrawdown)}</div>
          <div className="text-xs text-muted-foreground">Max Drawdown</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-warning">{formatPercentage(-avgDrawdown)}</div>
          <div className="text-xs text-muted-foreground">Avg Drawdown</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-accent">12 days</div>
          <div className="text-xs text-muted-foreground">Avg Recovery</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={drawdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatPercentage}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="var(--color-muted-foreground)" strokeDasharray="2 2" />
            
            {showUnderwaterPlot ? (
              <Area
                type="monotone"
                dataKey="underwater"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.3}
                name="Underwater %"
              />
            ) : (
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="var(--color-error)"
                fill="var(--color-error)"
                fillOpacity={0.3}
                name="Drawdown %"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${showUnderwaterPlot ? 'bg-primary' : 'bg-error'}`}></div>
            <span className="text-sm text-muted-foreground">
              {showUnderwaterPlot ? 'Underwater %' : 'Drawdown %'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-muted-foreground">
            Current: <span className="font-medium text-error">-0.6%</span>
          </div>
          <div className="text-muted-foreground">
            Days in DD: <span className="font-medium text-warning">4 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawdownChart;