import axios from 'axios';
import databaseService from './database';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(userData) {
    try {
      // Use localStorage database for registration
      const newUser = await this.registerWithLocalStorage(userData);
      return { user: newUser, message: 'Registration successful' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(email, password) {
    try {
      // Try localStorage database authentication first
      const dbUser = await this.authenticateWithLocalStorage({ email, password });
      if (dbUser) {
        return dbUser;
      }

      // Fallback to mock login for demo
      return this.mockLogin({ email, password });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      if (this.token) {
        await axios.post(`${API_BASE_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
      const { token } = response.data;
      
      this.token = token;
      localStorage.setItem('authToken', token);
      
      return token;
    } catch (error) {
      this.logout();
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, userData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.token && localStorage.getItem('isAuthenticated') === 'true';
  }

  getToken() {
    return this.token;
  }

  async authenticateWithLocalStorage(credentials) {
    try {
      const user = await databaseService.getUserByEmail(credentials.email);
      
      if (user && this.verifyPassword(credentials.password, user.password)) {
        const token = this.generateToken(user);
        
        this.token = token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify({
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role || 'trader'
        }));
        localStorage.setItem('isAuthenticated', 'true');

        return {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'trader'
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('LocalStorage authentication error:', error);
      return null;
    }
  }

  mockLogin(credentials) {
    const demoCredentials = {
      email: 'demo@tradecraft.com',
      password: 'Demo123!'
    };

    if (credentials.email === demoCredentials.email && 
        credentials.password === demoCredentials.password) {
      const mockUser = {
        id: 'demo-user-1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        role: 'trader',
      };
      
      const token = 'demo-token-' + Date.now();
      
      this.token = token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      return Promise.resolve({
        token,
        user: mockUser
      });
    }
    
    return Promise.reject({ message: `Demo credentials: ${demoCredentials.email} / ${demoCredentials.password}` });
  }

  verifyPassword(inputPassword, storedPassword) {
    // In a real app, you'd use bcrypt or similar
    // For demo purposes, we'll do simple comparison
    return inputPassword === storedPassword;
  }

  generateToken(user) {
    // In a real app, you'd use JWT
    // For demo purposes, generate a simple token
    return `token_${user._id}_${Date.now()}`;
  }

  async registerWithLocalStorage(userData) {
    try {
      // Check if user already exists
      const existingUser = await databaseService.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const newUser = await databaseService.createUser({
        ...userData,
        password: userData.password, // In real app, hash this
        role: 'trader'
      });

      // Create initial portfolio
      await databaseService.createPortfolio({
        userId: newUser._id,
        cash: 100000, // Starting balance
        totalValue: 100000,
        positions: [],
        dayChange: 0,
        dayChangePercent: 0
      });

      return newUser;
    } catch (error) {
      console.error('LocalStorage registration error:', error);
      throw error;
    }
  }

  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error(error.message || 'An unexpected error occurred');
  }
}

export default new AuthService();