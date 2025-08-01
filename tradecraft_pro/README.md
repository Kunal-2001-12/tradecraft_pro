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


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Powered by React and Vite
- Styled with Tailwind CSS



