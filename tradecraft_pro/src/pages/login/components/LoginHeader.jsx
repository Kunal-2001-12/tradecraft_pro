import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  const navigate = useNavigate();

  const handleNeedHelp = () => {
    alert('Support functionality would open help center or contact form. For demo, use the provided credentials.');
  };

  return (
    <header className="w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">TradeCraft Pro</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              About
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNeedHelp}
              iconName="HelpCircle"
              iconPosition="left"
            >
              Need Help?
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNeedHelp}
            >
              <Icon name="HelpCircle" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;