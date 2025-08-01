import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PerformanceMetricCard from './components/PerformanceMetricCard';
import EquityCurveChart from './components/EquityCurveChart';
import DrawdownChart from './components/DrawdownChart';
import MonthlyReturnsHeatmap from './components/MonthlyReturnsHeatmap';
import PerformanceTable from './components/PerformanceTable';
import RollingMetricsChart from './components/RollingMetricsChart';

const PerformanceAnalyticsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('YTD');
  const [comparisonMode, setComparisonMode] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const timeframes = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: 'YTD', value: 'YTD' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'All' }
  ];

  // Mock performance metrics data
  const performanceMetrics = [
    {
      title: 'Portfolio Value',
      value: '$142,600',
      change: '+$2,400',
      changeType: 'increase',
      icon: 'DollarSign',
      trend: 'positive',
      subtitle: 'Total equity'
    },
    {
      title: 'Daily P&L',
      value: '+$1,245',
      change: '+0.88%',
      changeType: 'increase',
      icon: 'TrendingUp',
      trend: 'positive',
      subtitle: 'Today\'s performance'
    },
    {
      title: 'Sharpe Ratio',
      value: '1.85',
      change: '+0.12',
      changeType: 'increase',
      icon: 'BarChart3',
      trend: 'positive',
      subtitle: 'Risk-adjusted return'
    },
    {
      title: 'Max Drawdown',
      value: '-8.2%',
      change: '+1.1%',
      changeType: 'increase',
      icon: 'TrendingDown',
      trend: 'warning',
      subtitle: 'Peak to trough'
    },
    {
      title: 'Win Rate',
      value: '68.5%',
      change: '+2.3%',
      changeType: 'increase',
      icon: 'Target',
      trend: 'positive',
      subtitle: 'Winning trades'
    },
    {
      title: 'Consecutive Losses',
      value: '2',
      change: '-1',
      changeType: 'decrease',
      icon: 'AlertTriangle',
      trend: 'positive',
      subtitle: 'Current streak'
    }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting performance report...');
  };

  const handleScheduleAnalysis = () => {
    // Mock schedule functionality
    console.log('Scheduling analysis...');
  };

  const handleShareDashboard = () => {
    // Mock share functionality
    console.log('Sharing dashboard...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-80 pt-16">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Breadcrumb />
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live Data</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-1">
                Comprehensive strategy performance analysis and metrics visualization
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Timeframe Selector */}
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                      selectedTimeframe === timeframe.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>

              {/* Comparison Toggle */}
              <Button
                variant={comparisonMode ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                iconName="GitCompare"
                iconPosition="left"
              >
                Compare
              </Button>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                iconName="Download"
                iconPosition="left"
              >
                Export Report
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleScheduleAnalysis}
                iconName="Calendar"
                iconPosition="left"
              >
                Schedule Analysis
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleShareDashboard}
                iconName="Share2"
                iconPosition="left"
              >
                Share Dashboard
              </Button>
            </div>
          </div>

          {/* Key Performance Indicators - Top Section (25% height) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {performanceMetrics.map((metric, index) => (
              <PerformanceMetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                trend={metric.trend}
                subtitle={metric.subtitle}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Main Visualization Area (50% height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <EquityCurveChart />
            </div>
            
            <DrawdownChart />
            <RollingMetricsChart />
            
            <div className="lg:col-span-2">
              <MonthlyReturnsHeatmap />
            </div>
          </div>

          {/* Detailed Performance Tables (25% height) */}
          <div className="grid grid-cols-1 gap-6">
            <PerformanceTable />
          </div>

          {/* Additional Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Risk Analysis</h3>
                <Icon name="Shield" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Value at Risk (95%)</span>
                  <span className="font-medium text-foreground">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Beta to Market</span>
                  <span className="font-medium text-foreground">1.24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Correlation to SPY</span>
                  <span className="font-medium text-foreground">0.78</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volatility (30d)</span>
                  <span className="font-medium text-foreground">18.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Trade Distribution</h3>
                <Icon name="PieChart" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                  <span className="font-medium text-foreground">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Winning Trades</span>
                  <span className="font-medium text-success">854 (68.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Losing Trades</span>
                  <span className="font-medium text-error">393 (31.5%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Win/Loss</span>
                  <span className="font-medium text-foreground">2.17</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Benchmark Comparison</h3>
                <Icon name="GitCompare" size={20} className="text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">vs S&P 500</span>
                  <span className="font-medium text-success">+21.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">vs NASDAQ</span>
                  <span className="font-medium text-success">+15.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">vs Russell 2000</span>
                  <span className="font-medium text-success">+28.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Information Ratio</span>
                  <span className="font-medium text-foreground">1.42</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border text-sm text-muted-foreground">
            <div>
              Last updated: {new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex items-center space-x-4">
              <span>Data source: Live Trading</span>
              <span>•</span>
              <span>Refresh rate: Real-time</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;