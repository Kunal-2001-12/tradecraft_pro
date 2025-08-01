import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import TradingChart from './components/TradingChart';
import TradeHistoryTable from './components/TradeHistoryTable';
import BacktestToolbar from './components/BacktestToolbar';

const BacktestingDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('3M');
  const [isBacktestRunning, setIsBacktestRunning] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Mock performance metrics data
  const performanceMetrics = [
    {
      title: 'Total Return',
      value: '+24.7%',
      change: '+2.3%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Sharpe Ratio',
      value: '1.84',
      change: '+0.12',
      changeType: 'positive',
      icon: 'BarChart3',
      color: 'primary'
    },
    {
      title: 'Max Drawdown',
      value: '-8.2%',
      change: '-1.1%',
      changeType: 'negative',
      icon: 'TrendingDown',
      color: 'warning'
    },
    {
      title: 'Win Rate',
      value: '67.3%',
      change: '+3.2%',
      changeType: 'positive',
      icon: 'Target',
      color: 'success'
    }
  ];

  // Mock chart data
  const chartData = [
    { date: '2024-01-01', portfolioValue: 100000, benchmark: 100000 },
    { date: '2024-01-15', portfolioValue: 102500, benchmark: 101200 },
    { date: '2024-02-01', portfolioValue: 98750, benchmark: 99800 },
    { date: '2024-02-15', portfolioValue: 105200, benchmark: 102100 },
    { date: '2024-03-01', portfolioValue: 108900, benchmark: 103500 },
    { date: '2024-03-15', portfolioValue: 106300, benchmark: 104200 },
    { date: '2024-04-01', portfolioValue: 112400, benchmark: 105800 },
    { date: '2024-04-15', portfolioValue: 115600, benchmark: 107200 },
    { date: '2024-05-01', portfolioValue: 118900, benchmark: 108900 },
    { date: '2024-05-15', portfolioValue: 121200, benchmark: 110100 },
    { date: '2024-06-01', portfolioValue: 119800, benchmark: 111500 },
    { date: '2024-06-15', portfolioValue: 123400, benchmark: 112800 },
    { date: '2024-07-01', portfolioValue: 126700, benchmark: 114200 },
    { date: '2024-07-15', portfolioValue: 124900, benchmark: 115600 },
    { date: '2024-07-30', portfolioValue: 124700, benchmark: 116800 }
  ];

  // Mock trades data
  const tradesData = [
    {
      id: 1,
      symbol: 'AAPL',
      type: 'buy',
      entryDate: '2024-07-25T09:30:00',
      exitDate: '2024-07-26T15:45:00',
      entryPrice: 218.50,
      exitPrice: 222.30,
      quantity: 100,
      pnl: 380.00,
      duration: '1d 6h 15m'
    },
    {
      id: 2,
      symbol: 'MSFT',
      type: 'sell',
      entryDate: '2024-07-24T10:15:00',
      exitDate: '2024-07-25T14:20:00',
      entryPrice: 425.80,
      exitPrice: 421.20,
      quantity: 50,
      pnl: 230.00,
      duration: '1d 4h 5m'
    },
    {
      id: 3,
      symbol: 'GOOGL',
      type: 'buy',
      entryDate: '2024-07-23T11:45:00',
      exitDate: '2024-07-24T16:30:00',
      entryPrice: 2750.25,
      exitPrice: 2698.50,
      quantity: 10,
      pnl: -517.50,
      duration: '1d 4h 45m'
    },
    {
      id: 4,
      symbol: 'TSLA',
      type: 'buy',
      entryDate: '2024-07-22T13:20:00',
      exitDate: '2024-07-23T10:15:00',
      entryPrice: 248.90,
      exitPrice: 256.40,
      quantity: 75,
      pnl: 562.50,
      duration: '20h 55m'
    },
    {
      id: 5,
      symbol: 'NVDA',
      type: 'sell',
      entryDate: '2024-07-21T14:30:00',
      exitDate: '2024-07-22T11:45:00',
      entryPrice: 118.75,
      exitPrice: 115.20,
      quantity: 200,
      pnl: 710.00,
      duration: '21h 15m'
    },
    {
      id: 6,
      symbol: 'AMZN',
      type: 'buy',
      entryDate: '2024-07-20T09:45:00',
      exitDate: '2024-07-21T15:30:00',
      entryPrice: 186.25,
      exitPrice: 189.80,
      quantity: 120,
      pnl: 426.00,
      duration: '1d 5h 45m'
    },
    {
      id: 7,
      symbol: 'META',
      type: 'sell',
      entryDate: '2024-07-19T12:15:00',
      exitDate: '2024-07-20T16:20:00',
      entryPrice: 503.40,
      exitPrice: 498.90,
      quantity: 40,
      pnl: 180.00,
      duration: '1d 4h 5m'
    },
    {
      id: 8,
      symbol: 'NFLX',
      type: 'buy',
      entryDate: '2024-07-18T10:30:00',
      exitDate: '2024-07-19T14:45:00',
      entryPrice: 642.80,
      exitPrice: 635.20,
      quantity: 25,
      pnl: -190.00,
      duration: '1d 4h 15m'
    },
    {
      id: 9,
      symbol: 'AMD',
      type: 'buy',
      entryDate: '2024-07-17T11:20:00',
      exitDate: '2024-07-18T13:30:00',
      entryPrice: 148.60,
      exitPrice: 152.90,
      quantity: 150,
      pnl: 645.00,
      duration: '1d 2h 10m'
    },
    {
      id: 10,
      symbol: 'CRM',
      type: 'sell',
      entryDate: '2024-07-16T15:45:00',
      exitDate: '2024-07-17T09:30:00',
      entryPrice: 254.30,
      exitPrice: 251.80,
      quantity: 80,
      pnl: 200.00,
      duration: '17h 45m'
    }
  ];

  // Simulate backtest progress
  useEffect(() => {
    let interval;
    if (isBacktestRunning) {
      interval = setInterval(() => {
        setBacktestProgress(prev => {
          if (prev >= 100) {
            setIsBacktestRunning(false);
            return 0;
          }
          return prev + Math.random() * 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isBacktestRunning]);

  const handleRunBacktest = () => {
    setIsBacktestRunning(true);
    setBacktestProgress(0);
  };

  const handleExportResults = (format) => {
    console.log(`Exporting results as ${format}`);
    // Implement export logic here
  };

  const handleOptimizeStrategy = () => {
    navigate('/strategy-optimization-engine');
  };

  const handleTradeSelect = (trade) => {
    setSelectedTrade(trade);
    console.log('Selected trade:', trade);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-80 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Backtesting Dashboard</h1>
            <p className="text-muted-foreground">
              Analyze strategy performance using historical data with comprehensive metrics and visualization
            </p>
          </div>

          {/* Backtest Toolbar */}
          <BacktestToolbar
            onRunBacktest={handleRunBacktest}
            onExportResults={handleExportResults}
            onOptimizeStrategy={handleOptimizeStrategy}
            isRunning={isBacktestRunning}
            progress={backtestProgress}
          />

          {/* Top Section - Performance Metrics (20% height) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {performanceMetrics.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Area - Trading Chart (60% height) */}
          <div className="mb-6">
            <TradingChart
              data={chartData}
              trades={tradesData}
              selectedTimeframe={selectedTimeframe}
              onTimeframeChange={handleTimeframeChange}
            />
          </div>

          {/* Bottom Section - Trade History Table (20% height) */}
          <TradeHistoryTable
            trades={tradesData}
            onTradeSelect={handleTradeSelect}
          />
        </div>
      </main>
    </div>
  );
};

export default BacktestingDashboard;