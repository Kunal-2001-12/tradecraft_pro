import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const EntryConditionsStep = ({ formData, onFormChange }) => {
  const indicators = [
    { value: 'sma', label: 'Simple Moving Average (SMA)' },
    { value: 'ema', label: 'Exponential Moving Average (EMA)' },
    { value: 'rsi', label: 'Relative Strength Index (RSI)' },
    { value: 'macd', label: 'MACD' },
    { value: 'bollinger', label: 'Bollinger Bands' },
    { value: 'stochastic', label: 'Stochastic Oscillator' },
    { value: 'atr', label: 'Average True Range (ATR)' },
    { value: 'volume', label: 'Volume Analysis' }
  ];

  const priceActionPatterns = [
    { value: 'breakout', label: 'Breakout Pattern' },
    { value: 'pullback', label: 'Pullback Entry' },
    { value: 'reversal', label: 'Reversal Pattern' },
    { value: 'continuation', label: 'Continuation Pattern' },
    { value: 'support_resistance', label: 'Support/Resistance' }
  ];

  const entryTypes = [
    { value: 'market', label: 'Market Entry' },
    { value: 'limit', label: 'Limit Entry' },
    { value: 'stop', label: 'Stop Entry' },
    { value: 'conditional', label: 'Conditional Entry' }
  ];

  const handleIndicatorToggle = (indicator) => {
    const currentIndicators = formData.indicators || [];
    const updatedIndicators = currentIndicators.includes(indicator)
      ? currentIndicators.filter(i => i !== indicator)
      : [...currentIndicators, indicator];
    
    onFormChange({
      ...formData,
      indicators: updatedIndicators
    });
  };

  const handlePatternToggle = (pattern) => {
    const currentPatterns = formData.priceActionPatterns || [];
    const updatedPatterns = currentPatterns.includes(pattern)
      ? currentPatterns.filter(p => p !== pattern)
      : [...currentPatterns, pattern];
    
    onFormChange({
      ...formData,
      priceActionPatterns: updatedPatterns
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Entry Conditions</h3>
        <p className="text-muted-foreground mb-8">
          Define the conditions that will trigger trade entries for your strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Technical Indicators
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Select indicators for entry signal generation
            </p>
            
            <div className="space-y-3 max-h-64 overflow-y-auto p-4 border border-border rounded-lg bg-background">
              {indicators.map((indicator) => (
                <Checkbox
                  key={indicator.value}
                  label={indicator.label}
                  checked={(formData.indicators || []).includes(indicator.value)}
                  onChange={() => handleIndicatorToggle(indicator.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Price Action Patterns
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose price action patterns for entry signals
            </p>
            
            <div className="space-y-3 p-4 border border-border rounded-lg bg-background">
              {priceActionPatterns.map((pattern) => (
                <Checkbox
                  key={pattern.value}
                  label={pattern.label}
                  checked={(formData.priceActionPatterns || []).includes(pattern.value)}
                  onChange={() => handlePatternToggle(pattern.value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Select
            label="Entry Type"
            description="How trades will be entered"
            options={entryTypes}
            value={formData.entryType}
            onChange={(value) => onFormChange({ ...formData, entryType: value })}
            required
            className="mb-6"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Volume Filter"
              type="number"
              placeholder="1000000"
              description="Minimum volume required"
              value={formData.minVolume}
              onChange={(e) => onFormChange({ ...formData, minVolume: e.target.value })}
            />

            <Input
              label="Min Price Filter"
              type="number"
              placeholder="5.00"
              description="Minimum price per share"
              value={formData.minPrice}
              onChange={(e) => onFormChange({ ...formData, minPrice: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="RSI Lower Bound"
              type="number"
              placeholder="30"
              description="RSI oversold level"
              value={formData.rsiLower}
              onChange={(e) => onFormChange({ ...formData, rsiLower: e.target.value })}
            />

            <Input
              label="RSI Upper Bound"
              type="number"
              placeholder="70"
              description="RSI overbought level"
              value={formData.rsiUpper}
              onChange={(e) => onFormChange({ ...formData, rsiUpper: e.target.value })}
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Entry Configuration</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Indicators: {(formData.indicators || []).length} selected</p>
              <p>Patterns: {(formData.priceActionPatterns || []).length} selected</p>
              <p>Entry Type: {formData.entryType || 'Not selected'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryConditionsStep;