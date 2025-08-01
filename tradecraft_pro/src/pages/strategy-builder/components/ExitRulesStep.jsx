import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExitRulesStep = ({ formData, onFormChange }) => {
  const exitTypes = [
    { value: 'fixed_target', label: 'Fixed Target' },
    { value: 'trailing_stop', label: 'Trailing Stop' },
    { value: 'time_based', label: 'Time-Based Exit' },
    { value: 'indicator_based', label: 'Indicator-Based Exit' }
  ];

  const stopLossTypes = [
    { value: 'fixed_percentage', label: 'Fixed Percentage' },
    { value: 'atr_based', label: 'ATR-Based' },
    { value: 'support_resistance', label: 'Support/Resistance' },
    { value: 'volatility_based', label: 'Volatility-Based' }
  ];

  const trailingMethods = [
    { value: 'percentage', label: 'Percentage Trailing' },
    { value: 'atr_trailing', label: 'ATR Trailing' },
    { value: 'high_low', label: 'High/Low Trailing' },
    { value: 'parabolic_sar', label: 'Parabolic SAR' }
  ];

  const exitConditions = [
    { value: 'profit_target', label: 'Profit Target Hit' },
    { value: 'stop_loss', label: 'Stop Loss Hit' },
    { value: 'time_exit', label: 'Time-Based Exit' },
    { value: 'signal_reversal', label: 'Signal Reversal' },
    { value: 'volume_decline', label: 'Volume Decline' }
  ];

  const handleExitConditionToggle = (condition) => {
    const currentConditions = formData.exitConditions || [];
    const updatedConditions = currentConditions.includes(condition)
      ? currentConditions.filter(c => c !== condition)
      : [...currentConditions, condition];
    
    onFormChange({
      ...formData,
      exitConditions: updatedConditions
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Exit Rules</h3>
        <p className="text-muted-foreground mb-8">
          Configure how and when your strategy will exit positions to manage risk and capture profits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Select
            label="Primary Exit Type"
            description="Main method for exiting positions"
            options={exitTypes}
            value={formData.primaryExitType}
            onChange={(value) => onFormChange({ ...formData, primaryExitType: value })}
            required
            className="mb-6"
          />

          <Select
            label="Stop Loss Type"
            description="Method for calculating stop losses"
            options={stopLossTypes}
            value={formData.stopLossType}
            onChange={(value) => onFormChange({ ...formData, stopLossType: value })}
            required
            className="mb-6"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Take Profit %"
              type="number"
              placeholder="2.5"
              description="Target profit percentage"
              value={formData.takeProfitPercent}
              onChange={(e) => onFormChange({ ...formData, takeProfitPercent: e.target.value })}
            />

            <Input
              label="Stop Loss %"
              type="number"
              placeholder="1.5"
              description="Maximum loss percentage"
              value={formData.stopLossPercent}
              onChange={(e) => onFormChange({ ...formData, stopLossPercent: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Exit Conditions
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Select conditions that trigger position exits
            </p>
            
            <div className="space-y-3 p-4 border border-border rounded-lg bg-background">
              {exitConditions.map((condition) => (
                <Checkbox
                  key={condition.value}
                  label={condition.label}
                  checked={(formData.exitConditions || []).includes(condition.value)}
                  onChange={() => handleExitConditionToggle(condition.value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Select
            label="Trailing Method"
            description="Method for trailing stop implementation"
            options={trailingMethods}
            value={formData.trailingMethod}
            onChange={(value) => onFormChange({ ...formData, trailingMethod: value })}
            className="mb-6"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Trailing Distance"
              type="number"
              placeholder="1.0"
              description="Distance for trailing stop"
              value={formData.trailingDistance}
              onChange={(e) => onFormChange({ ...formData, trailingDistance: e.target.value })}
            />

            <Input
              label="Max Hold Time (Hours)"
              type="number"
              placeholder="24"
              description="Maximum position hold time"
              value={formData.maxHoldTime}
              onChange={(e) => onFormChange({ ...formData, maxHoldTime: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Partial Exit %"
              type="number"
              placeholder="50"
              description="Percentage for partial exits"
              value={formData.partialExitPercent}
              onChange={(e) => onFormChange({ ...formData, partialExitPercent: e.target.value })}
            />

            <Input
              label="Break-even Trigger"
              type="number"
              placeholder="1.0"
              description="Profit % to move to break-even"
              value={formData.breakEvenTrigger}
              onChange={(e) => onFormChange({ ...formData, breakEvenTrigger: e.target.value })}
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Exit Strategy Summary</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Primary Exit: {formData.primaryExitType || 'Not selected'}</p>
              <p>Stop Loss: {formData.stopLossType || 'Not selected'}</p>
              <p>Take Profit: {formData.takeProfitPercent || 'Not set'}%</p>
              <p>Stop Loss: {formData.stopLossPercent || 'Not set'}%</p>
              <p>Exit Conditions: {(formData.exitConditions || []).length} selected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitRulesStep;