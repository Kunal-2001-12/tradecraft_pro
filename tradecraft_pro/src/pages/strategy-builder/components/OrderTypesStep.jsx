import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const OrderTypesStep = ({ formData, onFormChange }) => {
  const orderTypes = [
    { value: 'market', label: 'Market Orders', description: 'Execute immediately at current market price' },
    { value: 'limit', label: 'Limit Orders', description: 'Execute only at specified price or better' },
    { value: 'stop', label: 'Stop Orders', description: 'Trigger when price reaches stop level' },
    { value: 'stop_limit', label: 'Stop-Limit Orders', description: 'Combine stop and limit order features' },
    { value: 'trailing_stop', label: 'Trailing Stop Orders', description: 'Stop that adjusts with favorable price movement' },
    { value: 'trailing_limit', label: 'Trailing Limit Orders', description: 'Limit order that trails the market price' }
  ];

  const executionSettings = [
    { value: 'immediate_or_cancel', label: 'Immediate or Cancel (IOC)' },
    { value: 'fill_or_kill', label: 'Fill or Kill (FOK)' },
    { value: 'good_till_cancelled', label: 'Good Till Cancelled (GTC)' },
    { value: 'good_till_date', label: 'Good Till Date (GTD)' },
    { value: 'day_order', label: 'Day Order' }
  ];

  const slippageSettings = [
    { value: 'market_impact', label: 'Market Impact Protection' },
    { value: 'price_improvement', label: 'Price Improvement Seeking' },
    { value: 'volume_participation', label: 'Volume Participation Limits' },
    { value: 'time_weighted', label: 'Time-Weighted Execution' }
  ];

  const handleOrderTypeToggle = (orderType) => {
    const currentTypes = formData.enabledOrderTypes || [];
    const updatedTypes = currentTypes.includes(orderType)
      ? currentTypes.filter(t => t !== orderType)
      : [...currentTypes, orderType];
    
    onFormChange({
      ...formData,
      enabledOrderTypes: updatedTypes
    });
  };

  const handleExecutionSettingToggle = (setting) => {
    const currentSettings = formData.executionSettings || [];
    const updatedSettings = currentSettings.includes(setting)
      ? currentSettings.filter(s => s !== setting)
      : [...currentSettings, setting];
    
    onFormChange({
      ...formData,
      executionSettings: updatedSettings
    });
  };

  const handleSlippageSettingToggle = (setting) => {
    const currentSettings = formData.slippageSettings || [];
    const updatedSettings = currentSettings.includes(setting)
      ? currentSettings.filter(s => s !== setting)
      : [...currentSettings, setting];
    
    onFormChange({
      ...formData,
      slippageSettings: updatedSettings
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Order Types & Execution</h3>
        <p className="text-muted-foreground mb-8">
          Configure order types and execution parameters for optimal trade execution and slippage management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Enabled Order Types
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Select the order types your strategy will use
            </p>
            
            <div className="space-y-4 p-4 border border-border rounded-lg bg-background">
              {orderTypes.map((orderType) => (
                <div key={orderType.value} className="space-y-1">
                  <Checkbox
                    label={orderType.label}
                    checked={(formData.enabledOrderTypes || []).includes(orderType.value)}
                    onChange={() => handleOrderTypeToggle(orderType.value)}
                  />
                  <p className="text-xs text-muted-foreground ml-6">
                    {orderType.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Slippage %"
              type="number"
              placeholder="0.1"
              description="Maximum acceptable slippage"
              value={formData.maxSlippage}
              onChange={(e) => onFormChange({ ...formData, maxSlippage: e.target.value })}
            />

            <Input
              label="Order Timeout (Seconds)"
              type="number"
              placeholder="30"
              description="Time before order cancellation"
              value={formData.orderTimeout}
              onChange={(e) => onFormChange({ ...formData, orderTimeout: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Execution Settings
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Configure order execution behavior
            </p>
            
            <div className="space-y-3 p-4 border border-border rounded-lg bg-background">
              {executionSettings.map((setting) => (
                <Checkbox
                  key={setting.value}
                  label={setting.label}
                  checked={(formData.executionSettings || []).includes(setting.value)}
                  onChange={() => handleExecutionSettingToggle(setting.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Slippage Management
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Advanced slippage control features
            </p>
            
            <div className="space-y-3 p-4 border border-border rounded-lg bg-background">
              {slippageSettings.map((setting) => (
                <Checkbox
                  key={setting.value}
                  label={setting.label}
                  checked={(formData.slippageSettings || []).includes(setting.value)}
                  onChange={() => handleSlippageSettingToggle(setting.value)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Order Size"
              type="number"
              placeholder="100"
              description="Minimum shares per order"
              value={formData.minOrderSize}
              onChange={(e) => onFormChange({ ...formData, minOrderSize: e.target.value })}
            />

            <Input
              label="Max Order Size"
              type="number"
              placeholder="10000"
              description="Maximum shares per order"
              value={formData.maxOrderSize}
              onChange={(e) => onFormChange({ ...formData, maxOrderSize: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-success/10 border border-success rounded-lg">
          <h4 className="font-medium text-success mb-2 flex items-center">
            <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
            Market Orders
          </h4>
          <p className="text-sm text-success">
            Fast execution with immediate fills but potential slippage in volatile markets.
          </p>
        </div>

        <div className="p-4 bg-primary/10 border border-primary rounded-lg">
          <h4 className="font-medium text-primary mb-2 flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Limit Orders
          </h4>
          <p className="text-sm text-primary">
            Price control with potential for better fills but risk of non-execution.
          </p>
        </div>

        <div className="p-4 bg-warning/10 border border-warning rounded-lg">
          <h4 className="font-medium text-warning mb-2 flex items-center">
            <span className="w-2 h-2 bg-warning rounded-full mr-2"></span>
            Stop Orders
          </h4>
          <p className="text-sm text-warning">
            Risk management tool that becomes market order when triggered.
          </p>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Order Configuration Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p>Order Types: {(formData.enabledOrderTypes || []).length} enabled</p>
            <p>Max Slippage: {formData.maxSlippage || 'Not set'}%</p>
            <p>Order Timeout: {formData.orderTimeout || 'Not set'}s</p>
          </div>
          <div>
            <p>Execution Settings: {(formData.executionSettings || []).length} enabled</p>
            <p>Slippage Controls: {(formData.slippageSettings || []).length} enabled</p>
            <p>Order Size Range: {formData.minOrderSize || 'Not set'} - {formData.maxOrderSize || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTypesStep;