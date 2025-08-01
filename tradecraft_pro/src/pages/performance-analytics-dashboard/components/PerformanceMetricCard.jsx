import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  trend = 'neutral',
  subtitle,
  isLoading = false 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendBgColor = () => {
    switch (trend) {
      case 'positive': return 'bg-success/10';
      case 'negative': return 'bg-error/10';
      case 'warning': return 'bg-warning/10';
      default: return 'bg-muted';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') return 'TrendingUp';
    if (changeType === 'decrease') return 'TrendingDown';
    return 'Minus';
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-8 w-8 bg-muted rounded"></div>
        </div>
        <div className="h-8 bg-muted rounded w-32 mb-2"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-lg ${getTrendBgColor()}`}>
          <Icon name={icon} size={20} className={getTrendColor()} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        
        {subtitle && (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        )}
        
        {change && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getChangeIcon()} 
              size={14} 
              className={getTrendColor()} 
            />
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetricCard;