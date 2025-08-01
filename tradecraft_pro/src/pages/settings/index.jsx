import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { updatePreferences, toggleTheme } from '../../store/slices/uiSlice';
import { updateUserProfile } from '../../store/slices/authSlice';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';

const Settings = () => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, theme, preferences } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [tradingPrefs, setTradingPrefs] = useState({
    defaultOrderType: 'market',
    defaultQuantity: 100,
    confirmOrders: true,
    enableStopLoss: true,
    riskPerTrade: 2,
  });

  const [apiKeys, setApiKeys] = useState({
    alphaVantage: '',
    finnhub: '',
    polygon: '',
  });

  const tabs = [
    { key: 'profile', label: 'Profile', icon: 'User' },
    { key: 'trading', label: 'Trading', icon: 'TrendingUp' },
    { key: 'appearance', label: 'Appearance', icon: 'Palette' },
    { key: 'notifications', label: 'Notifications', icon: 'Bell' },
    { key: 'api', label: 'API Keys', icon: 'Key' },
    { key: 'security', label: 'Security', icon: 'Shield' },
  ];

  const handleProfileUpdate = async () => {
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePreferencesUpdate = (newPrefs) => {
    dispatch(updatePreferences(newPrefs));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            label="Last Name"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Phone"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div className="mt-6">
          <Button onClick={handleProfileUpdate}>
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTradingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Trading Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Default Order Type
            </label>
            <select
              value={tradingPrefs.defaultOrderType}
              onChange={(e) => setTradingPrefs(prev => ({ ...prev, defaultOrderType: e.target.value }))}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
              <option value="stop_limit">Stop Limit</option>
            </select>
          </div>
          
          <Input
            label="Default Quantity"
            type="number"
            value={tradingPrefs.defaultQuantity}
            onChange={(e) => setTradingPrefs(prev => ({ ...prev, defaultQuantity: parseInt(e.target.value) }))}
          />
          
          <Input
            label="Risk Per Trade (%)"
            type="number"
            step="0.1"
            value={tradingPrefs.riskPerTrade}
            onChange={(e) => setTradingPrefs(prev => ({ ...prev, riskPerTrade: parseFloat(e.target.value) }))}
          />
          
          <div className="space-y-2">
            <Checkbox
              label="Confirm orders before placing"
              checked={tradingPrefs.confirmOrders}
              onChange={(e) => setTradingPrefs(prev => ({ ...prev, confirmOrders: e.target.checked }))}
            />
            <Checkbox
              label="Enable automatic stop loss"
              checked={tradingPrefs.enableStopLoss}
              onChange={(e) => setTradingPrefs(prev => ({ ...prev, enableStopLoss: e.target.checked }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
              theme === 'dark' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="Moon" size={20} />
            <span>Dark</span>
          </button>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
              theme === 'light' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="Sun" size={20} />
            <span>Light</span>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Display Options</h3>
        <div className="space-y-2">
          <Checkbox
            label="Compact mode"
            checked={preferences.compactMode}
            onChange={(e) => handlePreferencesUpdate({ compactMode: e.target.checked })}
          />
          <Checkbox
            label="Auto-refresh data"
            checked={preferences.autoRefresh}
            onChange={(e) => handlePreferencesUpdate({ autoRefresh: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <Checkbox
            label="Enable notifications"
            checked={preferences.notificationsEnabled}
            onChange={(e) => handlePreferencesUpdate({ notificationsEnabled: e.target.checked })}
          />
          <Checkbox
            label="Sound notifications"
            checked={preferences.soundEnabled}
            onChange={(e) => handlePreferencesUpdate({ soundEnabled: e.target.checked })}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Refresh Interval (seconds)
            </label>
            <select
              value={preferences.refreshInterval / 1000}
              onChange={(e) => handlePreferencesUpdate({ refreshInterval: parseInt(e.target.value) * 1000 })}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Data API Keys</h3>
        <div className="space-y-4">
          <Input
            label="Alpha Vantage API Key"
            type="password"
            value={apiKeys.alphaVantage}
            onChange={(e) => setApiKeys(prev => ({ ...prev, alphaVantage: e.target.value }))}
            placeholder="Enter your Alpha Vantage API key"
          />
          <Input
            label="Finnhub API Key"
            type="password"
            value={apiKeys.finnhub}
            onChange={(e) => setApiKeys(prev => ({ ...prev, finnhub: e.target.value }))}
            placeholder="Enter your Finnhub API key"
          />
          <Input
            label="Polygon API Key"
            type="password"
            value={apiKeys.polygon}
            onChange={(e) => setApiKeys(prev => ({ ...prev, polygon: e.target.value }))}
            placeholder="Enter your Polygon API key"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">API Key Information</p>
              <p>These keys are stored locally and used to fetch real-time market data. Get free API keys from:</p>
              <ul className="mt-2 space-y-1">
                <li>• Alpha Vantage: alphavantage.co</li>
                <li>• Finnhub: finnhub.io</li>
                <li>• Polygon: polygon.io</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Password & Security</h3>
        <div className="space-y-4">
          <Button variant="outline">
            Change Password
          </Button>
          <Button variant="outline">
            Enable Two-Factor Authentication
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
        <div className="space-y-4">
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Export Account Data
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'trading':
        return renderTradingTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'api':
        return renderApiTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`transition-all duration-300 ease-out ${
        sidebarCollapsed ? 'ml-16' : 'ml-80'
      } mt-16`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 bg-card border border-border rounded-lg p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 bg-card border border-border rounded-lg p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;