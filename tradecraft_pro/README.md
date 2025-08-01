# TradeCraft Pro - Advanced Trading Platform

A comprehensive, production-ready trading platform built with React, Redux, and modern web technologies. Features real-time market data, paper trading, strategy building, backtesting, and portfolio management.

## 🚀 Features

### Core Trading Features
- **Real-time Market Data** - Live quotes, charts, and market news
- **Paper Trading** - Risk-free trading with virtual money ($100,000 starting balance)
- **Portfolio Management** - Track positions, P&L, and performance metrics
- **Order Management** - Market, limit, stop, and stop-limit orders
- **Watchlists** - Monitor your favorite stocks with real-time updates
- **Trading Dashboard** - Professional trading interface with advanced tools

### Strategy & Analytics
- **Strategy Builder** - Visual strategy creation with 5-step wizard
- **Backtesting Engine** - Test strategies on historical data
- **Performance Analytics** - Comprehensive performance metrics and charts
- **Risk Management** - Position sizing and risk controls
- **Trade Verification** - Validate and optimize trades

### Technical Features
- **React 18** - Modern React with concurrent features
- **Redux Toolkit** - Centralized state management
- **Real-time Updates** - WebSocket connections for live data
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark/Light Theme** - Customizable appearance
- **Data Visualization** - Advanced charts with D3.js and Recharts

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🗄️ Data Persistence

### Browser Storage System
Your application uses a sophisticated browser-based storage system:
- **Storage Type**: Browser LocalStorage with MongoDB-compatible API
- **Data Structure**: Simulated collections for users, portfolios, orders, strategies, watchlists
- **Persistence**: All data saved locally in your browser
- **Future Ready**: Designed for easy migration to backend API + MongoDB

### Features
- ✅ **User Authentication** - Secure login with persistent sessions
- ✅ **Portfolio Persistence** - All trades and positions saved locally
- ✅ **Order History** - Complete trading history stored
- ✅ **Strategy Storage** - Save and manage trading strategies
- ✅ **Watchlist Sync** - Persistent watchlists
- ✅ **Demo User** - Pre-configured demo account

### Demo Credentials
- **Email**: `demo@tradecraft.com`
- **Password**: `Demo123!`

The app automatically creates a demo user with $100,000 starting balance on first run.

### Why LocalStorage?
- **Browser Compatibility**: Works in all modern browsers without server setup
- **Instant Setup**: No database configuration required
- **Full Functionality**: Complete trading simulation with persistent data
- **Production Ready**: Easy to migrate to real backend when needed

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.

## 📸 Screenshots & Documentation

### Login Page
The secure login interface with demo credentials and trust signals.

![Login Page](./public/screenshots/login-page.png)

**Features:**
- Clean, professional login form
- Demo account access
- Trust signals and security indicators
- Responsive design for all devices

### Main Dashboard
Comprehensive overview of your trading portfolio and market data.

![Main Dashboard](./public/screenshots/main-dashboard.png)

**Features:**
- Portfolio summary with P&L
- Real-time market overview
- Recent trades history
- Quick action buttons
- Performance charts
- Market news feed
- Watchlist with live updates

### Trading Dashboard
Professional trading interface with advanced tools and real-time data.

![Trading Dashboard](./public/screenshots/trading-dashboard.png)

**Features:**
- Real-time price charts
- Order entry panel
- Live positions tracking
- Order book and market depth
- Trading watchlist
- Order history table
- Position management tools

### Portfolio Management
Track your investments and analyze performance metrics.

![Portfolio Page](./public/screenshots/portfolio-page.png)

**Features:**
- Detailed position tracking
- P&L analysis
- Asset allocation charts
- Performance metrics
- Trade history
- Risk analysis

### Strategy Builder
Visual strategy creation with a 5-step wizard interface.

![Strategy Builder](./public/screenshots/strategy-builder.png)

**Features:**
- Step-by-step strategy creation
- Market selection tools
- Entry/exit condition setup
- Risk parameter configuration
- Strategy preview and validation
- Save and manage strategies

### Backtesting Dashboard
Test your strategies on historical data with comprehensive analytics.

