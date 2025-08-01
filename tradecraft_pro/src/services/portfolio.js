import axios from 'axios';
import marketDataService from './marketData';
import databaseService from './database';

class PortfolioService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  }

  async getPortfolio(userId) {
    try {
      if (this.isDemoMode) {
        return this.getMockPortfolio();
      }

      // Try localStorage database first
      const dbPortfolio = await databaseService.getPortfolio(userId);
      if (dbPortfolio) {
        return this.formatPortfolioData(dbPortfolio);
      }

      // Fallback to API
      const response = await axios.get(`${this.baseURL}/portfolio`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return this.getMockPortfolio();
    }
  }

  async updatePortfolio(userId, portfolioData) {
    try {
      if (this.isDemoMode) {
        // Store in localStorage for demo
        localStorage.setItem('demoPortfolio', JSON.stringify(portfolioData));
        return portfolioData;
      }

      // Update in MongoDB
      await databaseService.updatePortfolio(userId, portfolioData);
      return portfolioData;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  async placeOrder(userId, orderData) {
    try {
      if (this.isDemoMode) {
        return this.processMockOrder(orderData);
      }

      // Save order to MongoDB
      const order = await databaseService.createOrder({
        ...orderData,
        userId,
        status: 'pending',
        createdAt: new Date()
      });

      // Process the order (simulate execution)
      const executedOrder = await this.executeOrder(order);
      
      // Update portfolio based on executed order
      await this.updatePortfolioFromOrder(userId, executedOrder);

      return executedOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async executeOrder(order) {
    try {
      // Get current market price
      const quote = await marketDataService.getQuote(order.symbol);
      const currentPrice = quote?.price || order.price;

      // Simulate order execution
      const executedOrder = {
        ...order,
        status: 'filled',
        averageFillPrice: currentPrice,
        filledQuantity: order.quantity,
        executedAt: new Date()
      };

      // Update order in database
      await databaseService.updateOrder(order._id, {
        status: 'filled',
        averageFillPrice: currentPrice,
        filledQuantity: order.quantity,
        executedAt: new Date()
      });

      return executedOrder;
    } catch (error) {
      console.error('Error executing order:', error);
      
      // Mark order as failed
      await databaseService.updateOrder(order._id, {
        status: 'failed',
        errorMessage: error.message
      });
      
      throw error;
    }
  }

  async updatePortfolioFromOrder(userId, order) {
    try {
      const portfolio = await databaseService.getPortfolio(userId);
      if (!portfolio) return;

      const { symbol, side, quantity, averageFillPrice } = order;
      const orderValue = quantity * averageFillPrice;

      // Update cash
      let newCash = portfolio.cash;
      if (side === 'buy') {
        newCash -= orderValue;
      } else {
        newCash += orderValue;
      }

      // Update positions
      const positions = [...(portfolio.positions || [])];
      const existingPositionIndex = positions.findIndex(p => p.symbol === symbol);

      if (existingPositionIndex >= 0) {
        const existingPosition = positions[existingPositionIndex];
        
        if (side === 'buy') {
          // Add to existing position
          const totalQuantity = existingPosition.quantity + quantity;
          const totalCost = (existingPosition.quantity * existingPosition.averagePrice) + orderValue;
          
          positions[existingPositionIndex] = {
            ...existingPosition,
            quantity: totalQuantity,
            averagePrice: totalCost / totalQuantity,
            marketValue: totalQuantity * averageFillPrice
          };
        } else {
          // Reduce existing position
          const newQuantity = existingPosition.quantity - quantity;
          
          if (newQuantity <= 0) {
            // Remove position if fully sold
            positions.splice(existingPositionIndex, 1);
          } else {
            positions[existingPositionIndex] = {
              ...existingPosition,
              quantity: newQuantity,
              marketValue: newQuantity * averageFillPrice
            };
          }
        }
      } else if (side === 'buy') {
        // Create new position
        positions.push({
          symbol,
          quantity,
          averagePrice: averageFillPrice,
          currentPrice: averageFillPrice,
          marketValue: orderValue,
          unrealizedPnL: 0
        });
      }

      // Calculate total portfolio value
      const totalPositionValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
      const totalValue = newCash + totalPositionValue;

      // Update portfolio in database
      await databaseService.updatePortfolio(userId, {
        cash: newCash,
        totalValue,
        positions,
        updatedAt: new Date()
      });

    } catch (error) {
      console.error('Error updating portfolio from order:', error);
      throw error;
    }
  }

  async getOrderHistory(userId, limit = 50) {
    try {
      if (this.isDemoMode) {
        return this.getMockOrderHistory();
      }

      return await databaseService.getOrdersByUserId(userId);
    } catch (error) {
      console.error('Error fetching order history:', error);
      return [];
    }
  }

  async resetPaperAccount(userId) {
    try {
      if (this.isDemoMode) {
        localStorage.removeItem('demoPortfolio');
        localStorage.removeItem('demoOrders');
        return this.getMockPortfolio();
      }

      // Reset portfolio in MongoDB
      const resetPortfolio = {
        userId,
        cash: 100000,
        totalValue: 100000,
        positions: [],
        dayChange: 0,
        dayChangePercent: 0,
        updatedAt: new Date()
      };

      await databaseService.updatePortfolio(userId, resetPortfolio);
      return resetPortfolio;
    } catch (error) {
      console.error('Error resetting paper account:', error);
      throw error;
    }
  }

  formatPortfolioData(dbPortfolio) {
    return {
      totalValue: dbPortfolio.totalValue || 100000,
      cash: dbPortfolio.cash || 100000,
      dayChange: dbPortfolio.dayChange || 0,
      dayChangePercent: dbPortfolio.dayChangePercent || 0,
      positions: dbPortfolio.positions || [],
      balance: {
        available: dbPortfolio.cash || 100000,
        pending: 0
      },
      performance: {
        totalReturn: (dbPortfolio.totalValue || 100000) - 100000,
        totalReturnPercent: ((dbPortfolio.totalValue || 100000) - 100000) / 100000 * 100,
        totalTrades: 0,
        winningTrades: 0,
        winRate: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        volatility: 0
      }
    };
  }

  getMockPortfolio() {
    const stored = localStorage.getItem('demoPortfolio');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      totalValue: 100000,
      cash: 100000,
      dayChange: 0,
      dayChangePercent: 0,
      positions: [],
      balance: {
        available: 100000,
        pending: 0
      },
      performance: {
        totalReturn: 0,
        totalReturnPercent: 0,
        totalTrades: 0,
        winningTrades: 0,
        winRate: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        volatility: 0
      }
    };
  }

  getMockOrderHistory() {
    const stored = localStorage.getItem('demoOrders');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  processMockOrder(orderData) {
    // Simulate order processing for demo mode
    const executedOrder = {
      ...orderData,
      id: 'order_' + Date.now(),
      status: 'filled',
      averageFillPrice: orderData.price,
      filledQuantity: orderData.quantity,
      executedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const existingOrders = this.getMockOrderHistory();
    existingOrders.unshift(executedOrder);
    localStorage.setItem('demoOrders', JSON.stringify(existingOrders.slice(0, 100)));

    return Promise.resolve(executedOrder);
  }
}

export default new PortfolioService();