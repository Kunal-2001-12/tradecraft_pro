// Browser-compatible database service
// Simulates MongoDB operations using localStorage with future API integration capability

class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.simulatedData = {
      users: [],
      portfolios: [],
      orders: [],
      strategies: [],
      watchlists: []
    };
    
    // Load data from localStorage if available
    this.loadFromLocalStorage();
  }

  // Load data from localStorage
  loadFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('tradecraft_db');
      if (savedData) {
        this.simulatedData = JSON.parse(savedData);
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
  }

  // Save data to localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('tradecraft_db', JSON.stringify(this.simulatedData));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  }

  // Simulate connection test
  async testConnection() {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Create indexes (simulated)
  async createIndexes() {
    // In a real implementation, this would create database indexes
    console.log('Database indexes created (simulated)');
    return true;
  }

  // User operations
  async createUser(userData) {
    const user = {
      _id: this.generateId(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.simulatedData.users.push(user);
    this.saveToLocalStorage();
    return user;
  }

  async getUserByEmail(email) {
    return this.simulatedData.users.find(user => user.email === email) || null;
  }

  async getUserById(userId) {
    return this.simulatedData.users.find(user => user._id === userId) || null;
  }

  async updateUser(userId, updateData) {
    const userIndex = this.simulatedData.users.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
      this.simulatedData.users[userIndex] = {
        ...this.simulatedData.users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.simulatedData.users[userIndex];
    }
    return null;
  }

  // Portfolio operations
  async createPortfolio(portfolioData) {
    const portfolio = {
      _id: this.generateId(),
      ...portfolioData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.simulatedData.portfolios.push(portfolio);
    this.saveToLocalStorage();
    return portfolio;
  }

  async getPortfolio(userId) {
    return this.simulatedData.portfolios.find(portfolio => portfolio.userId === userId) || null;
  }

  async updatePortfolio(userId, updateData) {
    const portfolioIndex = this.simulatedData.portfolios.findIndex(portfolio => portfolio.userId === userId);
    if (portfolioIndex !== -1) {
      this.simulatedData.portfolios[portfolioIndex] = {
        ...this.simulatedData.portfolios[portfolioIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.simulatedData.portfolios[portfolioIndex];
    }
    return null;
  }

  // Order operations
  async createOrder(orderData) {
    const order = {
      _id: this.generateId(),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.simulatedData.orders.push(order);
    this.saveToLocalStorage();
    return order;
  }

  async getOrdersByUserId(userId) {
    return this.simulatedData.orders.filter(order => order.userId === userId);
  }

  async updateOrder(orderId, updateData) {
    const orderIndex = this.simulatedData.orders.findIndex(order => order._id === orderId);
    if (orderIndex !== -1) {
      this.simulatedData.orders[orderIndex] = {
        ...this.simulatedData.orders[orderIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.simulatedData.orders[orderIndex];
    }
    return null;
  }

  async deleteOrder(orderId) {
    const orderIndex = this.simulatedData.orders.findIndex(order => order._id === orderId);
    if (orderIndex !== -1) {
      const deletedOrder = this.simulatedData.orders.splice(orderIndex, 1)[0];
      this.saveToLocalStorage();
      return deletedOrder;
    }
    return null;
  }

  // Strategy operations
  async createStrategy(strategyData) {
    const strategy = {
      _id: this.generateId(),
      ...strategyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.simulatedData.strategies.push(strategy);
    this.saveToLocalStorage();
    return strategy;
  }

  async getStrategiesByUserId(userId) {
    return this.simulatedData.strategies.filter(strategy => strategy.userId === userId);
  }

  async updateStrategy(strategyId, updateData) {
    const strategyIndex = this.simulatedData.strategies.findIndex(strategy => strategy._id === strategyId);
    if (strategyIndex !== -1) {
      this.simulatedData.strategies[strategyIndex] = {
        ...this.simulatedData.strategies[strategyIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      this.saveToLocalStorage();
      return this.simulatedData.strategies[strategyIndex];
    }
    return null;
  }

  async deleteStrategy(strategyId) {
    const strategyIndex = this.simulatedData.strategies.findIndex(strategy => strategy._id === strategyId);
    if (strategyIndex !== -1) {
      const deletedStrategy = this.simulatedData.strategies.splice(strategyIndex, 1)[0];
      this.saveToLocalStorage();
      return deletedStrategy;
    }
    return null;
  }

  // Watchlist operations
  async getWatchlist(userId) {
    const watchlist = this.simulatedData.watchlists.find(w => w.userId === userId);
    return watchlist ? watchlist.symbols : [];
  }

  async updateWatchlist(userId, symbols) {
    const watchlistIndex = this.simulatedData.watchlists.findIndex(w => w.userId === userId);
    
    if (watchlistIndex !== -1) {
      this.simulatedData.watchlists[watchlistIndex] = {
        ...this.simulatedData.watchlists[watchlistIndex],
        symbols,
        updatedAt: new Date().toISOString()
      };
    } else {
      this.simulatedData.watchlists.push({
        _id: this.generateId(),
        userId,
        symbols,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    this.saveToLocalStorage();
    return symbols;
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for testing)
  async clearAllData() {
    this.simulatedData = {
      users: [],
      portfolios: [],
      orders: [],
      strategies: [],
      watchlists: []
    };
    localStorage.removeItem('tradecraft_db');
    return true;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      type: 'localStorage',
      message: 'Using browser localStorage for data persistence'
    };
  }
}

export default new DatabaseService();