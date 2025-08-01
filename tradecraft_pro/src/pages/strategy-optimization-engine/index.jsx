import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import OptimizationParameters from './components/OptimizationParameters';
import OptimizationProgress from './components/OptimizationProgress';
import PerformanceCharts from './components/PerformanceCharts';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const StrategyOptimizationEngine = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationConfig, setOptimizationConfig] = useState(null);
  const [bestResults, setBestResults] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartOptimization = (config) => {
    setOptimizationConfig(config);
    setIsOptimizing(true);
    setIsPaused(false);
    setBestResults([]);
  };

  const handlePauseResume = (paused) => {
    setIsPaused(paused);
  };

  const handleStopOptimization = () => {
    setIsOptimizing(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-80 pt-16">
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Icon name="Zap" size={28} className="mr-3" />
                  Strategy Optimization Engine
                </h1>
                <p className="text-muted-foreground mt-1">
                  Systematically optimize your trading strategies through automated parameter tuning and performance analysis
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} />
                    <span>Last run: 2 hours ago</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  iconName="History"
                  iconPosition="left"
                >
                  View History
                </Button>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {isOptimizing && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {isPaused ? 'Optimization Paused' : 'Optimization Running'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isPaused 
                        ? 'Click Resume to continue optimization process' :'Testing parameter combinations and analyzing performance metrics'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Activity" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {optimizationConfig?.totalCombinations?.toLocaleString()} combinations
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
            {/* Left Panel - Parameters */}
            <div className="col-span-3">
              <div className="h-full border border-border rounded-lg overflow-hidden">
                <OptimizationParameters 
                  onStartOptimization={handleStartOptimization}
                  isOptimizing={isOptimizing}
                />
              </div>
            </div>

            {/* Center Panel - Progress */}
            <div className="col-span-6">
              <div className="h-full border border-border rounded-lg overflow-hidden">
                <OptimizationProgress 
                  isOptimizing={isOptimizing}
                  optimizationConfig={optimizationConfig}
                  onPauseResume={handlePauseResume}
                  onStop={handleStopOptimization}
                />
              </div>
            </div>

            {/* Right Panel - Charts */}
            <div className="col-span-3">
              <div className="h-full border border-border rounded-lg overflow-hidden">
                <PerformanceCharts 
                  isOptimizing={isOptimizing}
                  bestResults={bestResults}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Quick Actions:</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                >
                  Load Template
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Config
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                  iconPosition="left"
                >
                  Share Results
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} />
                <span>Risk constraints active</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Layout */}
      <div className="lg:hidden fixed inset-0 bg-background pt-16">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border">
            <Breadcrumb />
            <h1 className="text-xl font-bold text-foreground flex items-center mt-2">
              <Icon name="Zap" size={24} className="mr-2" />
              Strategy Optimization
            </h1>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              {/* Mobile Tabs */}
              <div className="border-b border-border">
                <div className="flex">
                  <button className="flex-1 px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary bg-primary/10">
                    Parameters
                  </button>
                  <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground">
                    Progress
                  </button>
                  <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground">
                    Charts
                  </button>
                </div>
              </div>
              
              {/* Mobile Content */}
              <div className="h-[calc(100%-60px)]">
                <OptimizationParameters 
                  onStartOptimization={handleStartOptimization}
                  isOptimizing={isOptimizing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyOptimizationEngine;