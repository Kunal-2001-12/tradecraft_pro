import React from 'react';
import Icon from '../../../components/AppIcon';

const StrategyOutline = ({ isCollapsed, onToggle, completedSteps, currentStep }) => {
  const outlineItems = [
    {
      id: 1,
      title: 'Market Selection',
      items: ['Asset Class', 'Symbols', 'Timeframe'],
      icon: 'TrendingUp'
    },
    {
      id: 2,
      title: 'Entry Conditions',
      items: ['Technical Indicators', 'Price Action', 'Volume Filters'],
      icon: 'ArrowRight'
    },
    {
      id: 3,
      title: 'Exit Rules',
      items: ['Take Profit', 'Stop Loss', 'Trailing Stops'],
      icon: 'ArrowLeft'
    },
    {
      id: 4,
      title: 'Risk Parameters',
      items: ['Position Size', 'Max Risk', 'Drawdown Limits'],
      icon: 'Shield'
    },
    {
      id: 5,
      title: 'Order Types',
      items: ['Market Orders', 'Limit Orders', 'Stop Orders'],
      icon: 'FileText'
    }
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border">
        <div className="p-2">
          <button
            onClick={onToggle}
            className="w-full h-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Strategy Outline</h3>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {outlineItems.map((item) => {
          const isCompleted = completedSteps.includes(item.id);
          const isActive = currentStep === item.id;
          
          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isActive
                  ? 'border-primary bg-primary/5'
                  : isCompleted
                  ? 'border-success bg-success/5' :'border-border bg-background'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-success text-success-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <Icon name={item.icon} size={14} />
                  )}
                </div>
                <h4 className={`font-medium ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item.title}
                </h4>
              </div>
              
              <div className="ml-11 space-y-1">
                {item.items.map((subItem, index) => (
                  <div
                    key={index}
                    className={`text-sm flex items-center space-x-2 ${
                      isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isCompleted ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                    <span>{subItem}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>Progress: {completedSteps.length}/5 steps completed</p>
          <p>Last saved: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StrategyOutline;