import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route mapping for breadcrumb labels
  const routeLabels = {
    '/': 'Dashboard',
    '/login': 'Login',
    '/strategy-builder': 'Strategy Builder',
    '/backtesting-dashboard': 'Backtesting Dashboard',
    '/trade-verification-center': 'Trade Verification Center',
    '/strategy-optimization-engine': 'Strategy Optimization Engine',
    '/performance-analytics-dashboard': 'Performance Analytics Dashboard',
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always include home/dashboard
    if (location.pathname !== '/') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/',
        isActive: false
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[currentPath] || segment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only one item
  if (location.pathname === '/login' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="mx-2 text-muted-foreground/60" 
              />
            )}
            {crumb.isActive ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb.path)}
                className="hover:text-foreground transition-colors duration-150 focus:outline-none focus:text-foreground"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;