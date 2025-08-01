import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const OptimizationParameters = ({ onStartOptimization, isOptimizing }) => {
  const [parameters, setParameters] = useState({
    stopLoss: { min: 1, max: 5, step: 0.5 },
    takeProfit: { min: 2, max: 10, step: 0.5 },
    positionSize: { min: 0.5, max: 5, step: 0.5 },
    rsiPeriod: { min: 10, max: 30, step: 2 },
    maPeriod: { min: 20, max: 200, step: 10 }
  });

  const [constraints, setConstraints] = useState({
    maxDrawdown: 15,
    minWinRate: 60,
    minSharpeRatio: 1.2,
    maxConsecutiveLosses: 5
  });

  const [optimizationSettings, setOptimizationSettings] = useState({
    algorithm: 'genetic',
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8
  });

  const [enabledParameters, setEnabledParameters] = useState({
    stopLoss: true,
    takeProfit: true,
    positionSize: true,
    rsiPeriod: false,
    maPeriod: false
  });

  const algorithmOptions = [
    { value: 'genetic', label: 'Genetic Algorithm' },
    { value: 'grid', label: 'Grid Search' },
    { value: 'random', label: 'Random Search' },
    { value: 'bayesian', label: 'Bayesian Optimization' }
  ];

  const handleParameterChange = (param, field, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: {
        ...prev[param],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleConstraintChange = (constraint, value) => {
    setConstraints(prev => ({
      ...prev,
      [constraint]: parseFloat(value) || 0
    }));
  };

  const handleSettingChange = (setting, value) => {
    setOptimizationSettings(prev => ({
      ...prev,
      [setting]: setting === 'algorithm' ? value : parseFloat(value) || 0
    }));
  };

  const handleParameterToggle = (param, checked) => {
    setEnabledParameters(prev => ({
      ...prev,
      [param]: checked
    }));
  };

  const getEnabledParameterCount = () => {
    return Object.values(enabledParameters).filter(Boolean).length;
  };

  const calculateCombinations = () => {
    let combinations = 1;
    Object.entries(parameters).forEach(([param, config]) => {
      if (enabledParameters[param]) {
        const steps = Math.floor((config.max - config.min) / config.step) + 1;
        combinations *= steps;
      }
    });
    return combinations;
  };

  const handleStartOptimization = () => {
    const optimizationConfig = {
      parameters: Object.entries(parameters)
        .filter(([param]) => enabledParameters[param])
        .reduce((acc, [param, config]) => ({ ...acc, [param]: config }), {}),
      constraints,
      settings: optimizationSettings,
      totalCombinations: calculateCombinations()
    };
    onStartOptimization(optimizationConfig);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Optimization Parameters
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Strategy Parameters */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Sliders" size={16} className="mr-2" />
            Strategy Parameters
          </h3>
          <div className="space-y-4">
            {Object.entries(parameters).map(([param, config]) => (
              <div key={param} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Checkbox
                    label={param.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    checked={enabledParameters[param]}
                    onChange={(e) => handleParameterToggle(param, e.target.checked)}
                  />
                </div>
                {enabledParameters[param] && (
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      label="Min"
                      type="number"
                      value={config.min}
                      onChange={(e) => handleParameterChange(param, 'min', e.target.value)}
                      step={config.step}
                    />
                    <Input
                      label="Max"
                      type="number"
                      value={config.max}
                      onChange={(e) => handleParameterChange(param, 'max', e.target.value)}
                      step={config.step}
                    />
                    <Input
                      label="Step"
                      type="number"
                      value={config.step}
                      onChange={(e) => handleParameterChange(param, 'step', e.target.value)}
                      step={0.1}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="mr-2" />
            Risk Constraints
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Max Drawdown (%)"
              type="number"
              value={constraints.maxDrawdown}
              onChange={(e) => handleConstraintChange('maxDrawdown', e.target.value)}
              step={0.5}
            />
            <Input
              label="Min Win Rate (%)"
              type="number"
              value={constraints.minWinRate}
              onChange={(e) => handleConstraintChange('minWinRate', e.target.value)}
              step={1}
            />
            <Input
              label="Min Sharpe Ratio"
              type="number"
              value={constraints.minSharpeRatio}
              onChange={(e) => handleConstraintChange('minSharpeRatio', e.target.value)}
              step={0.1}
            />
            <Input
              label="Max Consecutive Losses"
              type="number"
              value={constraints.maxConsecutiveLosses}
              onChange={(e) => handleConstraintChange('maxConsecutiveLosses', e.target.value)}
              step={1}
            />
          </div>
        </div>

        {/* Algorithm Settings */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Brain" size={16} className="mr-2" />
            Algorithm Settings
          </h3>
          <div className="space-y-3">
            <Select
              label="Optimization Algorithm"
              options={algorithmOptions}
              value={optimizationSettings.algorithm}
              onChange={(value) => handleSettingChange('algorithm', value)}
            />
            {optimizationSettings.algorithm === 'genetic' && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Population Size"
                  type="number"
                  value={optimizationSettings.populationSize}
                  onChange={(e) => handleSettingChange('populationSize', e.target.value)}
                  step={10}
                />
                <Input
                  label="Generations"
                  type="number"
                  value={optimizationSettings.generations}
                  onChange={(e) => handleSettingChange('generations', e.target.value)}
                  step={10}
                />
                <Input
                  label="Mutation Rate"
                  type="number"
                  value={optimizationSettings.mutationRate}
                  onChange={(e) => handleSettingChange('mutationRate', e.target.value)}
                  step={0.01}
                />
                <Input
                  label="Crossover Rate"
                  type="number"
                  value={optimizationSettings.crossoverRate}
                  onChange={(e) => handleSettingChange('crossoverRate', e.target.value)}
                  step={0.01}
                />
              </div>
            )}
          </div>
        </div>

        {/* Optimization Summary */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">Optimization Summary</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Active Parameters: {getEnabledParameterCount()}</p>
            <p>Total Combinations: {calculateCombinations().toLocaleString()}</p>
            <p>Estimated Time: {Math.ceil(calculateCombinations() / 100)} minutes</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="default"
            fullWidth
            onClick={handleStartOptimization}
            disabled={isOptimizing || getEnabledParameterCount() === 0}
            loading={isOptimizing}
            iconName="Play"
            iconPosition="left"
          >
            {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
          </Button>
          <Button
            variant="outline"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Parameters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationParameters;