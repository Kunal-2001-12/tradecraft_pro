import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  // Get contextual content based on current route
  const getContextualContent = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/strategy-builder':
        return {
          title: 'Strategy Tools',
          sections: [
            {
              title: 'Templates',
              items: [
                { label: 'Momentum Strategy', icon: 'TrendingUp', action: () => {} },
                { label: 'Mean Reversion', icon: 'RotateCcw', action: () => {} },
                { label: 'Breakout Strategy', icon: 'Zap', action: () => {} },
                { label: 'Custom Template', icon: 'Plus', action: () => {} },
              ]
            },
            {
              title: 'Parameters',
              items: [
                { label: 'Risk Management', icon: 'Shield', action: () => {} },
                { label: 'Entry Conditions', icon: 'ArrowRight', action: () => {} },
                { label: 'Exit Rules', icon: 'ArrowLeft', action: () => {} },
                { label: 'Position Sizing', icon: 'DollarSign', action: () => {} },
              ]
            }
          ]
        };
      
      case '/backtesting-dashboard':
        return {
          title: 'Backtest Filters',
          sections: [
            {
              title: 'Time Range',
              items: [
                { label: 'Last 30 Days', icon: 'Calendar', action: () => {} },
                { label: 'Last 3 Months', icon: 'Calendar', action: () => {} },
                { label: 'Last Year', icon: 'Calendar', action: () => {} },
                { label: 'Custom Range', icon: 'CalendarDays', action: () => {} },
              ]
            },
            {
              title: 'Markets',
              items: [
                { label: 'Stocks', icon: 'TrendingUp', action: () => {} },
                { label: 'Forex', icon: 'Globe', action: () => {} },
                { label: 'Crypto', icon: 'Bitcoin', action: () => {} },
                { label: 'Commodities', icon: 'Wheat', action: () => {} },
              ]
            }
          ]
        };
      
      case '/performance-analytics-dashboard':
        return {
          title: 'Analytics Filters',
          sections: [
            {
              title: 'Metrics',
              items: [
                { label: 'Sharpe Ratio', icon: 'BarChart3', action: () => {} },
                { label: 'Max Drawdown', icon: 'TrendingDown', action: () => {} },
                { label: 'Win Rate', icon: 'Target', action: () => {} },
                { label: 'Profit Factor', icon: 'DollarSign', action: () => {} },
              ]
            },
            {
              title: 'Comparisons',
              items: [
                { label: 'Benchmark', icon: 'GitCompare', action: () => {} },
                { label: 'Peer Strategies', icon: 'Users', action: () => {} },
                { label: 'Market Index', icon: 'LineChart', action: () => {} },
                { label: 'Risk-Free Rate', icon: 'Minus', action: () => {} },
              ]
            }
          ]
        };
      
      case '/strategy-optimization-engine':
        return {
          title: 'Optimization Tools',
          sections: [
            {
              title: 'Algorithms',
              items: [
                { label: 'Genetic Algorithm', icon: 'Dna', action: () => {} },
                { label: 'Grid Search', icon: 'Grid3x3', action: () => {} },
                { label: 'Random Search', icon: 'Shuffle', action: () => {} },
                { label: 'Bayesian Opt.', icon: 'Brain', action: () => {} },
              ]
            },
            {
              title: 'Parameters',
              items: [
                { label: 'Population Size', icon: 'Users', action: () => {} },
                { label: 'Generations', icon: 'RotateCw', action: () => {} },
                { label: 'Mutation Rate', icon: 'Zap', action: () => {} },
                { label: 'Fitness Function', icon: 'Target', action: () => {} },
              ]
            }
          ]
        };
      
      case '/trade-verification-center':
        return {
          title: 'Verification Tools',
          sections: [
            {
              title: 'Status Filters',
              items: [
                { label: 'Pending Review', icon: 'Clock', action: () => {} },
                { label: 'Approved', icon: 'CheckCircle', action: () => {} },
                { label: 'Rejected', icon: 'XCircle', action: () => {} },
                { label: 'Flagged', icon: 'Flag', action: () => {} },
              ]
            },
            {
              title: 'Compliance',
              items: [
                { label: 'Risk Limits', icon: 'Shield', action: () => {} },
                { label: 'Regulatory', icon: 'FileText', action: () => {} },
                { label: 'Position Limits', icon: 'AlertTriangle', action: () => {} },
                { label: 'Audit Trail', icon: 'Search', action: () => {} },
              ]
            }
          ]
        };
      
      default:
        return {
          title: 'Quick Actions',
          sections: [
            {
              title: 'Recent',
              items: [
                { label: 'Last Strategy', icon: 'Clock', action: () => navigate('/strategy-builder') },
                { label: 'Recent Backtest', icon: 'History', action: () => navigate('/backtesting-dashboard') },
                { label: 'Latest Report', icon: 'FileText', action: () => navigate('/performance-analytics-dashboard') },
              ]
            }
          ]
        };
    }
  };

  const contextualContent = getContextualContent();

  if (isCollapsed) {
    return (
      <aside className="fixed left-0 top-16 bottom-0 z-100 w-16 bg-card border-r border-border transition-all duration-300 ease-out">
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full h-10"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-100 w-80 bg-card border-r border-border transition-all duration-300 ease-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{contextualContent.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {contextualContent.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="flex items-center w-full space-x-3 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={item.icon} size={16} className="text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;