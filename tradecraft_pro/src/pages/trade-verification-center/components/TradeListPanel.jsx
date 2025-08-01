import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TradeListPanel = ({ trades, selectedTrade, onTradeSelect, onBulkAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTrades, setSelectedTrades] = useState(new Set());

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'flagged', label: 'Flagged' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
    const matchesDate = dateFilter === 'all' || checkDateFilter(trade.entryDate, dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const checkDateFilter = (date, filter) => {
    const tradeDate = new Date(date);
    const now = new Date();
    
    switch (filter) {
      case 'today':
        return tradeDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tradeDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return tradeDate >= monthAgo;
      default:
        return true;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'approved':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-error bg-error/10';
      case 'flagged':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'flagged':
        return 'Flag';
      default:
        return 'Circle';
    }
  };

  const handleTradeSelection = (tradeId) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(tradeId)) {
      newSelected.delete(tradeId);
    } else {
      newSelected.add(tradeId);
    }
    setSelectedTrades(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTrades.size === filteredTrades.length) {
      setSelectedTrades(new Set());
    } else {
      setSelectedTrades(new Set(filteredTrades.map(trade => trade.id)));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedTrades.size > 0) {
      onBulkAction(Array.from(selectedTrades), action);
      setSelectedTrades(new Set());
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Trade Verification</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {filteredTrades.length} trades
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <Input
            type="search"
            placeholder="Search by symbol or trade ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
          />
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Date"
          />
        </div>

        {/* Bulk Actions */}
        {selectedTrades.size > 0 && (
          <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md mb-2">
            <span className="text-sm text-primary font-medium">
              {selectedTrades.size} selected
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('approve')}
                iconName="CheckCircle"
                iconSize={14}
              >
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('reject')}
                iconName="XCircle"
                iconSize={14}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* Select All */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedTrades.size === filteredTrades.length && filteredTrades.length > 0}
            onChange={handleSelectAll}
            className="rounded border-border"
          />
          <label htmlFor="selectAll" className="text-sm text-muted-foreground">
            Select all
          </label>
        </div>
      </div>

      {/* Trade List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No trades found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => onTradeSelect(trade)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedTrade?.id === trade.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedTrades.has(trade.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTradeSelection(trade.id);
                      }}
                      className="rounded border-border"
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{trade.symbol}</h3>
                      <p className="text-xs text-muted-foreground">ID: {trade.id}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                    <Icon name={getStatusIcon(trade.status)} size={12} />
                    <span className="capitalize">{trade.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block">Entry Date</span>
                    <span className="text-foreground">{new Date(trade.entryDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block">P&L</span>
                    <span className={`font-medium ${trade.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                      ${trade.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>

                {trade.hasLookaheadBias && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-warning">
                    <Icon name="AlertTriangle" size={12} />
                    <span>Potential lookahead bias</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeListPanel;