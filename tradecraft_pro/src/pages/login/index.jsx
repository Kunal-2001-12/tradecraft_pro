import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LoginFooter from './components/LoginFooter';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/strategy-builder');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <LoginHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="order-2 lg:order-1">
              <LoginForm />
            </div>

            {/* Right Side - Trust Signals */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Professional Trading Platform
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Build, backtest, and optimize trading strategies with institutional-grade tools and analytics.
                  </p>
                </div>
                <TrustSignals />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LoginFooter />
    </div>
  );
};

export default LoginPage;