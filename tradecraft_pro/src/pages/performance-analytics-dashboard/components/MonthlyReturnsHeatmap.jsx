import React, { useState } from 'react';



const MonthlyReturnsHeatmap = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const years = [2022, 2023, 2024];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Mock monthly returns data
  const monthlyReturns = {
    2022: [2.1, -1.5, 3.2, -0.8, 1.9, -2.1, 4.1, 1.2, -1.8, 2.5, 0.9, 1.7],
    2023: [1.8, 2.4, -1.2, 3.1, 0.7, 2.8, -0.5, 1.9, 2.2, -1.1, 1.5, 2.9],
    2024: [2.5, 3.4, 5.8, -2.6, 8.9, 3.5, 2.8, 3.2, 3.4, 0, 0, 0] // Current year with some months incomplete
  };

  const getReturnColor = (returnValue) => {
    if (returnValue === 0) return 'bg-muted text-muted-foreground'; // No data
    if (returnValue > 4) return 'bg-success text-white';
    if (returnValue > 2) return 'bg-success/80 text-white';
    if (returnValue > 0) return 'bg-success/60 text-white';
    if (returnValue > -2) return 'bg-error/60 text-white';
    if (returnValue > -4) return 'bg-error/80 text-white';
    return 'bg-error text-white';
  };

  const formatReturn = (value) => {
    if (value === 0) return '-';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const calculateYearlyReturn = (returns) => {
    const validReturns = returns.filter(r => r !== 0);
    return validReturns.reduce((acc, curr) => acc * (1 + curr / 100), 1) - 1;
  };

  const calculateStats = (returns) => {
    const validReturns = returns.filter(r => r !== 0);
    const positive = validReturns.filter(r => r > 0).length;
    const negative = validReturns.filter(r => r < 0).length;
    const winRate = validReturns.length > 0 ? (positive / validReturns.length) * 100 : 0;
    const avgReturn = validReturns.length > 0 ? validReturns.reduce((a, b) => a + b, 0) / validReturns.length : 0;
    const bestMonth = Math.max(...validReturns);
    const worstMonth = Math.min(...validReturns);

    return { positive, negative, winRate, avgReturn, bestMonth, worstMonth };
  };

  const currentYearReturns = monthlyReturns[selectedYear];
  const yearlyReturn = calculateYearlyReturn(currentYearReturns);
  const stats = calculateStats(currentYearReturns);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Returns Heatmap</h3>
          <p className="text-sm text-muted-foreground">Monthly performance breakdown by year</p>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                selectedYear === year
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-13 gap-1 text-xs">
          {/* Header row */}
          <div className="text-right text-muted-foreground font-medium py-2">
            {selectedYear}
          </div>
          {months.map((month) => (
            <div key={month} className="text-center text-muted-foreground font-medium py-2">
              {month}
            </div>
          ))}
          
          {/* Data row */}
          <div className="text-right text-muted-foreground font-medium py-2">
            Returns
          </div>
          {currentYearReturns.map((returnValue, index) => (
            <div
              key={index}
              className={`text-center py-3 px-2 rounded font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${getReturnColor(returnValue)}`}
              title={`${months[index]} ${selectedYear}: ${formatReturn(returnValue)}`}
            >
              {formatReturn(returnValue)}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error rounded"></div>
            <span className="text-muted-foreground">&lt; -4%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error/60 rounded"></div>
            <span className="text-muted-foreground">-2% to 0%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success/60 rounded"></div>
            <span className="text-muted-foreground">0% to 2%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-muted-foreground">&gt; 4%</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {(yearlyReturn * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">YTD Return</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {stats.avgReturn.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {stats.bestMonth.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Best Month</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-error">
              {stats.worstMonth.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Worst Month</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {stats.winRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">
              {stats.positive}/{stats.negative}
            </div>
            <div className="text-xs text-muted-foreground">Win/Loss</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReturnsHeatmap;