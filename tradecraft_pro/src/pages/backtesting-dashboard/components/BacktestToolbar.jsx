import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BacktestToolbar = ({ 
  onRunBacktest, 
  onExportResults, 
  onOptimizeStrategy, 
  isRunning = false,
  progress = 0 
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportOptions = [
    { label: 'Export as CSV', icon: 'FileText', action: () => onExportResults('csv') },
    { label: 'Export as PDF Report', icon: 'FileDown', action: () => onExportResults('pdf') },
    { label: 'Export Python Code', icon: 'Code', action: () => onExportResults('python') },
    { label: 'Export JSON Data', icon: 'Database', action: () => onExportResults('json') }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Primary Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={onRunBacktest}
            disabled={isRunning}
            loading={isRunning}
            iconName={isRunning ? "Loader2" : "Play"}
            iconPosition="left"
          >
            {isRunning ? 'Running Backtest...' : 'Run New Backtest'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onOptimizeStrategy}
            disabled={isRunning}
            iconName="Zap"
            iconPosition="left"
          >
            Optimize Strategy
          </Button>
          
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isRunning}
              iconName="Download"
              iconPosition="left"
            >
              Export Results
              <Icon name="ChevronDown" size={14} className="ml-2" />
            </Button>
            
            {showExportMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {exportOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.action();
                        setShowExportMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
                    >
                      <Icon name={option.icon} size={16} className="mr-3 text-muted-foreground" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Status and Info */}
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          {isRunning && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Est. 2m 30s remaining</span>
              </div>
            </div>
          )}
          
          {/* Last Run Info */}
          {!isRunning && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} />
                <span>Last run: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="BarChart3" size={14} />
                <span>1,247 trades analyzed</span>
              </div>
            </div>
          )}
          
          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            disabled={isRunning}
            className="h-9 w-9"
          >
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>

      {/* Running Status Bar */}
      {isRunning && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Backtesting in progress</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Processing historical data from 2020-01-01 to 2024-07-30
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-error hover:text-error hover:bg-error/10"
            >
              <Icon name="X" size={14} className="mr-2" />
              Cancel
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Current phase: Calculating performance metrics and generating trade signals
          </div>
        </div>
      )}

      {/* Click outside handler for export menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};

export default BacktestToolbar;