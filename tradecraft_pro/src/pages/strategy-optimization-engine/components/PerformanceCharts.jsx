import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PerformanceCharts = ({ isOptimizing, bestResults = [] }) => {
  const [selectedChart, setSelectedChart] = useState('equity');
  const [selectedStrategy, setSelectedStrategy] = useState('1');
  const [equityData, setEquityData] = useState([]);
  const [drawdownData, setDrawdownData] = useState([]);
  const [performanceComparison, setPerformanceComparison] = useState([]);

  // Mock equity curve data
  const mockEquityData = [
    { date: '2024-01-01', value: 10000, strategy1: 10000, strategy2: 10000, strategy3: 10000 },
    { date: '2024-01-15', value: 10250, strategy1: 10250, strategy2: 10180, strategy3: 10320 },
    { date: '2024-02-01', value: 10580, strategy1: 10580, strategy2: 10420, strategy3: 10650 },
    { date: '2024-02-15', value: 10420, strategy1: 10420, strategy2: 10380, strategy3: 10580 },
    { date: '2024-03-01', value: 10890, strategy1: 10890, strategy2: 10650, strategy3: 10920 },
    { date: '2024-03-15', value: 11250, strategy1: 11250, strategy2: 10890, strategy3: 11180 },
    { date: '2024-04-01', value: 11580, strategy1: 11580, strategy2: 11120, strategy3: 11450 },
    { date: '2024-04-15', value: 11320, strategy1: 11320, strategy2: 11080, strategy3: 11280 },
    { date: '2024-05-01', value: 11750, strategy1: 11750, strategy2: 11350, strategy3: 11620 },
    { date: '2024-05-15', value: 12180, strategy1: 12180, strategy2: 11680, strategy3: 12050 },
    { date: '2024-06-01', value: 12450, strategy1: 12450, strategy2: 11920, strategy3: 12380 },
    { date: '2024-06-15', value: 12280, strategy1: 12280, strategy2: 11850, strategy3: 12220 },
    { date: '2024-07-01', value: 12680, strategy1: 12680, strategy2: 12180, strategy3: 12580 },
    { date: '2024-07-15', value: 12920, strategy1: 12920, strategy2: 12450, strategy3: 12850 },
    { date: '2024-07-30', value: 13250, strategy1: 13250, strategy2: 12720, strategy3: 13180 }
  ];

  // Mock drawdown data
  const mockDrawdownData = [
    { date: '2024-01-01', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 },
    { date: '2024-01-15', drawdown: -1.2, strategy1: -1.2, strategy2: -2.1, strategy3: -0.8 },
    { date: '2024-02-01', drawdown: 0, strategy1: 0, strategy2: -1.5, strategy3: 0 },
    { date: '2024-02-15', drawdown: -1.5, strategy1: -1.5, strategy2: -2.8, strategy3: -1.1 },
    { date: '2024-03-01', drawdown: 0, strategy1: 0, strategy2: -1.2, strategy3: 0 },
    { date: '2024-03-15', drawdown: 0, strategy1: 0, strategy2: -0.8, strategy3: 0 },
    { date: '2024-04-01', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 },
    { date: '2024-04-15', drawdown: -2.2, strategy1: -2.2, strategy2: -1.8, strategy3: -1.5 },
    { date: '2024-05-01', drawdown: 0, strategy1: 0, strategy2: -0.5, strategy3: 0 },
    { date: '2024-05-15', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 },
    { date: '2024-06-01', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 },
    { date: '2024-06-15', drawdown: -1.4, strategy1: -1.4, strategy2: -2.1, strategy3: -1.3 },
    { date: '2024-07-01', drawdown: 0, strategy1: 0, strategy2: -0.8, strategy3: 0 },
    { date: '2024-07-15', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 },
    { date: '2024-07-30', drawdown: 0, strategy1: 0, strategy2: 0, strategy3: 0 }
  ];

  // Mock performance comparison data
  const mockPerformanceComparison = [
    { metric: 'Total Return', strategy1: 32.5, strategy2: 27.2, strategy3: 31.8, benchmark: 15.2 },
    { metric: 'Sharpe Ratio', strategy1: 1.85, strategy2: 1.42, strategy3: 1.78, benchmark: 0.95 },
    { metric: 'Max Drawdown', strategy1: -8.2, strategy2: -11.5, strategy3: -7.8, benchmark: -18.5 },
    { metric: 'Win Rate', strategy1: 68.5, strategy2: 62.1, strategy3: 71.2, benchmark: 52.8 },
    { metric: 'Profit Factor', strategy1: 2.1, strategy2: 1.75, strategy3: 2.05, benchmark: 1.25 }
  ];

  useEffect(() => {
    setEquityData(mockEquityData);
    setDrawdownData(mockDrawdownData);
    setPerformanceComparison(mockPerformanceComparison);
  }, []);

  const chartOptions = [
    { value: 'equity', label: 'Equity Curve' },
    { value: 'drawdown', label: 'Drawdown Analysis' },
    { value: 'comparison', label: 'Performance Comparison' },
    { value: 'scatter', label: 'Risk-Return Scatter' }
  ];

  const strategyOptions = [
    { value: '1', label: 'Strategy #1 (Best)' },
    { value: '2', label: 'Strategy #2' },
    { value: '3', label: 'Strategy #3' }
  ];

  const renderEquityChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={equityData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px'
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Line 
          type="monotone" 
          dataKey={`strategy${selectedStrategy}`}
          stroke="var(--color-primary)" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="strategy2"
          stroke="var(--color-secondary)" 
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="strategy3"
          stroke="var(--color-accent)" 
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderDrawdownChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={drawdownData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px'
          }}
          formatter={(value) => [`${value}%`, 'Drawdown']}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Line 
          type="monotone" 
          dataKey={`strategy${selectedStrategy}`}
          stroke="var(--color-error)" 
          strokeWidth={2}
          dot={false}
          fill="var(--color-error)"
          fillOpacity={0.1}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderComparisonChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={performanceComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="metric" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px'
          }}
        />
        <Bar dataKey="strategy1" fill="var(--color-primary)" name="Strategy #1" />
        <Bar dataKey="strategy2" fill="var(--color-secondary)" name="Strategy #2" />
        <Bar dataKey="strategy3" fill="var(--color-accent)" name="Strategy #3" />
        <Bar dataKey="benchmark" fill="var(--color-muted)" name="Benchmark" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderScatterChart = () => {
    const scatterData = [
      { risk: 8.2, return: 32.5, name: 'Strategy #1' },
      { risk: 11.5, return: 27.2, name: 'Strategy #2' },
      { risk: 7.8, return: 31.8, name: 'Strategy #3' },
      { risk: 18.5, return: 15.2, name: 'Benchmark' }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart data={scatterData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="risk" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            name="Risk (Max Drawdown %)"
          />
          <YAxis 
            dataKey="return" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            name="Return %"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px'
            }}
            formatter={(value, name) => [
              name === 'risk' ? `${value}%` : `${value}%`,
              name === 'risk' ? 'Max Drawdown' : 'Total Return'
            ]}
          />
          <Scatter dataKey="return" fill="var(--color-primary)" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'equity':
        return renderEquityChart();
      case 'drawdown':
        return renderDrawdownChart();
      case 'comparison':
        return renderComparisonChart();
      case 'scatter':
        return renderScatterChart();
      default:
        return renderEquityChart();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="LineChart" size={20} className="mr-2" />
            Performance Charts
          </h2>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
        <div className="flex space-x-3">
          <Select
            options={chartOptions}
            value={selectedChart}
            onChange={setSelectedChart}
            placeholder="Select chart type"
            className="flex-1"
          />
          {(selectedChart === 'equity' || selectedChart === 'drawdown') && (
            <Select
              options={strategyOptions}
              value={selectedStrategy}
              onChange={setSelectedStrategy}
              placeholder="Select strategy"
              className="flex-1"
            />
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        {bestResults.length === 0 && !isOptimizing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
              <p className="text-sm text-muted-foreground">Start optimization to see performance charts</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {renderChart()}
          </div>
        )}
      </div>

      {/* Chart Legend */}
      {bestResults.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Best Strategy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-muted-foreground">Alternative #1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">Alternative #2</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;