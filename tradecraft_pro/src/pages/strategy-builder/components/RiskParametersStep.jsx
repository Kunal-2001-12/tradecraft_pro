import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RiskParametersStep = ({ formData, onFormChange }) => {
  const positionSizingMethods = [
    { value: 'fixed_amount', label: 'Fixed Dollar Amount' },
    { value: 'fixed_shares', label: 'Fixed Number of Shares' },
    { value: 'percentage_portfolio', label: 'Percentage of Portfolio' },
    { value: 'risk_based', label: 'Risk-Based Sizing' },
    { value: 'volatility_adjusted', label: 'Volatility Adjusted' },
    { value: 'kelly_criterion', label: 'Kelly Criterion' }
  ];

  const riskMetrics = [
    { value: 'max_drawdown', label: 'Maximum Drawdown Limit' },
    { value: 'daily_loss_limit', label: 'Daily Loss Limit' },
    { value: 'consecutive_losses', label: 'Consecutive Loss Limit' },
    { value: 'var_limit', label: 'Value at Risk (VaR) Limit' },
    { value: 'correlation_limit', label: 'Position Correlation Limit' }
  ];

  const handleRiskMetricToggle = (metric) => {
    const currentMetrics = formData.riskMetrics || [];
    const updatedMetrics = currentMetrics.includes(metric)
      ? currentMetrics.filter(m => m !== metric)
      : [...currentMetrics, metric];
    
    onFormChange({
      ...formData,
      riskMetrics: updatedMetrics
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Risk Parameters</h3>
        <p className="text-muted-foreground mb-8">
          Configure risk management settings to protect your capital and optimize position sizing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Select
            label="Position Sizing Method"
            description="How position sizes will be calculated"
            options={positionSizingMethods}
            value={formData.positionSizingMethod}
            onChange={(value) => onFormChange({ ...formData, positionSizingMethod: value })}
            required
            className="mb-6"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Position Size"
              type="number"
              placeholder="10000"
              description="Maximum dollar amount per position"
              value={formData.maxPositionSize}
              onChange={(e) => onFormChange({ ...formData, maxPositionSize: e.target.value })}
            />

            <Input
              label="Portfolio Risk %"
              type="number"
              placeholder="2.0"
              description="Max risk per trade as % of portfolio"
              value={formData.portfolioRiskPercent}
              onChange={(e) => onFormChange({ ...formData, portfolioRiskPercent: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Daily Risk %"
              type="number"
              placeholder="5.0"
              description="Maximum daily portfolio risk"
              value={formData.maxDailyRisk}
              onChange={(e) => onFormChange({ ...formData, maxDailyRisk: e.target.value })}
            />

            <Input
              label="Max Drawdown %"
              type="number"
              placeholder="10.0"
              description="Maximum acceptable drawdown"
              value={formData.maxDrawdown}
              onChange={(e) => onFormChange({ ...formData, maxDrawdown: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Risk Management Controls
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Select risk controls to implement
            </p>
            
            <div className="space-y-3 p-4 border border-border rounded-lg bg-background">
              {riskMetrics.map((metric) => (
                <Checkbox
                  key={metric.value}
                  label={metric.label}
                  checked={(formData.riskMetrics || []).includes(metric.value)}
                  onChange={() => handleRiskMetricToggle(metric.value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Positions"
              type="number"
              placeholder="10"
              description="Maximum concurrent positions"
              value={formData.maxPositions}
              onChange={(e) => onFormChange({ ...formData, maxPositions: e.target.value })}
            />

            <Input
              label="Max Sector Exposure %"
              type="number"
              placeholder="25.0"
              description="Maximum exposure per sector"
              value={formData.maxSectorExposure}
              onChange={(e) => onFormChange({ ...formData, maxSectorExposure: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Consecutive Loss Limit"
              type="number"
              placeholder="3"
              description="Max consecutive losing trades"
              value={formData.consecutiveLossLimit}
              onChange={(e) => onFormChange({ ...formData, consecutiveLossLimit: e.target.value })}
            />

            <Input
              label="Cool-down Period (Hours)"
              type="number"
              placeholder="24"
              description="Wait time after loss limit hit"
              value={formData.cooldownPeriod}
              onChange={(e) => onFormChange({ ...formData, cooldownPeriod: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Volatility Multiplier"
              type="number"
              placeholder="1.5"
              description="ATR multiplier for position sizing"
              value={formData.volatilityMultiplier}
              onChange={(e) => onFormChange({ ...formData, volatilityMultiplier: e.target.value })}
            />

            <Input
              label="Correlation Threshold"
              type="number"
              placeholder="0.7"
              description="Max correlation between positions"
              value={formData.correlationThreshold}
              onChange={(e) => onFormChange({ ...formData, correlationThreshold: e.target.value })}
            />
          </div>

          <div className="p-4 bg-warning/10 border border-warning rounded-lg">
            <h4 className="font-medium text-warning mb-2 flex items-center">
              <span className="w-2 h-2 bg-warning rounded-full mr-2"></span>
              Risk Warning
            </h4>
            <p className="text-sm text-warning">
              These risk parameters are critical for capital preservation. 
              Conservative settings are recommended for live trading.
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Risk Configuration</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Position Sizing: {formData.positionSizingMethod || 'Not selected'}</p>
              <p>Max Risk per Trade: {formData.portfolioRiskPercent || 'Not set'}%</p>
              <p>Max Daily Risk: {formData.maxDailyRisk || 'Not set'}%</p>
              <p>Max Positions: {formData.maxPositions || 'Not set'}</p>
              <p>Risk Controls: {(formData.riskMetrics || []).length} enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskParametersStep;