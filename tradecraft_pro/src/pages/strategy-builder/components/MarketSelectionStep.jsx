import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MarketSelectionStep = ({ formData, onFormChange }) => {
  const assetClasses = [
    { value: 'stocks', label: 'Stocks' },
    { value: 'forex', label: 'Forex' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'indices', label: 'Indices' }
  ];

  const timeframes = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' }
  ];

  const popularSymbols = {
    stocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'],
    forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
    crypto: ['BTC/USD', 'ETH/USD', 'ADA/USD', 'DOT/USD', 'LINK/USD', 'SOL/USD'],
    commodities: ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'WHEAT', 'CORN'],
    indices: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO']
  };

  const handleAssetClassChange = (value) => {
    onFormChange({
      ...formData,
      assetClass: value,
      symbols: [] // Reset symbols when asset class changes
    });
  };

  const handleSymbolToggle = (symbol) => {
    const currentSymbols = formData.symbols || [];
    const updatedSymbols = currentSymbols.includes(symbol)
      ? currentSymbols.filter(s => s !== symbol)
      : [...currentSymbols, symbol];
    
    onFormChange({
      ...formData,
      symbols: updatedSymbols
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">Market Selection</h3>
        <p className="text-muted-foreground mb-8">
          Choose the markets and instruments for your trading strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Select
            label="Asset Class"
            description="Select the primary asset class for your strategy"
            options={assetClasses}
            value={formData.assetClass}
            onChange={handleAssetClassChange}
            required
            className="mb-6"
          />

          <Select
            label="Primary Timeframe"
            description="Main timeframe for strategy execution"
            options={timeframes}
            value={formData.primaryTimeframe}
            onChange={(value) => onFormChange({ ...formData, primaryTimeframe: value })}
            required
            className="mb-6"
          />

          <Select
            label="Secondary Timeframe (Optional)"
            description="Additional timeframe for confirmation signals"
            options={timeframes}
            value={formData.secondaryTimeframe}
            onChange={(value) => onFormChange({ ...formData, secondaryTimeframe: value })}
            className="mb-6"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Symbols
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the specific instruments to trade
            </p>
            
            {formData.assetClass && (
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 border border-border rounded-lg bg-background">
                {popularSymbols[formData.assetClass]?.map((symbol) => (
                  <Checkbox
                    key={symbol}
                    label={symbol}
                    checked={(formData.symbols || []).includes(symbol)}
                    onChange={() => handleSymbolToggle(symbol)}
                  />
                ))}
              </div>
            )}
            
            {!formData.assetClass && (
              <div className="p-8 border border-dashed border-border rounded-lg text-center">
                <p className="text-muted-foreground">
                  Select an asset class to view available symbols
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Selection Summary</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Asset Class: {formData.assetClass || 'Not selected'}</p>
              <p>Primary Timeframe: {formData.primaryTimeframe || 'Not selected'}</p>
              <p>Symbols: {(formData.symbols || []).length} selected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSelectionStep;