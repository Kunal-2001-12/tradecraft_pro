import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OptimizationProgress = ({ isOptimizing, optimizationConfig, onPauseResume, onStop }) => {
  const [progress, setProgress] = useState(0);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [bestResults, setBestResults] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock optimization results data
  const mockResults = [
    {
      id: 1,
      parameters: { stopLoss: 2.5, takeProfit: 5.0, positionSize: 2.0 },
      performance: {
        totalReturn: 24.5,
        sharpeRatio: 1.85,
        maxDrawdown: 8.2,
        winRate: 68.5,
        profitFactor: 2.1
      },
      status: 'completed',
      rank: 1
    },
    {
      id: 2,
      parameters: { stopLoss: 2.0, takeProfit: 6.0, positionSize: 1.5 },
      performance: {
        totalReturn: 22.8,
        sharpeRatio: 1.72,
        maxDrawdown: 9.1,
        winRate: 65.2,
        profitFactor: 1.95
      },
      status: 'completed',
      rank: 2
    },
    {
      id: 3,
      parameters: { stopLoss: 3.0, takeProfit: 4.5, positionSize: 2.5 },
      performance: {
        totalReturn: 21.3,
        sharpeRatio: 1.68,
        maxDrawdown: 7.8,
        winRate: 71.2,
        profitFactor: 2.05
      },
      status: 'completed',
      rank: 3
    },
    {
      id: 4,
      parameters: { stopLoss: 1.5, takeProfit: 7.0, positionSize: 1.0 },
      performance: {
        totalReturn: 19.7,
        sharpeRatio: 1.55,
        maxDrawdown: 11.2,
        winRate: 62.8,
        profitFactor: 1.82
      },
      status: 'running',
      rank: 4
    },
    {
      id: 5,
      parameters: { stopLoss: 2.8, takeProfit: 5.5, positionSize: 1.8 },
      performance: {
        totalReturn: 18.9,
        sharpeRatio: 1.48,
        maxDrawdown: 10.5,
        winRate: 64.1,
        profitFactor: 1.76
      },
      status: 'pending',
      rank: 5
    }
  ];

  // Simulate optimization progress
  useEffect(() => {
    let interval;
    if (isOptimizing && !isPaused) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 2, 100);
          if (optimizationConfig?.settings?.algorithm === 'genetic') {
            setCurrentGeneration(Math.floor((newProgress / 100) * optimizationConfig.settings.generations));
          }
          return newProgress;
        });
        setElapsedTime(prev => prev + 1);
        
        // Update best results periodically
        if (Math.random() > 0.7) {
          setBestResults(mockResults.slice(0, Math.floor(Math.random() * 5) + 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOptimizing, isPaused, optimizationConfig]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    onPauseResume(!isPaused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'running': return 'text-warning';
      case 'pending': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'running': return 'Clock';
      case 'pending': return 'Circle';
      default: return 'Circle';
    }
  };

  if (!isOptimizing && bestResults.length === 0) {
    return (
      <div className="h-full flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Activity" size={20} className="mr-2" />
            Optimization Progress
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Play" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to Optimize</h3>
            <p className="text-sm text-muted-foreground">Configure parameters and start optimization to see progress</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Activity" size={20} className="mr-2" />
            Optimization Progress
          </h2>
          {isOptimizing && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseResume}
                iconName={isPaused ? "Play" : "Pause"}
                iconPosition="left"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onStop}
                iconName="Square"
                iconPosition="left"
              >
                Stop
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Progress Overview */}
        {isOptimizing && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Overall Progress</h3>
              <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Elapsed Time</p>
                <p className="font-medium text-foreground">{formatTime(elapsedTime)}</p>
              </div>
              {optimizationConfig?.settings?.algorithm === 'genetic' && (
                <div>
                  <p className="text-muted-foreground">Generation</p>
                  <p className="font-medium text-foreground">
                    {currentGeneration} / {optimizationConfig.settings.generations}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium text-foreground">
                  {isPaused ? 'Paused' : 'Running'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Trophy" size={16} className="mr-2" />
            Top Results
          </h3>
          <div className="space-y-2">
            {bestResults.map((result) => (
              <div key={result.id} className="p-3 bg-muted/20 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">#{result.rank}</span>
                    <Icon 
                      name={getStatusIcon(result.status)} 
                      size={14} 
                      className={getStatusColor(result.status)} 
                    />
                  </div>
                  <div className="text-sm font-medium text-success">
                    +{result.performance.totalReturn}%
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Sharpe:</span>
                    <span className="ml-1 text-foreground">{result.performance.sharpeRatio}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className="ml-1 text-foreground">{result.performance.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Drawdown:</span>
                    <span className="ml-1 text-error">{result.performance.maxDrawdown}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">PF:</span>
                    <span className="ml-1 text-foreground">{result.performance.profitFactor}</span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    SL: {result.parameters.stopLoss}% | 
                    TP: {result.parameters.takeProfit}% | 
                    Size: {result.parameters.positionSize}x
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Info */}
        {optimizationConfig && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Algorithm Details</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Algorithm: {optimizationConfig.settings.algorithm.toUpperCase()}</p>
              <p>Total Combinations: {optimizationConfig.totalCombinations?.toLocaleString()}</p>
              {optimizationConfig.settings.populationSize && (
                <p>Population Size: {optimizationConfig.settings.populationSize}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Results */}
      {bestResults.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            iconPosition="left"
          >
            Export Best Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default OptimizationProgress;