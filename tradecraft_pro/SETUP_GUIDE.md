# TradeCraft Pro - Complete Setup Guide

## 🚀 Quick Start

Your TradeCraft Pro trading platform is now ready! Here's everything you need to know:

### 1. Start the Application

```bash
cd c:\Users\kunal\Downloads\tradecraft_pro\tradecraft_pro
npm start
```

The app will start on `http://localhost:5174` (or next available port)

### 2. Data Storage

Your app uses **Browser LocalStorage** for data persistence:
- ✅ **Storage**: Browser LocalStorage with MongoDB-compatible API
- ✅ **Collections**: users, portfolios, orders, strategies, watchlists
- ✅ **Auto-initialization**: Demo user and data created automatically

### 3. Login Credentials

**Demo Mode Credentials:**
- Email: `demo@tradecraft.com`
- Password: `Demo123!`

The app will automatically create this demo user in LocalStorage on first run.

### 4. What's Included

✅ **Complete Trading Platform**
- Dashboard with portfolio overview
- Real-time market data integration
- Paper trading with $100,000 virtual balance
- Professional trading interface
- Portfolio management
- Strategy builder
- Backtesting engine
- Settings and preferences

✅ **Modern Tech Stack**
- React 18 + Redux Toolkit
- Tailwind CSS styling
- Responsive design
- Dark/light theme
- Real-time updates

✅ **Ready-to-Use Components**
- 50+ React components
- Professional UI/UX
- Trading charts and graphs
- Order entry forms
- Market data displays

✅ **LocalStorage Integration**
- User authentication and profiles
- Persistent portfolio data
- Complete order history
- Strategy storage and management
- Synchronized watchlists
- Browser-based data persistence

## 📁 Key Files Created/Updated

### Core Application
- `src/App.jsx` - Main application with routing
- `src/Routes.jsx` - Application routes
- `src/store/index.js` - Redux store configuration

### Redux Store Slices
- `src/store/slices/authSlice.js` - Authentication
- `src/store/slices/portfolioSlice.js` - Portfolio management
- `src/store/slices/marketDataSlice.js` - Market data
- `src/store/slices/ordersSlice.js` - Order management
- `src/store/slices/uiSlice.js` - UI state
- `src/store/slices/strategiesSlice.js` - Strategy management

### Services
- `src/services/auth.js` - Authentication API
- `src/services/marketData.js` - Market data API
- `src/services/trading.js` - Trading operations
- `src/services/backtesting.js` - Backtesting engine

### Pages
- `src/pages/dashboard/` - Main dashboard
- `src/pages/login/` - Login page
- `src/pages/strategy-builder/` - Strategy creation
- `src/pages/backtesting-dashboard/` - Backtesting interface
- `src/pages/trading-dashboard/` - Professional trading
- `src/pages/portfolio/` - Portfolio management
- `src/pages/settings/` - User settings

### Components
- `src/components/ui/` - Base UI components
- `src/components/AppIcon.jsx` - Icon system
- Dashboard components (PortfolioSummary, MarketOverview, etc.)

### Configuration
- `.env` - Environment variables with API keys
- `package.json` - Dependencies and scripts
- `vite.config.mjs` - Vite configuration

## 🔑 API Integration

### Demo Mode (Default)
- Set `VITE_DEMO_MODE=true` in `.env`
- Uses mock data for all features
- No API keys required
- Perfect for testing and development

### Live Data Mode
To use real market data, get free API keys:

1. **Alpha Vantage** (Free: 500 calls/day)
   - Visit: https://www.alphavantage.co/support/#api-key
   - Add to `.env`: `VITE_ALPHA_VANTAGE_API_KEY=your-key`

2. **Finnhub** (Free: 60 calls/minute)
   - Visit: https://finnhub.io/register
   - Add to `.env`: `VITE_FINNHUB_API_KEY=your-key`

3. **Polygon** (Free: 5 calls/minute)
   - Visit: https://polygon.io/
   - Add to `.env`: `VITE_POLYGON_API_KEY=your-key`

## 🎯 Features Overview

### Dashboard
- Portfolio summary with real-time values
- Market overview with major indices
- Quick action buttons
- Watchlist with live updates
- Recent trades history
- Market news feed
- Performance charts

### Trading
- Professional trading interface
- Real-time order book
- Market depth visualization
- Multiple order types (Market, Limit, Stop, Stop-Limit)
- Position management
- Risk controls

### Strategy Builder
- Visual strategy creation wizard
- 5-step process:
  1. Strategy basics
  2. Entry conditions
  3. Exit conditions
  4. Risk management
  5. Review and save
- Technical indicators
- Backtesting integration

### Portfolio Management
- Real-time position tracking
- P&L calculations
- Performance metrics
- Trade history
- Account reset functionality

### Settings
- Profile management
- Trading preferences
- Theme customization
- API key configuration
- Notification settings

## 🛠 Development

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm run serve` - Preview production build

### Project Structure
```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store
├── utils/              # Utility functions
└── styles/             # Global styles
```

### Adding New Features
1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update routes in `src/Routes.jsx`
4. Add Redux slices in `src/store/slices/`
5. Create services in `src/services/`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables for Production
Set these in your hosting platform:
- `VITE_DEMO_MODE=false`
- `VITE_ALPHA_VANTAGE_API_KEY=your-key`
- `VITE_FINNHUB_API_KEY=your-key`
- `VITE_POLYGON_API_KEY=your-key`

## 🔧 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in `public/` folder
- Modify app name in `package.json`

### Features
- Enable/disable features in `.env`
- Customize dashboard layout
- Add new trading instruments
- Integrate additional data sources

## 📞 Support

### Common Issues
1. **Port already in use**: App will automatically find next available port
2. **API rate limits**: Use demo mode or upgrade API plans
3. **Build errors**: Check Node.js version (16+ required)

### Getting Help
- Check console for error messages
- Review `.env` configuration
- Ensure all dependencies are installed
- Check network connectivity for API calls

## 🎉 You're Ready!

Your TradeCraft Pro platform is fully functional with:
- ✅ Complete trading interface
- ✅ Real-time market data
- ✅ Paper trading capabilities
- ✅ Strategy building tools
- ✅ Portfolio management
- ✅ Professional UI/UX
- ✅ Mobile responsive design

Start the app with `npm start` and begin trading!

---

**Happy Trading! 📈**