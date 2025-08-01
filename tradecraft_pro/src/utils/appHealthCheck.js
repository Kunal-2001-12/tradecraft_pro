// Application Health Check Utility
import databaseService from '../services/database';
import authService from '../services/auth';
import marketDataService from '../services/marketData';
import portfolioService from '../services/portfolio';
import tradingService from '../services/trading';

class AppHealthCheck {
  constructor() {
    this.results = {
      database: { status: 'unknown', details: [] },
      auth: { status: 'unknown', details: [] },
      marketData: { status: 'unknown', details: [] },
      portfolio: { status: 'unknown', details: [] },
      trading: { status: 'unknown', details: [] },
      ui: { status: 'unknown', details: [] },
      overall: { status: 'unknown', score: 0 }
    };
  }

  async runFullHealthCheck() {
    console.log('🔍 Starting TradeCraft Pro Health Check...');
    
    try {
      await this.checkDatabase();
      await this.checkAuth();
      await this.checkMarketData();
      await this.checkPortfolio();
      await this.checkTrading();
      await this.checkUI();
      
      this.calculateOverallHealth();
      this.displayResults();
      
      return this.results;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return this.results;
    }
  }

  async checkDatabase() {
    console.log('📊 Checking Database Service...');
    try {
      // Test connection
      const isConnected = await databaseService.testConnection();
      if (isConnected) {
        this.results.database.details.push('✅ Database connection successful');
      } else {
        this.results.database.details.push('❌ Database connection failed');
      }

      // Test user operations
      try {
        const testUser = await databaseService.getUserByEmail('demo@tradecraft.com');
        if (testUser) {
          this.results.database.details.push('✅ User retrieval working');
        } else {
          this.results.database.details.push('⚠️ Demo user not found');
        }
      } catch (error) {
        this.results.database.details.push('❌ User operations failed: ' + error.message);
      }

      // Test portfolio operations
      try {
        const testPortfolio = await databaseService.getPortfolio('demo-user-1');
        this.results.database.details.push('✅ Portfolio operations working');
      } catch (error) {
        this.results.database.details.push('❌ Portfolio operations failed: ' + error.message);
      }

      this.results.database.status = this.results.database.details.filter(d => d.includes('❌')).length === 0 ? 'healthy' : 'unhealthy';
    } catch (error) {
      this.results.database.status = 'error';
      this.results.database.details.push('❌ Database check failed: ' + error.message);
    }
  }

  async checkAuth() {
    console.log('🔐 Checking Authentication Service...');
    try {
      // Test authentication methods
      const isAuth = authService.isAuthenticated();
      this.results.auth.details.push(`✅ Authentication check: ${isAuth ? 'User logged in' : 'No active session'}`);

      // Test token handling
      const token = authService.getToken();
      this.results.auth.details.push(`✅ Token handling: ${token ? 'Token present' : 'No token'}`);

      // Test user data
      const user = authService.getCurrentUser();
      this.results.auth.details.push(`✅ User data: ${user ? 'User data available' : 'No user data'}`);

      this.results.auth.status = 'healthy';
    } catch (error) {
      this.results.auth.status = 'error';
      this.results.auth.details.push('❌ Auth check failed: ' + error.message);
    }
  }

  async checkMarketData() {
    console.log('📈 Checking Market Data Service...');
    try {
      // Test quote retrieval
      const quote = await marketDataService.getQuote('AAPL');
      if (quote && quote.price) {
        this.results.marketData.details.push('✅ Quote retrieval working');
        this.results.marketData.details.push(`✅ AAPL Price: $${quote.price}`);
      } else {
        this.results.marketData.details.push('❌ Quote retrieval failed');
      }

      // Test historical data
      try {
        const historical = await marketDataService.getHistoricalData('AAPL', 'daily', 'compact');
        if (historical && historical.length > 0) {
          this.results.marketData.details.push(`✅ Historical data: ${historical.length} data points`);
        } else {
          this.results.marketData.details.push('❌ Historical data retrieval failed');
        }
      } catch (error) {
        this.results.marketData.details.push('❌ Historical data error: ' + error.message);
      }

      this.results.marketData.status = this.results.marketData.details.filter(d => d.includes('❌')).length === 0 ? 'healthy' : 'unhealthy';
    } catch (error) {
      this.results.marketData.status = 'error';
      this.results.marketData.details.push('❌ Market data check failed: ' + error.message);
    }
  }

  async checkPortfolio() {
    console.log('💼 Checking Portfolio Service...');
    try {
      // Test portfolio retrieval
      const portfolio = await portfolioService.getPortfolio('demo-user-1');
      if (portfolio) {
        this.results.portfolio.details.push('✅ Portfolio retrieval working');
        this.results.portfolio.details.push(`✅ Portfolio value: $${portfolio.totalValue?.toLocaleString() || 'N/A'}`);
        this.results.portfolio.details.push(`✅ Available cash: $${portfolio.cash?.toLocaleString() || 'N/A'}`);
      } else {
        this.results.portfolio.details.push('❌ Portfolio retrieval failed');
      }

      this.results.portfolio.status = this.results.portfolio.details.filter(d => d.includes('❌')).length === 0 ? 'healthy' : 'unhealthy';
    } catch (error) {
      this.results.portfolio.status = 'error';
      this.results.portfolio.details.push('❌ Portfolio check failed: ' + error.message);
    }
  }

  async checkTrading() {
    console.log('💹 Checking Trading Service...');
    try {
      // Test portfolio summary
      const summary = await tradingService.getPortfolioSummary();
      if (summary) {
        this.results.trading.details.push('✅ Portfolio summary working');
        this.results.trading.details.push(`✅ Total value: $${summary.totalValue?.toLocaleString() || 'N/A'}`);
      }

      // Test order history
      const orders = tradingService.getOrderHistory(10);
      this.results.trading.details.push(`✅ Order history: ${orders.length} orders`);

      // Test open orders
      const openOrders = tradingService.getOpenOrders();
      this.results.trading.details.push(`✅ Open orders: ${openOrders.length} orders`);

      this.results.trading.status = 'healthy';
    } catch (error) {
      this.results.trading.status = 'error';
      this.results.trading.details.push('❌ Trading check failed: ' + error.message);
    }
  }

  async checkUI() {
    console.log('🎨 Checking UI Components...');
    try {
      // Check localStorage for UI state
      const theme = localStorage.getItem('theme');
      this.results.ui.details.push(`✅ Theme: ${theme || 'default'}`);

      const watchlist = localStorage.getItem('watchlist');
      this.results.ui.details.push(`✅ Watchlist: ${watchlist ? JSON.parse(watchlist).length + ' symbols' : 'empty'}`);

      const preferences = localStorage.getItem('userPreferences');
      this.results.ui.details.push(`✅ User preferences: ${preferences ? 'saved' : 'default'}`);

      // Check if critical UI data exists
      const tradecraftDb = localStorage.getItem('tradecraft_db');
      this.results.ui.details.push(`✅ App database: ${tradecraftDb ? 'initialized' : 'empty'}`);

      this.results.ui.status = 'healthy';
    } catch (error) {
      this.results.ui.status = 'error';
      this.results.ui.details.push('❌ UI check failed: ' + error.message);
    }
  }

  calculateOverallHealth() {
    const services = ['database', 'auth', 'marketData', 'portfolio', 'trading', 'ui'];
    let healthyCount = 0;
    
    services.forEach(service => {
      if (this.results[service].status === 'healthy') {
        healthyCount++;
      }
    });

    const score = (healthyCount / services.length) * 100;
    this.results.overall.score = Math.round(score);
    
    if (score >= 90) {
      this.results.overall.status = 'excellent';
    } else if (score >= 75) {
      this.results.overall.status = 'good';
    } else if (score >= 50) {
      this.results.overall.status = 'fair';
    } else {
      this.results.overall.status = 'poor';
    }
  }

  displayResults() {
    console.log('\n🏥 TRADECRAFT PRO HEALTH CHECK RESULTS');
    console.log('=====================================');
    
    Object.entries(this.results).forEach(([service, result]) => {
      if (service === 'overall') {
        console.log(`\n🎯 OVERALL HEALTH: ${result.status.toUpperCase()} (${result.score}%)`);
        return;
      }
      
      const statusIcon = result.status === 'healthy' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
      console.log(`\n${statusIcon} ${service.toUpperCase()}: ${result.status}`);
      
      result.details.forEach(detail => {
        console.log(`   ${detail}`);
      });
    });

    console.log('\n📋 RECOMMENDATIONS:');
    if (this.results.overall.score === 100) {
      console.log('   🎉 All systems operational! Your app is ready for production.');
    } else {
      if (this.results.database.status !== 'healthy') {
        console.log('   🔧 Check database connectivity and initialization');
      }
      if (this.results.marketData.status !== 'healthy') {
        console.log('   📊 Verify market data service and API keys');
      }
      if (this.results.portfolio.status !== 'healthy') {
        console.log('   💼 Check portfolio service configuration');
      }
    }
    
    console.log('\n✨ Health check completed!');
  }

  // Quick health check for development
  async quickCheck() {
    console.log('⚡ Quick Health Check...');
    
    try {
      const dbStatus = await databaseService.testConnection();
      const quote = await marketDataService.getQuote('AAPL');
      const portfolio = await portfolioService.getPortfolio('demo-user-1');
      
      console.log(`Database: ${dbStatus ? '✅' : '❌'}`);
      console.log(`Market Data: ${quote ? '✅' : '❌'}`);
      console.log(`Portfolio: ${portfolio ? '✅' : '❌'}`);
      
      return { database: dbStatus, marketData: !!quote, portfolio: !!portfolio };
    } catch (error) {
      console.error('Quick check failed:', error);
      return { database: false, marketData: false, portfolio: false };
    }
  }
}

export default new AppHealthCheck();