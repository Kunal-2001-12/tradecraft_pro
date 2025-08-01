import databaseService from './database';

class DatabaseInitService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (this.isInitialized) {
        return true;
      }

      console.log('Initializing localStorage database...');
      
      // Test connection
      const isConnected = await databaseService.testConnection();
      
      if (isConnected) {
        console.log('✅ LocalStorage database initialized successfully');
        
        // Create indexes for better performance (simulated)
        await databaseService.createIndexes();
        
        // Create demo user if it doesn't exist
        await this.createDemoUser();
        
        // Seed sample data
        await this.seedSampleData();
        
        this.isInitialized = true;
        return true;
      } else {
        console.log('⚠️ LocalStorage initialization failed');
        return false;
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }

  async createDemoUser() {
    try {
      const demoEmail = 'demo@tradecraft.com';
      const existingUser = await databaseService.getUserByEmail(demoEmail);
      
      if (!existingUser) {
        console.log('Creating demo user...');
        
        const demoUser = await databaseService.createUser({
          email: demoEmail,
          password: 'Demo123!', // In production, this should be hashed
          firstName: 'Demo',
          lastName: 'User',
          role: 'trader'
        });

        // Create initial portfolio for demo user
        await databaseService.createPortfolio({
          userId: demoUser._id,
          cash: 100000,
          totalValue: 100000,
          positions: [],
          dayChange: 0,
          dayChangePercent: 0
        });

        // Create initial watchlist
        await databaseService.updateWatchlist(demoUser._id, [
          'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'
        ]);

        console.log('✅ Demo user created successfully');
      } else {
        console.log('Demo user already exists');
      }
    } catch (error) {
      console.error('Error creating demo user:', error);
    }
  }

  async seedSampleData() {
    try {
      // Create sample strategies
      const demoUser = await databaseService.getUserByEmail('demo@tradecraft.com');
      if (!demoUser) return;

      const sampleStrategies = [
        {
          userId: demoUser._id,
          name: 'Moving Average Crossover',
          description: 'Buy when 50-day MA crosses above 200-day MA',
          type: 'technical',
          status: 'active',
          entryConditions: [
            {
              indicator: 'SMA',
              period: 50,
              comparison: 'crosses_above',
              value: 'SMA_200'
            }
          ],
          exitConditions: [
            {
              indicator: 'SMA',
              period: 50,
              comparison: 'crosses_below',
              value: 'SMA_200'
            }
          ],
          riskManagement: {
            stopLoss: 5,
            takeProfit: 10,
            positionSize: 1000
          }
        },
        {
          userId: demoUser._id,
          name: 'RSI Oversold',
          description: 'Buy when RSI is oversold (below 30)',
          type: 'technical',
          status: 'active',
          entryConditions: [
            {
              indicator: 'RSI',
              period: 14,
              comparison: 'less_than',
              value: 30
            }
          ],
          exitConditions: [
            {
              indicator: 'RSI',
              period: 14,
              comparison: 'greater_than',
              value: 70
            }
          ],
          riskManagement: {
            stopLoss: 3,
            takeProfit: 8,
            positionSize: 500
          }
        }
      ];

      for (const strategy of sampleStrategies) {
        await databaseService.createStrategy(strategy);
      }

      console.log('✅ Sample strategies created');
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  }

  async getConnectionStatus() {
    return {
      isConnected: this.isInitialized,
      canConnect: await databaseService.testConnection()
    };
  }
}

export default new DatabaseInitService();