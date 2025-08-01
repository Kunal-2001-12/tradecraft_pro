import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StrategyPreview = ({ formData, onClose, onEdit, onProceedToBacktest }) => {
  const getSelectedItems = (items, allOptions) => {
    if (!items || items.length === 0) return 'None selected';
    return items.map(item => {
      const option = allOptions.find(opt => opt.value === item);
      return option ? option.label : item;
    }).join(', ');
  };

  const previewSections = [
    {
      title: 'Market Selection',
      icon: 'TrendingUp',
      data: [
        { label: 'Asset Class', value: formData.assetClass || 'Not selected' },
        { label: 'Primary Timeframe', value: formData.primaryTimeframe || 'Not selected' },
        { label: 'Secondary Timeframe', value: formData.secondaryTimeframe || 'None' },
        { label: 'Selected Symbols', value: (formData.symbols || []).join(', ') || 'None selected' }
      ]
    },
    {
      title: 'Entry Conditions',
      icon: 'ArrowRight',
      data: [
        { label: 'Entry Type', value: formData.entryType || 'Not selected' },
        { label: 'Technical Indicators', value: (formData.indicators || []).join(', ') || 'None selected' },
        { label: 'Price Action Patterns', value: (formData.priceActionPatterns || []).join(', ') || 'None selected' },
        { label: 'Min Volume Filter', value: formData.minVolume || 'Not set' },
        { label: 'RSI Range', value: `${formData.rsiLower || 'Not set'} - ${formData.rsiUpper || 'Not set'}` }
      ]
    },
    {
      title: 'Exit Rules',
      icon: 'ArrowLeft',
      data: [
        { label: 'Primary Exit Type', value: formData.primaryExitType || 'Not selected' },
        { label: 'Stop Loss Type', value: formData.stopLossType || 'Not selected' },
        { label: 'Take Profit %', value: `${formData.takeProfitPercent || 'Not set'}%` },
        { label: 'Stop Loss %', value: `${formData.stopLossPercent || 'Not set'}%` },
        { label: 'Trailing Method', value: formData.trailingMethod || 'Not selected' },
        { label: 'Max Hold Time', value: `${formData.maxHoldTime || 'Not set'} hours` }
      ]
    },
    {
      title: 'Risk Parameters',
      icon: 'Shield',
      data: [
        { label: 'Position Sizing Method', value: formData.positionSizingMethod || 'Not selected' },
        { label: 'Portfolio Risk %', value: `${formData.portfolioRiskPercent || 'Not set'}%` },
        { label: 'Max Daily Risk %', value: `${formData.maxDailyRisk || 'Not set'}%` },
        { label: 'Max Drawdown %', value: `${formData.maxDrawdown || 'Not set'}%` },
        { label: 'Max Positions', value: formData.maxPositions || 'Not set' },
        { label: 'Consecutive Loss Limit', value: formData.consecutiveLossLimit || 'Not set' }
      ]
    },
    {
      title: 'Order Types',
      icon: 'FileText',
      data: [
        { label: 'Enabled Order Types', value: (formData.enabledOrderTypes || []).join(', ') || 'None selected' },
        { label: 'Max Slippage %', value: `${formData.maxSlippage || 'Not set'}%` },
        { label: 'Order Timeout', value: `${formData.orderTimeout || 'Not set'} seconds` },
        { label: 'Order Size Range', value: `${formData.minOrderSize || 'Not set'} - ${formData.maxOrderSize || 'Not set'}` }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Strategy Preview</h2>
              <p className="text-sm text-muted-foreground">Review your strategy configuration</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previewSections.map((section, index) => (
              <div key={index} className="bg-background rounded-lg border border-border p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={section.icon} size={16} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{section.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {section.data.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground font-medium">
                        {item.label}:
                      </span>
                      <span className="text-sm text-foreground text-right max-w-[60%]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Summary */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Info" size={16} className="mr-2 text-primary" />
              Strategy Summary
            </h3>
            <p className="text-sm text-muted-foreground">
              This strategy will trade {formData.assetClass || 'selected assets'} using {formData.primaryTimeframe || 'specified timeframe'} 
              with {formData.entryType || 'configured entry'} orders. Risk is managed with {formData.stopLossPercent || 'X'}% stop loss 
              and {formData.takeProfitPercent || 'Y'}% take profit targets. Position sizing follows {formData.positionSizingMethod || 'selected method'} 
              with maximum {formData.portfolioRiskPercent || 'Z'}% portfolio risk per trade.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>Created: {new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onEdit}>
              Edit Strategy
            </Button>
            <Button variant="success" onClick={onProceedToBacktest}>
              Proceed to Backtest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyPreview;