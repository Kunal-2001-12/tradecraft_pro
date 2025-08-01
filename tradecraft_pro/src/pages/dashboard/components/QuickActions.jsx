import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../store/slices/uiSlice';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const actions = [
    {
      title: 'Place Order',
      description: 'Buy or sell securities',
      icon: 'ShoppingCart',
      color: 'bg-blue-500',
      onClick: () => dispatch(openModal('orderEntry')),
    },
    {
      title: 'Build Strategy',
      description: 'Create trading strategy',
      icon: 'Settings',
      color: 'bg-purple-500',
      onClick: () => navigate('/strategy-builder'),
    },
    {
      title: 'Run Backtest',
      description: 'Test your strategies',
      icon: 'BarChart3',
      color: 'bg-green-500',
      onClick: () => navigate('/backtesting-dashboard'),
    },
    {
      title: 'View Portfolio',
      description: 'Manage positions',
      icon: 'PieChart',
      color: 'bg-orange-500',
      onClick: () => navigate('/portfolio'),
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left w-full"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
              <Icon name={action.icon} size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{action.title}</div>
              <div className="text-sm text-muted-foreground">{action.description}</div>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      
      {/* Additional Quick Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Active Strategies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-sm text-muted-foreground">Completed Backtests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;