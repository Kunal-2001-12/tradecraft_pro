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

## 📸 Application Screenshots & Detailed Documentation

This section provides comprehensive visual documentation of the TradeCraft Pro application with detailed explanations for developers and users.

---

### 🔐 1. Login & Authentication System

#### Login Page Interface
![Login Page](./public/screenshots/login-page.png)

**📍 URL:** `http://localhost:5173/`  
**🎯 Purpose:** Secure user authentication with demo account access  
**📱 Responsive:** ✅ Mobile & Desktop optimized

**🔧 Technical Implementation:**
- **Component:** `src/pages/login/index.jsx`
- **Authentication:** `src/services/auth.js`
- **State Management:** Redux `authSlice.js`
- **Styling:** Tailwind CSS with custom components

**✨ Key Features & UI Elements:**
1. **Login Form Container**
   - Email input field with validation
   - Password input with show/hide toggle
   - Remember me checkbox
   - Professional form styling with focus states

2. **Demo Account Access**
   - Pre-filled demo credentials button
   - Email: `demo@tradecraft.com`
   - Password: `Demo123!`
   - One-click demo login functionality

3. **Trust Signals Section**
   - Security badges and certifications
   - SSL encryption indicators
   - Professional branding elements
   - User testimonials/reviews

4. **Responsive Design Elements**
   - Mobile-first approach
   - Adaptive layout for all screen sizes
   - Touch-friendly button sizing
   - Optimized typography scaling

**🎨 Design Specifications:**
- **Color Scheme:** Professional blue/white theme
- **Typography:** Inter font family
- **Spacing:** 8px grid system
- **Animations:** Smooth transitions and hover effects

---

### 🏠 2. Main Dashboard Overview

#### Central Command Center
![Main Dashboard](./public/screenshots/main-dashboard.png)

**📍 URL:** `http://localhost:5173/dashboard`  
**🎯 Purpose:** Comprehensive portfolio and market overview  
**📱 Responsive:** ✅ Adaptive grid layout

**🔧 Technical Implementation:**
- **Component:** `src/pages/dashboard/index.jsx`
- **Data Services:** `src/services/portfolio.js`, `src/services/marketData.js`
- **State Management:** Multiple Redux slices
- **Charts:** Recharts library integration

**✨ Dashboard Components Breakdown:**

1. **📊 Portfolio Summary Card (Top Left)**
   - **Total Portfolio Value:** Real-time calculation
   - **Daily P&L:** Percentage and dollar changes
   - **Asset Allocation:** Pie chart visualization
   - **Performance Indicators:** Color-coded gains/losses
   - **Component:** `src/pages/dashboard/components/PortfolioSummary.jsx`

2. **📈 Market Overview Widget (Top Center)**
   - **Major Indices:** S&P 500, NASDAQ, DOW Jones
   - **Market Movers:** Top gainers and losers
   - **Sector Performance:** Heat map visualization
   - **Real-time Updates:** WebSocket integration
   - **Component:** `src/pages/dashboard/components/MarketOverview.jsx`

3. **📋 Recent Trades Table (Top Right)**
   - **Trade History:** Last 10 transactions
   - **Status Indicators:** Filled, pending, cancelled
   - **P&L Tracking:** Individual trade performance
   - **Quick Actions:** View details, repeat trade
   - **Component:** `src/pages/dashboard/components/RecentTrades.jsx`

4. **📊 Performance Chart (Middle Section)**
   - **Time Series:** Portfolio value over time
   - **Interactive Features:** Zoom, pan, hover details
   - **Multiple Timeframes:** 1D, 1W, 1M, 3M, 1Y
   - **Benchmark Comparison:** S&P 500 overlay
   - **Component:** `src/pages/dashboard/components/PerformanceChart.jsx`

5. **👁️ Watchlist Panel (Bottom Left)**
   - **Favorite Stocks:** User-selected securities
   - **Real-time Prices:** Live quote updates
   - **Quick Trade Access:** One-click order entry
   - **Price Alerts:** Notification system
   - **Component:** `src/pages/dashboard/components/Watchlist.jsx`

6. **📰 Market News Feed (Bottom Right)**
   - **Latest Headlines:** Financial news integration
   - **Market Updates:** Economic indicators
   - **Filtering Options:** By sector, relevance
   - **External Links:** Full article access
   - **Component:** `src/pages/dashboard/components/MarketNews.jsx`

**🎨 Layout Specifications:**
- **Grid System:** CSS Grid with responsive breakpoints
- **Card Design:** Elevated cards with subtle shadows
- **Color Coding:** Green (gains), Red (losses), Blue (neutral)
- **Typography Hierarchy:** Clear information hierarchy

---

### 📈 3. Professional Trading Interface

#### Advanced Trading Dashboard
![Trading Dashboard](./public/screenshots/trading-dashboard.png)

**📍 URL:** `http://localhost:5173/trading-dashboard`  
**🎯 Purpose:** Professional-grade trading interface  
**📱 Responsive:** ✅ Optimized for trading workflows

**🔧 Technical Implementation:**
- **Component:** `src/pages/trading-dashboard/index.jsx`
- **Real-time Data:** WebSocket connections
- **Order Management:** `src/services/trading.js`
- **Chart Library:** D3.js integration

**✨ Trading Interface Layout:**

1. **📊 Trading Chart Panel (Main Center)**
   - **Real-time Candlestick Charts:** OHLC data visualization
   - **Technical Indicators:** Moving averages, RSI, MACD
   - **Drawing Tools:** Trend lines, support/resistance
   - **Multiple Timeframes:** 1m, 5m, 15m, 1h, 4h, 1D
   - **Volume Analysis:** Volume bars and indicators
   - **Component:** `src/pages/trading-dashboard/components/TradingChart.jsx`

2. **💰 Order Entry Panel (Top Right)**
   - **Order Types:** Market, Limit, Stop, Stop-Limit
   - **Buy/Sell Toggle:** Clear action selection
   - **Quantity Input:** Share/dollar amount options
   - **Price Controls:** Limit price, stop price inputs
   - **Risk Management:** Position sizing calculator
   - **Order Preview:** Estimated costs and fees
   - **Component:** `src/pages/trading-dashboard/components/OrderEntry.jsx`

3. **📋 Positions Table (Bottom Left)**
   - **Active Positions:** Current holdings display
   - **Real-time P&L:** Live profit/loss calculation
   - **Position Details:** Entry price, quantity, market value
   - **Quick Actions:** Close position, modify stop-loss
   - **Risk Metrics:** Position size, portfolio percentage
   - **Component:** `src/pages/trading-dashboard/components/PositionsTable.jsx`

4. **📊 Order Book & Market Depth (Middle Right)**
   - **Bid/Ask Spread:** Real-time order book
   - **Market Depth:** Price level visualization
   - **Order Flow:** Recent trade activity
   - **Liquidity Analysis:** Volume at price levels
   - **Component:** `src/pages/trading-dashboard/components/OrderBook.jsx`

5. **📈 Trading Watchlist (Far Right)**
   - **Quick Symbol Search:** Instant stock lookup
   - **Price Monitoring:** Real-time quote updates
   - **One-Click Trading:** Direct order entry
   - **Custom Lists:** Sector-based groupings
   - **Component:** `src/pages/trading-dashboard/components/TradingWatchlist.jsx`

6. **📋 Orders History Table (Bottom Center)**
   - **Order Status:** Filled, pending, cancelled, rejected
   - **Order Details:** Type, quantity, price, timestamp
   - **Execution Quality:** Fill price vs. order price
   - **Order Management:** Cancel, modify pending orders
   - **Component:** `src/pages/trading-dashboard/components/OrdersTable.jsx`

**🎨 Professional Trading Design:**
- **Dark Theme:** Reduced eye strain for extended use
- **Color Coding:** Industry-standard red/green for prices
- **Compact Layout:** Maximum information density
- **Keyboard Shortcuts:** Power user functionality

---

### 💼 4. Portfolio Management System

#### Comprehensive Portfolio Analysis
![Portfolio Page](./public/screenshots/portfolio-page.png)

**📍 URL:** `http://localhost:5173/portfolio`  
**🎯 Purpose:** Complete portfolio tracking and analysis  
**📱 Responsive:** ✅ Table optimization for mobile

**🔧 Technical Implementation:**
- **Component:** `src/pages/portfolio/index.jsx`
- **Portfolio Service:** `src/services/portfolio.js`
- **Performance Calculations:** Real-time metrics
- **Data Visualization:** Multiple chart types

**✨ Portfolio Management Features:**

1. **📊 Holdings Overview Table**
   - **Security Details:** Symbol, company name, sector
   - **Position Information:** Shares, average cost, current price
   - **Performance Metrics:** Total return, daily change, % allocation
   - **Market Values:** Current value, unrealized P&L
   - **Sortable Columns:** Click to sort by any metric
   - **Export Functionality:** CSV/PDF export options

2. **🥧 Asset Allocation Visualization**
   - **Pie Chart:** Visual portfolio breakdown
   - **Sector Allocation:** Industry diversification
   - **Geographic Distribution:** Domestic vs. international
   - **Asset Class Mix:** Stocks, bonds, cash equivalents
   - **Interactive Elements:** Click to filter holdings

3. **📈 Performance Analytics Dashboard**
   - **Total Return:** Absolute and percentage gains
   - **Time-Weighted Returns:** Standardized performance
   - **Benchmark Comparison:** vs. S&P 500, custom benchmarks
   - **Risk Metrics:** Volatility, Sharpe ratio, max drawdown
   - **Performance Attribution:** Sector and security contribution

4. **📋 Transaction History Log**
   - **Complete Trade Record:** All buy/sell transactions
   - **Trade Details:** Date, type, quantity, price, fees
   - **P&L Tracking:** Realized gains/losses per trade
   - **Tax Information:** Cost basis, holding periods
   - **Search & Filter:** Date range, symbol, trade type

5. **⚠️ Risk Analysis Panel**
   - **Concentration Risk:** Single position exposure
   - **Correlation Analysis:** Inter-asset relationships
   - **Value at Risk (VaR):** Potential loss estimation
   - **Beta Analysis:** Market sensitivity measurement
   - **Diversification Score:** Portfolio optimization metrics

**🎨 Portfolio Design Elements:**
- **Data Tables:** Clean, scannable information layout
- **Visual Hierarchy:** Important metrics highlighted
- **Progressive Disclosure:** Expandable detail rows
- **Export Options:** Professional reporting capabilities

---

### 🛠️ 5. Strategy Builder Wizard

#### Visual Strategy Creation Interface
![Strategy Builder](./public/screenshots/strategy-builder.png)

**📍 URL:** `http://localhost:5173/strategy-builder`  
**🎯 Purpose:** Intuitive trading strategy development  
**📱 Responsive:** ✅ Step-by-step mobile optimization

**🔧 Technical Implementation:**
- **Component:** `src/pages/strategy-builder/index.jsx`
- **Wizard Logic:** Multi-step form management
- **Strategy Storage:** LocalStorage with MongoDB structure
- **Validation:** Real-time form validation

**✨ 5-Step Strategy Creation Process:**

1. **🎯 Step 1: Market Selection**
   - **Asset Universe:** Stocks, ETFs, indices selection
   - **Market Filters:** Market cap, sector, liquidity filters
   - **Geographic Scope:** US, international, emerging markets
   - **Screening Criteria:** Fundamental and technical filters
   - **Component:** `src/pages/strategy-builder/components/MarketSelectionStep.jsx`

2. **📊 Step 2: Entry Conditions**
   - **Technical Indicators:** RSI, MACD, moving averages
   - **Price Patterns:** Breakouts, reversals, trends
   - **Volume Conditions:** Volume spikes, accumulation
   - **Fundamental Triggers:** Earnings, news, events
   - **Logic Operators:** AND, OR, NOT combinations
   - **Component:** `src/pages/strategy-builder/components/EntryConditionsStep.jsx`

3. **🚪 Step 3: Exit Rules**
   - **Profit Targets:** Fixed percentage, trailing stops
   - **Stop Losses:** Fixed, percentage-based, ATR-based
   - **Time-Based Exits:** Maximum holding period
   - **Technical Exits:** Indicator reversals, pattern breaks
   - **Risk Management:** Position sizing rules
   - **Component:** `src/pages/strategy-builder/components/ExitRulesStep.jsx`

4. **⚖️ Step 4: Risk Parameters**
   - **Position Sizing:** Fixed dollar, percentage of portfolio
   - **Maximum Risk:** Per trade, total portfolio exposure
   - **Correlation Limits:** Maximum correlated positions
   - **Sector Limits:** Industry concentration controls
   - **Leverage Settings:** Margin usage parameters
   - **Component:** `src/pages/strategy-builder/components/RiskParametersStep.jsx`

5. **👁️ Step 5: Strategy Preview & Validation**
   - **Strategy Summary:** Complete rule overview
   - **Logic Validation:** Conflict detection, optimization
   - **Backtesting Preview:** Quick historical test
   - **Save Options:** Strategy naming and categorization
   - **Component:** `src/pages/strategy-builder/components/StrategyPreview.jsx`

**🎨 Wizard Design Features:**
- **Progress Indicator:** Clear step progression
- **Form Validation:** Real-time error checking
- **Save & Resume:** Draft strategy preservation
- **Help System:** Contextual tooltips and guides

---

### 🔬 6. Backtesting Engine Dashboard

#### Historical Strategy Testing Interface
![Backtesting Dashboard](./public/screenshots/backtesting-dashboard.png)

**📍 URL:** `http://localhost:5173/backtesting-dashboard`  
**🎯 Purpose:** Comprehensive strategy backtesting and analysis  
**📱 Responsive:** ✅ Chart optimization for all devices

**🔧 Technical Implementation:**
- **Component:** `src/pages/backtesting-dashboard/index.jsx`
- **Backtesting Engine:** Historical data processing
- **Performance Calculations:** Statistical analysis
- **Chart Rendering:** Advanced visualization

**✨ Backtesting Analysis Components:**

1. **📊 Equity Curve Visualization**
   - **Portfolio Value:** Strategy performance over time
   - **Benchmark Comparison:** vs. buy-and-hold, indices
   - **Drawdown Periods:** Peak-to-trough declines
   - **Interactive Timeline:** Zoom, pan, hover details
   - **Component:** `src/pages/backtesting-dashboard/components/TradingChart.jsx`

2. **📈 Performance Metrics Dashboard**
   - **Return Metrics:** Total return, CAGR, volatility
   - **Risk Metrics:** Sharpe ratio, Sortino ratio, max drawdown
   - **Trade Statistics:** Win rate, average trade, profit factor
   - **Efficiency Metrics:** Calmar ratio, information ratio
   - **Component:** `src/pages/backtesting-dashboard/components/MetricsCard.jsx`

3. **📋 Trade History Analysis**
   - **Individual Trades:** Entry/exit details, P&L
   - **Trade Distribution:** Win/loss analysis
   - **Holding Periods:** Average trade duration
   - **Seasonal Analysis:** Monthly/quarterly patterns
   - **Component:** `src/pages/backtesting-dashboard/components/TradeHistoryTable.jsx`

4. **🛠️ Backtesting Controls**
   - **Date Range Selection:** Custom testing periods
   - **Strategy Parameters:** Adjustable variables
   - **Market Conditions:** Bull/bear market filtering
   - **Transaction Costs:** Commission and slippage modeling
   - **Component:** `src/pages/backtesting-dashboard/components/BacktestToolbar.jsx`

5. **📊 Risk Analysis Charts**
   - **Rolling Returns:** Performance consistency
   - **Correlation Analysis:** Market relationship
   - **Underwater Curve:** Drawdown visualization
   - **Monte Carlo Simulation:** Probability analysis

**🎨 Backtesting Interface Design:**
- **Professional Charts:** Financial industry standards
- **Metric Cards:** Key statistics highlighting
- **Data Tables:** Detailed trade information
- **Export Capabilities:** Report generation

---

### 📊 7. Performance Analytics Dashboard

#### Advanced Portfolio Analytics
![Performance Analytics](./public/screenshots/performance-analytics.png)

**📍 URL:** `http://localhost:5173/performance-analytics-dashboard`  
**🎯 Purpose:** Deep-dive performance analysis and reporting  
**📱 Responsive:** ✅ Advanced chart responsiveness

**🔧 Technical Implementation:**
- **Component:** `src/pages/performance-analytics-dashboard/index.jsx`
- **Analytics Engine:** Complex performance calculations
- **Visualization Library:** D3.js and Recharts integration
- **Data Processing:** Real-time metric computation

**✨ Advanced Analytics Features:**

1. **📈 Equity Curve Analysis**
   - **Cumulative Returns:** Portfolio growth visualization
   - **Benchmark Overlay:** Comparative performance
   - **Volatility Bands:** Risk-adjusted performance
   - **Component:** `src/pages/performance-analytics-dashboard/components/EquityCurveChart.jsx`

2. **📉 Drawdown Analysis Chart**
   - **Maximum Drawdown:** Largest peak-to-trough decline
   - **Drawdown Duration:** Recovery time analysis
   - **Underwater Periods:** Below high-water mark
   - **Component:** `src/pages/performance-analytics-dashboard/components/DrawdownChart.jsx`

3. **🔥 Monthly Returns Heatmap**
   - **Calendar View:** Month-by-month performance
   - **Color Coding:** Performance intensity visualization
   - **Seasonal Patterns:** Identify recurring trends
   - **Component:** `src/pages/performance-analytics-dashboard/components/MonthlyReturnsHeatmap.jsx`

4. **📊 Rolling Performance Metrics**
   - **Rolling Returns:** 12-month performance windows
   - **Rolling Sharpe Ratio:** Risk-adjusted consistency
   - **Rolling Volatility:** Risk pattern analysis
   - **Component:** `src/pages/performance-analytics-dashboard/components/RollingMetricsChart.jsx`

5. **📋 Performance Metrics Table**
   - **Comprehensive Statistics:** All key metrics
   - **Benchmark Comparison:** Relative performance
   - **Risk-Adjusted Returns:** Sharpe, Sortino, Calmar ratios
   - **Component:** `src/pages/performance-analytics-dashboard/components/PerformanceTable.jsx`

6. **🎯 Performance Metric Cards**
   - **Key Statistics:** Highlighted important metrics
   - **Visual Indicators:** Performance trend arrows
   - **Comparative Analysis:** vs. benchmarks
   - **Component:** `src/pages/performance-analytics-dashboard/components/PerformanceMetricCard.jsx`

**🎨 Analytics Design Philosophy:**
- **Information Density:** Maximum insight per screen
- **Visual Hierarchy:** Most important metrics prominent
- **Interactive Elements:** Drill-down capabilities
- **Professional Presentation:** Investment-grade reporting

---

### 📱 8. Mobile Responsive Experience

#### Cross-Device Optimization
![Mobile View](./public/screenshots/mobile-view.png)

**📍 Responsive Design:** All URLs optimized for mobile  
**🎯 Purpose:** Full functionality on mobile devices  
**📱 Optimization:** Touch-first interface design

**🔧 Mobile Technical Implementation:**
- **Responsive Framework:** Tailwind CSS breakpoints
- **Touch Optimization:** Finger-friendly interactions
- **Performance:** Optimized for mobile networks
- **Progressive Web App:** PWA capabilities

**✨ Mobile-Specific Features:**

1. **📱 Mobile Navigation**
   - **Hamburger Menu:** Collapsible sidebar navigation
   - **Bottom Tab Bar:** Quick access to main sections
   - **Swipe Gestures:** Intuitive navigation patterns
   - **Touch Targets:** Minimum 44px touch areas

2. **📊 Responsive Charts**
   - **Touch Interactions:** Pinch to zoom, pan to scroll
   - **Simplified Views:** Essential information focus
   - **Orientation Support:** Portrait and landscape modes
   - **Performance Optimization:** Reduced data points

3. **📋 Mobile Tables**
   - **Horizontal Scrolling:** Wide data table support
   - **Card Layout:** Alternative mobile-friendly views
   - **Priority Columns:** Most important data visible
   - **Expandable Rows:** Detailed information on demand

4. **⚡ Performance Optimizations**
   - **Lazy Loading:** Images and components on demand
   - **Code Splitting:** Reduced initial bundle size
   - **Caching Strategy:** Offline capability
   - **Network Awareness:** Adaptive loading based on connection

**🎨 Mobile Design Principles:**
- **Touch-First:** Designed for finger navigation
- **Content Priority:** Most important information first
- **Simplified Interface:** Reduced cognitive load
- **Fast Loading:** Optimized for mobile networks

---

## 🎯 Developer Implementation Guide

### Screenshot Integration Checklist

**📸 For Each Screenshot:**
1. **File Naming:** Use exact names specified above
2. **Resolution:** 1920x1080 (desktop), 375x812 (mobile)
3. **Format:** PNG for best quality
4. **Content:** Clean, professional sample data
5. **Consistency:** Same theme across all screenshots

**🔧 Technical Requirements:**
- Start application: `npm start`
- Navigate to each URL
- Use demo account: `demo@tradecraft.com` / `Demo123!`
- Capture full interface with sample data
- Save in `public/screenshots/` directory

**📚 Documentation Standards:**
- Each screenshot includes technical details
- Component file paths provided
- Implementation notes for developers
- Responsive design considerations
- Feature explanations for users

This comprehensive documentation ensures that developers can understand the application architecture, users can navigate effectively, and stakeholders can appreciate the full feature set of TradeCraft Pro.

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



