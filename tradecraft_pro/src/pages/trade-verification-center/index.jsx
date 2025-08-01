import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TradeListPanel from './components/TradeListPanel';
import TradeDetailPanel from './components/TradeDetailPanel';
import TradeTimeline from './components/TradeTimeline';
import ValidationSummary from './components/ValidationSummary';
import Button from '../../components/ui/Button';


const TradeVerificationCenter = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [trades, setTrades] = useState([]);
  const [viewMode, setViewMode] = useState('detail'); // 'detail', 'timeline', 'summary'
  const [isMobileView, setIsMobileView] = useState(false);

  // Mock trade data
  useEffect(() => {
    const mockTrades = [
      {
        id: 'TRD-001',
        symbol: 'AAPL',
        entryDate: new Date('2025-01-28T09:30:00'),
        exitDate: new Date('2025-01-28T15:45:00'),
        entryPrice: 225.50,
        exitPrice: 228.75,
        quantity: 100,
        direction: 'long',
        pnl: 325.00,
        status: 'pending',
        stopLoss: 222.00,
        takeProfit: 230.00,
        executionDelay: 150,
        slippage: 0.0125,
        commission: 1.50,
        spread: 0.02,
        hasLookaheadBias: true,
        realisticTiming: false,
        validSpread: true,
        volumeCheck: true,
        notes: 'Entry signal triggered during high volatility period. Potential lookahead bias in signal generation needs review.'
      },
      {
        id: 'TRD-002',
        symbol: 'TSLA',
        entryDate: new Date('2025-01-28T10:15:00'),
        exitDate: new Date('2025-01-28T14:30:00'),
        entryPrice: 185.25,
        exitPrice: 182.10,
        quantity: 50,
        direction: 'long',
        pnl: -157.50,
        status: 'approved',
        stopLoss: 180.00,
        takeProfit: 190.00,
        executionDelay: 85,
        slippage: 0.0075,
        commission: 1.25,
        spread: 0.015,
        hasLookaheadBias: false,
        realisticTiming: true,
        validSpread: true,
        volumeCheck: true,
        notes: 'Clean trade execution with proper timing validation. All checks passed successfully.'
      },
      {
        id: 'TRD-003',
        symbol: 'MSFT',
        entryDate: new Date('2025-01-28T11:45:00'),
        exitDate: null,
        entryPrice: 445.80,
        exitPrice: null,
        quantity: 25,
        direction: 'long',
        pnl: 0,
        status: 'flagged',
        stopLoss: 440.00,
        takeProfit: 455.00,
        executionDelay: 320,
        slippage: 0.0200,
        commission: 1.00,
        spread: 0.05,
        hasLookaheadBias: false,
        realisticTiming: false,
        validSpread: false,
        volumeCheck: false,
        notes: 'Multiple validation issues detected: unusual spread, low volume, and delayed execution timing.'
      },
      {
        id: 'TRD-004',
        symbol: 'GOOGL',
        entryDate: new Date('2025-01-28T13:20:00'),
        exitDate: new Date('2025-01-28T16:00:00'),
        entryPrice: 175.90,
        exitPrice: 178.45,
        quantity: 75,
        direction: 'long',
        pnl: 191.25,
        status: 'approved',
        stopLoss: 172.00,
        takeProfit: 180.00,
        executionDelay: 95,
        slippage: 0.0050,
        commission: 1.75,
        spread: 0.01,
        hasLookaheadBias: false,
        realisticTiming: true,
        validSpread: true,
        volumeCheck: true,
        notes: 'Excellent trade execution with minimal slippage and proper validation across all parameters.'
      },
      {
        id: 'TRD-005',
        symbol: 'NVDA',
        entryDate: new Date('2025-01-28T14:10:00'),
        exitDate: new Date('2025-01-28T15:55:00'),
        entryPrice: 142.30,
        exitPrice: 139.85,
        quantity: 60,
        direction: 'long',
        pnl: -147.00,
        status: 'rejected',
        stopLoss: 138.00,
        takeProfit: 148.00,
        executionDelay: 450,
        slippage: 0.0350,
        commission: 1.40,
        spread: 0.08,
        hasLookaheadBias: true,
        realisticTiming: false,
        validSpread: false,
        volumeCheck: false,
        notes: 'Trade rejected due to multiple critical issues: lookahead bias, unrealistic timing, and excessive spread.'
      },
      {
        id: 'TRD-006',
        symbol: 'AMZN',
        entryDate: new Date('2025-01-29T09:45:00'),
        exitDate: null,
        entryPrice: 205.75,
        exitPrice: null,
        quantity: 40,
        direction: 'short',
        pnl: 0,
        status: 'pending',
        stopLoss: 210.00,
        takeProfit: 198.00,
        executionDelay: 120,
        slippage: 0.0100,
        commission: 1.20,
        spread: 0.025,
        hasLookaheadBias: false,
        realisticTiming: true,
        validSpread: true,
        volumeCheck: true,
        notes: 'Short position opened during market downturn. All validation checks passed, awaiting review.'
      }
    ];

    setTrades(mockTrades);
    setSelectedTrade(mockTrades[0]);
  }, []);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const handleTradeSelect = (trade) => {
    setSelectedTrade(trade);
  };

  const handleTradeUpdate = (updatedTrade) => {
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        trade.id === updatedTrade.id ? updatedTrade : trade
      )
    );
    setSelectedTrade(updatedTrade);
  };

  const handleTradeAction = (tradeId, action) => {
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        trade.id === tradeId ? { ...trade, status: action } : trade
      )
    );
    
    if (selectedTrade?.id === tradeId) {
      setSelectedTrade(prev => ({ ...prev, status: action }));
    }
  };

  const handleBulkAction = (tradeIds, action) => {
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        tradeIds.includes(trade.id) ? { ...trade, status: action } : trade
      )
    );
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case 'timeline':
        return <TradeTimeline trade={selectedTrade} />;
      case 'summary':
        return <ValidationSummary trades={trades} />;
      default:
        return (
          <TradeDetailPanel
            trade={selectedTrade}
            onTradeUpdate={handleTradeUpdate}
            onTradeAction={handleTradeAction}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-80 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Trade Verification Center</h1>
              <p className="text-muted-foreground">
                Review and validate simulated trades before strategy finalization
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'detail' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('detail')}
                  iconName="FileText"
                  iconSize={16}
                >
                  Detail
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  iconName="Clock"
                  iconSize={16}
                >
                  Timeline
                </Button>
                <Button
                  variant={viewMode === 'summary' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('summary')}
                  iconName="BarChart3"
                  iconSize={16}
                >
                  Summary
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
            {/* Trade List Panel */}
            <div className={`${isMobileView ? 'w-full' : 'w-1/3'} ${isMobileView && selectedTrade ? 'hidden' : ''}`}>
              <TradeListPanel
                trades={trades}
                selectedTrade={selectedTrade}
                onTradeSelect={handleTradeSelect}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Main Content Panel */}
            <div className={`${isMobileView ? 'w-full' : 'w-2/3'} ${isMobileView && !selectedTrade ? 'hidden' : ''}`}>
              {/* Mobile Back Button */}
              {isMobileView && selectedTrade && (
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTrade(null)}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Back to List
                  </Button>
                </div>
              )}
              
              {renderMainContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradeVerificationCenter;