
import axios from 'axios';
import marketDataService from './marketData';

class TradingService {
  constructor() {
    this.paperTradingEnabled = true;
    this.portfolio = this.loadPortfolio();
    this.orders = this.loadOrders();
    this.positions = this.loadPositions();
    this.balance = this.loadBalance();
  }

  // Portfolio Management
  loadPortfolio() {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : {
      totalValue: 100000, // Starting with $100k paper money
      cash: 100000,
      positions: {},
      dayChange: 0,
      dayChangePercent: 0
    };
  }

  savePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(this.portfolio));
  }

  loadOrders() {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  }

  saveOrders() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  loadPositions() {
    const saved = localStorage.getItem('positions');
    return saved ? JSON.parse(saved) : {};
  }

  savePositions() {
    localStorage.setItem('positions', JSON.stringify(this.positions));
  }

  loadBalance() {
    const saved = localStorage.getItem('balance');
    return saved ? JSON.parse(saved) : {
      cash: 100000,
      equity: 100000,
      buyingPower: 100000,
      dayTradeCount: 0,
      marginUsed: 0
    };
  }

  saveBalance() {
    localStorage.setItem('balance', JSON.stringify(this.balance));
  }

  // Order Management
  async placeOrder(orderData) {
    try {
      const {
        symbol,
        side, // 'buy' or 'sell'
        quantity,
        orderType, // 'market', 'limit', 'stop', 'stop_limit'
        price,
        stopPrice,
        timeInForce = 'day' // 'day', 'gtc', 'ioc', 'fok'
      } = orderData;

      // Validate order
      const validation = await this.validateOrder(orderData);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get current market price
      const quote = await marketDataService.getQuote(symbol);
      const currentPrice = quote.price;

      // Create order object
      const order = {
        id: this.generateOrderId(),
        symbol,
        side,
        quantity,
        orderType,
        price: price || currentPrice,
        stopPrice,
        timeInForce,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        filledQuantity: 0,
        averageFillPrice: 0,
        commission: this.calculateCommission(quantity, currentPrice)
      };

      // For paper trading, simulate order execution
      if (this.paperTradingEnabled) {
        await this.simulateOrderExecution(order, currentPrice);
      } else {
        // For live trading, send to broker API
        await this.sendOrderToBroker(order);
      }

      this.orders.push(order);
      this.saveOrders();

      return order;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async validateOrder(orderData) {
    const { symbol, side, quantity, orderType, price } = orderData;

    // Basic validation
    if (!symbol || !side || !quantity || quantity <= 0) {
      return { valid: false, error: 'Invalid order parameters' };
    }

    // Check buying power for buy orders
    if (side === 'buy') {
      const quote = await marketDataService.getQuote(symbol);
      const estimatedCost = quantity * (price || quote.price);
      const commission = this.calculateCommission(quantity, price || quote.price);
      const totalCost = estimatedCost + commission;

      if (totalCost > this.balance.buyingPower) {
        return { valid: false, error: 'Insufficient buying power' };
      }
    }

    // Check position for sell orders
    if (side === 'sell') {
      const position = this.positions[symbol];
      if (!position || position.quantity < quantity) {
        return { valid: false, error: 'Insufficient shares to sell' };
      }
    }

    return { valid: true };
  }

  async simulateOrderExecution(order, currentPrice) {
    const { symbol, side, quantity, orderType, price } = order;

    // Simulate market conditions and slippage
    let executionPrice = currentPrice;
    let slippage = 0;

    if (orderType === 'market') {
      // Add realistic slippage for market orders
      slippage = currentPrice * (Math.random() * 0.002 - 0.001); // ±0.1% slippage
      executionPrice = currentPrice + slippage;
    } else if (orderType === 'limit') {
      // Limit orders execute at limit price or better
      if (side === 'buy' && currentPrice <= price) {
        executionPrice = Math.min(price, currentPrice);
      } else if (side === 'sell' && currentPrice >= price) {
        executionPrice = Math.max(price, currentPrice);
      } else {
        // Order doesn't execute immediately
        order.status = 'open';
        return;
      }
    }

    // Execute the order
    order.status = 'filled';
    order.filledQuantity = quantity;
    order.averageFillPrice = executionPrice;
    order.updatedAt = new Date().toISOString();

    // Update portfolio
    await this.updatePortfolioAfterExecution(order);
  }

  async updatePortfolioAfterExecution(order) {
    const { symbol, side, quantity, averageFillPrice, commission } = order;

    if (side === 'buy') {
      // Add to position
      if (!this.positions[symbol]) {
        this.positions[symbol] = {
          symbol,
          quantity: 0,
          averagePrice: 0,
          marketValue: 0,
          unrealizedPnL: 0,
          realizedPnL: 0
        };
      }

      const position = this.positions[symbol];
      const totalCost = position.quantity * position.averagePrice + quantity * averageFillPrice;
      position.quantity += quantity;
      position.averagePrice = totalCost / position.quantity;

      // Update cash
      this.balance.cash -= (quantity * averageFillPrice + commission);
    } else {
      // Sell from position
      const position = this.positions[symbol];
      if (position) {
        const saleProceeds = quantity * averageFillPrice - commission;
        const costBasis = quantity * position.averagePrice;
        const realizedPnL = saleProceeds - costBasis;

        position.quantity -= quantity;
        position.realizedPnL += realizedPnL;

        // Update cash
        this.balance.cash += saleProceeds;

        // Remove position if quantity is zero
        if (position.quantity <= 0) {
          delete this.positions[symbol];
        }
      }
    }

    // Update portfolio totals
    await this.updatePortfolioTotals();
    this.savePositions();
    this.saveBalance();
    this.savePortfolio();
  }

  async updatePortfolioTotals() {
    let totalEquity = this.balance.cash;
    let totalDayChange = 0;

    // Update each position with current market value
    for (const [symbol, position] of Object.entries(this.positions)) {
      try {
        const quote = await marketDataService.getQuote(symbol);
        const marketValue = position.quantity * quote.price;
        const unrealizedPnL = marketValue - (position.quantity * position.averagePrice);
        const dayChange = position.quantity * quote.change;

        position.marketValue = marketValue;
        position.unrealizedPnL = unrealizedPnL;
        position.currentPrice = quote.price;
        position.dayChange = dayChange;
        position.dayChangePercent = quote.changePercent;

        totalEquity += marketValue;
        totalDayChange += dayChange;
      } catch (error) {
        console.error(`Error updating position for ${symbol}:`, error);
      }
    }

    this.portfolio.totalValue = totalEquity;
    this.portfolio.cash = this.balance.cash;
    this.portfolio.dayChange = totalDayChange;
    this.portfolio.dayChangePercent = this.portfolio.totalValue > 0 
      ? (totalDayChange / (this.portfolio.totalValue - totalDayChange)) * 100 
      : 0;

    this.balance.equity = totalEquity;
    this.balance.buyingPower = this.balance.cash; // Simplified for paper trading
  }

  // Cancel order
  async cancelOrder(orderId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    if (order.status !== 'open' && order.status !== 'pending') {
      throw new Error('Cannot cancel order with status: ' + order.status);
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    this.saveOrders();
    return order;
  }

  // Get portfolio summary
  async getPortfolioSummary() {
    await this.updatePortfolioTotals();
    return {
      ...this.portfolio,
      positions: Object.values(this.positions),
      balance: this.balance
    };
  }

  // Get order history
  getOrderHistory(limit = 50) {
    return this.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  // Get open orders
  getOpenOrders() {
    return this.orders.filter(order => 
      order.status === 'open' || order.status === 'pending'
    );
  }

  // Calculate commission (simplified)
  calculateCommission(quantity, price) {
    // Free trading for paper trading, or flat $0.65 per contract for options
    return 0;
  }

  // Generate unique order ID
  generateOrderId() {
    return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Strategy execution
  async executeStrategy(strategy, symbols) {
    const results = [];

    for (const symbol of symbols) {
      try {
        const signal = await this.evaluateStrategy(strategy, symbol);
        if (signal.action !== 'hold') {
          const order = await this.placeOrder({
            symbol,
            side: signal.action,
            quantity: signal.quantity,
            orderType: 'market'
          });
          results.push({ symbol, order, signal });
        }
      } catch (error) {
        console.error(`Error executing strategy for ${symbol}:`, error);
        results.push({ symbol, error: error.message });
      }
    }

    return results;
  }

  async evaluateStrategy(strategy, symbol) {
    // This would implement the actual strategy logic
    // For now, return a simple random signal
    const quote = await marketDataService.getQuote(symbol);
    const actions = ['buy', 'sell', 'hold'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      action,
      quantity: action !== 'hold' ? Math.floor(Math.random() * 100) + 1 : 0,
      confidence: Math.random(),
      price: quote.price,
      reasoning: `Strategy signal based on current price ${quote.price}`
    };
  }

  // Risk management
  checkRiskLimits(orderData) {
    const { symbol, side, quantity, price } = orderData;
    const estimatedValue = quantity * price;
    
    // Check position size limits
    const maxPositionSize = this.portfolio.totalValue * 0.1; // 10% max position
    if (estimatedValue > maxPositionSize) {
      return {
        valid: false,
        error: `Position size exceeds 10% limit ($${maxPositionSize.toFixed(2)})`
      };
    }

    // Check daily loss limits
    if (this.portfolio.dayChange < -this.portfolio.totalValue * 0.05) {
      return {
        valid: false,
        error: 'Daily loss limit reached (5%)'
      };
    }

    return { valid: true };
  }

  // Performance analytics
  getPerformanceMetrics() {
    const totalReturn = this.portfolio.totalValue - 100000; // Starting amount
    const totalReturnPercent = (totalReturn / 100000) * 100;
    
    // Calculate other metrics from order history
    const trades = this.orders.filter(order => order.status === 'filled');
    const winningTrades = trades.filter(order => {
      // Simplified win/loss calculation
      return Math.random() > 0.5; // This should be based on actual P&L
    });
    
    return {
      totalReturn,
      totalReturnPercent,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      sharpeRatio: Math.random() * 2, // This should be calculated properly
      maxDrawdown: Math.random() * 10, // This should be calculated properly
      volatility: Math.random() * 20 // This should be calculated properly
    };
  }

  // Reset paper trading account
  resetPaperAccount() {
    this.portfolio = {
      totalValue: 100000,
      cash: 100000,
      positions: {},
      dayChange: 0,
      dayChangePercent: 0
    };
    this.orders = [];
    this.positions = {};
    this.balance = {
      cash: 100000,
      equity: 100000,
      buyingPower: 100000,
      dayTradeCount: 0,
      marginUsed: 0
    };

    this.savePortfolio();
    this.saveOrders();
    this.savePositions();
    this.saveBalance();
  }
}

export default new TradingService();