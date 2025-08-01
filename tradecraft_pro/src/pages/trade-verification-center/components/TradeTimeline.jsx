import React from 'react';
import Icon from '../../../components/AppIcon';

const TradeTimeline = ({ trade }) => {
  if (!trade) return null;

  const timelineEvents = [
    {
      id: 1,
      type: 'signal',
      title: 'Signal Generated',
      description: 'Trading signal triggered based on strategy conditions',
      timestamp: new Date(trade.entryDate - 300000), // 5 minutes before entry
      icon: 'Zap',
      status: 'completed'
    },
    {
      id: 2,
      type: 'entry',
      title: 'Entry Order Placed',
      description: `${trade.direction.toUpperCase()} ${trade.quantity} shares at $${trade.entryPrice.toFixed(2)}`,
      timestamp: new Date(trade.entryDate),
      icon: 'ArrowRight',
      status: 'completed'
    },
    {
      id: 3,
      type: 'execution',
      title: 'Order Executed',
      description: `Filled at $${trade.entryPrice.toFixed(2)} with ${trade.executionDelay}ms delay`,
      timestamp: new Date(trade.entryDate + trade.executionDelay),
      icon: 'CheckCircle',
      status: 'completed'
    }
  ];

  // Add exit event if trade is closed
  if (trade.exitDate && trade.exitPrice) {
    timelineEvents.push({
      id: 4,
      type: 'exit',
      title: 'Exit Order Executed',
      description: `Closed at $${trade.exitPrice.toFixed(2)} - P&L: $${trade.pnl.toFixed(2)}`,
      timestamp: new Date(trade.exitDate),
      icon: 'ArrowLeft',
      status: 'completed'
    });
  }

  // Add validation events
  timelineEvents.push({
    id: 5,
    type: 'validation',
    title: 'Validation Check',
    description: 'Automated validation checks completed',
    timestamp: new Date(),
    icon: 'Shield',
    status: trade.hasLookaheadBias || !trade.realisticTiming ? 'warning' : 'completed'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'error':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getConnectorColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-success';
      case 'warning':
        return 'border-warning';
      case 'error':
        return 'border-error';
      default:
        return 'border-border';
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Trade Timeline</h3>
      <div className="relative">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start space-x-4 pb-6">
            {/* Connector Line */}
            {index < timelineEvents.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-6 border-l-2 ${getConnectorColor(event.status)}`}
              />
            )}
            
            {/* Icon */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(event.status)}`}>
              <Icon name={event.icon} size={20} />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              
              {/* Additional details for specific event types */}
              {event.type === 'execution' && (
                <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Slippage:</span>
                    <span className="ml-1 text-foreground">${trade.slippage.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commission:</span>
                    <span className="ml-1 text-foreground">${trade.commission.toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              {event.type === 'validation' && (
                <div className="mt-2 space-y-1">
                  {trade.hasLookaheadBias && (
                    <div className="flex items-center space-x-2 text-xs text-warning">
                      <Icon name="AlertTriangle" size={12} />
                      <span>Potential lookahead bias detected</span>
                    </div>
                  )}
                  {!trade.realisticTiming && (
                    <div className="flex items-center space-x-2 text-xs text-warning">
                      <Icon name="Clock" size={12} />
                      <span>Execution timing may be unrealistic</span>
                    </div>
                  )}
                  {!trade.validSpread && (
                    <div className="flex items-center space-x-2 text-xs text-warning">
                      <Icon name="TrendingDown" size={12} />
                      <span>Unusual spread detected</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeTimeline;