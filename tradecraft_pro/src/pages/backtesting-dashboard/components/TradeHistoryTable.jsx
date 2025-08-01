import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TradeHistoryTable = ({ trades, onTradeSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'entryDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTrades, setSelectedTrades] = useState(new Set());

  const sortedTrades = useMemo(() => {
    const sortedData = [...trades].sort((a, b) => {
      if (sortConfig.key === 'entryDate' || sortConfig.key === 'exitDate') {
        const aDate = new Date(a[sortConfig.key]);
        const bDate = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof a[sortConfig.key] === 'number') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
    
    return sortedData;
  }, [trades, sortConfig]);

  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTrades.slice(startIndex, startIndex + pageSize);
  }, [sortedTrades, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedTrades.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectTrade = (tradeId) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(tradeId)) {
      newSelected.delete(tradeId);
    } else {
      newSelected.add(tradeId);
    }
    setSelectedTrades(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTrades.size === paginatedTrades.length) {
      setSelectedTrades(new Set());
    } else {
      setSelectedTrades(new Set(paginatedTrades.map(trade => trade.id)));
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-foreground" />
      : <Icon name="ArrowDown" size={14} className="text-foreground" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Trade History</h3>
          <span className="text-sm text-muted-foreground">
            {sortedTrades.length} trades
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          
          {selectedTrades.size > 0 && (
            <Button variant="outline" size="sm">
              <Icon name="Download" size={14} className="mr-2" />
              Export ({selectedTrades.size})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedTrades.size === paginatedTrades.length && paginatedTrades.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('symbol')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Symbol</span>
                  {getSortIcon('symbol')}
                </button>
              </th>
              
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Type</span>
                  {getSortIcon('type')}
                </button>
              </th>
              
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('entryDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Entry</span>
                  {getSortIcon('entryDate')}
                </button>
              </th>
              
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('exitDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Exit</span>
                  {getSortIcon('exitDate')}
                </button>
              </th>
              
              <th className="text-right p-3">
                <button
                  onClick={() => handleSort('entryPrice')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Entry Price</span>
                  {getSortIcon('entryPrice')}
                </button>
              </th>
              
              <th className="text-right p-3">
                <button
                  onClick={() => handleSort('exitPrice')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Exit Price</span>
                  {getSortIcon('exitPrice')}
                </button>
              </th>
              
              <th className="text-right p-3">
                <button
                  onClick={() => handleSort('pnl')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>P&L</span>
                  {getSortIcon('pnl')}
                </button>
              </th>
              
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('duration')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Duration</span>
                  {getSortIcon('duration')}
                </button>
              </th>
              
              <th className="text-center p-3 w-20">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {paginatedTrades.map((trade, index) => (
              <tr 
                key={trade.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors duration-150 ${
                  selectedTrades.has(trade.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedTrades.has(trade.id)}
                    onChange={() => handleSelectTrade(trade.id)}
                    className="rounded border-border"
                  />
                </td>
                
                <td className="p-3">
                  <span className="font-medium text-foreground">{trade.symbol}</span>
                </td>
                
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    trade.type === 'buy' ?'bg-success/10 text-success' :'bg-error/10 text-error'
                  }`}>
                    <Icon 
                      name={trade.type === 'buy' ? 'ArrowUp' : 'ArrowDown'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-foreground">{formatDate(trade.entryDate)}</div>
                    <div className="text-muted-foreground text-xs">{formatTime(trade.entryDate)}</div>
                  </div>
                </td>
                
                <td className="p-3">
                  <div className="text-sm">
                    <div className="text-foreground">{formatDate(trade.exitDate)}</div>
                    <div className="text-muted-foreground text-xs">{formatTime(trade.exitDate)}</div>
                  </div>
                </td>
                
                <td className="p-3 text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${trade.entryPrice.toFixed(2)}
                  </span>
                </td>
                
                <td className="p-3 text-right">
                  <span className="text-sm font-medium text-foreground">
                    ${trade.exitPrice.toFixed(2)}
                  </span>
                </td>
                
                <td className="p-3 text-right">
                  <span className={`text-sm font-medium ${
                    trade.pnl >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {((trade.pnl / (trade.entryPrice * trade.quantity)) * 100).toFixed(1)}%
                  </div>
                </td>
                
                <td className="p-3">
                  <span className="text-sm text-foreground">{trade.duration}</span>
                </td>
                
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTradeSelect(trade)}
                    className="h-8 w-8"
                  >
                    <Icon name="Eye" size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedTrades.length)} of {sortedTrades.length} trades
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={14} />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistoryTable;