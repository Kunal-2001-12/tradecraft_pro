import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../../store/slices/authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Demo mode credentials
  const demoCredentials = {
    email: 'demo@tradecraft.com',
    password: 'Demo123!'
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // In demo mode, use mock authentication
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      if (formData.email === demoCredentials.email && formData.password === demoCredentials.password) {
        // Mock successful login
        const mockUser = {
          id: '1',
          email: formData.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'trader',
        };
        
        // Store in localStorage for demo
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        return;
      } else {
        setValidationErrors({
          general: `Demo credentials: ${demoCredentials.email} / ${demoCredentials.password}`
        });
        return;
      }
    }
    
    // For production, use real authentication
    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
      
      // Navigation will be handled by the useEffect hook
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleForgotPassword = () => {
    alert(`Password reset functionality would be implemented here. For demo, use: ${demoCredentials.email} / ${demoCredentials.password}`);
  };

  const handleCreateAccount = () => {
    alert('Account creation would redirect to registration page. For demo, use existing credentials.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} color="white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your TradeCraft Pro account</p>
        </div>

        {/* General Error */}
        {(error || validationErrors.general) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <p className="text-sm text-red-600">{error || validationErrors.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            error={validationErrors.email}
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={validationErrors.password}
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
            />
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={handleCreateAccount}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-muted rounded-md">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: {demoCredentials.email}</p>
              <p>Password: {demoCredentials.password}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;