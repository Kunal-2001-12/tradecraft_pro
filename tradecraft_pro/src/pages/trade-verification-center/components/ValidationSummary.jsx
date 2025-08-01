import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationSummary = ({ trades }) => {
  const totalTrades = trades.length;
  const pendingTrades = trades.filter(trade => trade.status === 'pending').length;
  const approvedTrades = trades.filter(trade => trade.status === 'approved').length;
  const rejectedTrades = trades.filter(trade => trade.status === 'rejected').length;
  const flaggedTrades = trades.filter(trade => trade.status === 'flagged').length;

  const lookaheadBiasCount = trades.filter(trade => trade.hasLookaheadBias).length;
  const timingIssuesCount = trades.filter(trade => !trade.realisticTiming).length;
  const spreadIssuesCount = trades.filter(trade => !trade.validSpread).length;
  const volumeIssuesCount = trades.filter(trade => !trade.volumeCheck).length;

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

  const summaryCards = [
    {
      title: 'Total Trades',
      value: totalTrades,
      icon: 'FileText',
      color: 'text-foreground bg-card'
    },
    {
      title: 'Pending Review',
      value: pendingTrades,
      icon: 'Clock',
      color: 'text-warning bg-warning/10'
    },
    {
      title: 'Approved',
      value: approvedTrades,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10'
    },
    {
      title: 'Rejected',
      value: rejectedTrades,
      icon: 'XCircle',
      color: 'text-error bg-error/10'
    }
  ];

  const validationIssues = [
    {
      title: 'Lookahead Bias',
      count: lookaheadBiasCount,
      icon: 'AlertTriangle',
      description: 'Trades with potential future data usage'
    },
    {
      title: 'Timing Issues',
      count: timingIssuesCount,
      icon: 'Clock',
      description: 'Unrealistic execution timing detected'
    },
    {
      title: 'Spread Issues',
      count: spreadIssuesCount,
      icon: 'TrendingDown',
      description: 'Unusual bid-ask spread values'
    },
    {
      title: 'Volume Issues',
      count: volumeIssuesCount,
      icon: 'BarChart3',
      description: 'Insufficient trading volume'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className={`p-4 rounded-lg border border-border ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <Icon name={card.icon} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-error'}`}>
              ${totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average P&L</p>
            <p className={`text-xl font-bold ${avgPnL >= 0 ? 'text-success' : 'text-error'}`}>
              ${avgPnL.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold text-foreground">
              {totalTrades > 0 ? ((trades.filter(t => t.pnl > 0).length / totalTrades) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Validation Issues */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Validation Issues</h3>
        <div className="space-y-3">
          {validationIssues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={issue.icon} 
                  size={20} 
                  className={issue.count > 0 ? 'text-warning' : 'text-success'} 
                />
                <div>
                  <p className="font-medium text-foreground">{issue.title}</p>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${issue.count > 0 ? 'text-warning' : 'text-success'}`}>
                  {issue.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalTrades > 0 ? ((issue.count / totalTrades) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center space-x-3 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-200">
            <Icon name="CheckCircle" size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Approve All Valid</p>
              <p className="text-sm text-muted-foreground">Approve trades without issues</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-3 bg-warning/10 hover:bg-warning/20 rounded-lg transition-colors duration-200">
            <Icon name="Flag" size={20} className="text-warning" />
            <div className="text-left">
              <p className="font-medium text-foreground">Flag Suspicious</p>
              <p className="text-sm text-muted-foreground">Flag trades with validation issues</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationSummary;