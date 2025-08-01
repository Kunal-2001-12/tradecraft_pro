import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import DatabaseStatus from '../DatabaseStatus';


const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Strategy Builder', path: '/strategy-builder', icon: 'Settings' },
    { label: 'Backtesting', path: '/backtesting-dashboard', icon: 'TrendingUp' },
    { label: 'Analytics', path: '/performance-analytics-dashboard', icon: 'BarChart3' },
    { label: 'Optimization', path: '/strategy-optimization-engine', icon: 'Zap' },
    { label: 'Verification', path: '/trade-verification-center', icon: 'Shield' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">TradeCraft Pro</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Database Status */}
          <DatabaseStatus />
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-[1010]">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">John Trader</p>
                    <p className="text-xs text-muted-foreground">john@tradecraft.com</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Settings
                  </button>
                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-150"
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center w-full space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[1005]"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;