![Backtesting Dashboard](./public/screenshots/backtesting-dashboard.png)

**Features:**
- Historical data backtesting
- Performance metrics
- Trade history analysis
- Equity curve visualization
- Risk metrics calculation
- Strategy optimization tools

### Performance Analytics
Advanced analytics and performance tracking dashboard.

![Performance Analytics](./public/screenshots/performance-analytics.png)

**Features:**
- Equity curve analysis
- Drawdown charts
- Monthly returns heatmap
- Rolling performance metrics
- Risk-adjusted returns
- Benchmark comparisons

### Mobile Responsive Design
Fully responsive design that works perfectly on all devices.

![Mobile View](./public/screenshots/mobile-view.png)

**Features:**
- Touch-optimized interface
- Responsive charts and tables
- Mobile-friendly navigation
- Optimized for trading on-the-go

## 🎯 User Journey

### Getting Started
1. **Login**: Use demo credentials (`demo@tradecraft.com` / `Demo123!`)
2. **Dashboard**: Review your portfolio and market overview
3. **Explore**: Navigate through different sections using the sidebar
4. **Trade**: Use the trading dashboard to place orders
5. **Analyze**: Review performance in the analytics section

### Key Workflows

#### Making Your First Trade
1. Navigate to Trading Dashboard
2. Select a stock from the watchlist
3. Choose order type (Market/Limit/Stop)
4. Enter quantity and price
5. Review and submit order
6. Monitor position in the positions table

#### Building a Strategy
1. Go to Strategy Builder
2. Follow the 5-step wizard:
   - Select markets and instruments
   - Define entry conditions
   - Set exit rules
   - Configure risk parameters
   - Review and save strategy

#### Backtesting a Strategy
1. Open Backtesting Dashboard
2. Select your strategy
3. Choose date range and parameters
4. Run backtest
5. Analyze results and metrics
6. Optimize parameters if needed

## 📊 Data & Features

### Real-time Data
- Live stock quotes and market data
- Real-time portfolio updates
- Live P&L calculations
- Market news and updates

### Trading Features
- **Order Types**: Market, Limit, Stop, Stop-Limit
- **Position Management**: Long/Short positions
- **Risk Controls**: Position sizing and limits
- **Paper Trading**: $100,000 virtual balance

### Analytics & Reporting
- Performance metrics (Sharpe ratio, Max drawdown, etc.)
- Trade analysis and statistics
- Portfolio allocation charts
- Risk assessment tools

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 📸 Adding Screenshots

The documentation includes placeholders for screenshots. To add actual screenshots:

1. **Start the application**:
   ```bash
   cd tradecraft_pro
   npm start
   ```

2. **Take screenshots** of each page:
   - Login page (`http://localhost:5173/`)
   - Main dashboard (`http://localhost:5173/dashboard`)
   - Trading dashboard (`http://localhost:5173/trading-dashboard`)
   - Portfolio page (`http://localhost:5173/portfolio`)
   - Strategy builder (`http://localhost:5173/strategy-builder`)
   - Backtesting dashboard (`http://localhost:5173/backtesting-dashboard`)
   - Performance analytics (`http://localhost:5173/performance-analytics-dashboard`)

3. **Save screenshots** in `public/screenshots/` directory with these exact names:
   - `login-page.png`
   - `main-dashboard.png`
   - `trading-dashboard.png`
   - `portfolio-page.png`
   - `strategy-builder.png`
   - `backtesting-dashboard.png`
   - `performance-analytics.png`
   - `mobile-view.png`

4. **Guidelines**:
   - Use 1440x900 or 1920x1080 resolution for desktop
   - Use 375x812 resolution for mobile view
   - PNG format for best quality
   - Clean, professional appearance
   - See `public/screenshots/README.md` for detailed instructions

## 📚 Additional Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Comprehensive feature guide with detailed screenshots
- **[Screenshots Guide](./public/screenshots/README.md)** - Instructions for adding screenshots
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[Components Guide](./COMPONENTS_FIXED.md)** - Component architecture details

## 🙏 Acknowledgments

- Powered by React and Vite
- Styled with Tailwind CSS



