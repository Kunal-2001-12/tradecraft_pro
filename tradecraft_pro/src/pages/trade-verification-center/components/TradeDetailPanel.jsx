import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TradeDetailPanel = ({ trade, onTradeUpdate, onTradeAction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrade, setEditedTrade] = useState(trade || {});

  if (!trade) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Trade</h3>
          <p className="text-muted-foreground">Choose a trade from the list to view details</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTrade({ ...trade });
  };

  const handleSave = () => {
    onTradeUpdate(editedTrade);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrade({ ...trade });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedTrade(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'approved':
        return 'text-success bg-success/10 border-success/20';
      case 'rejected':
        return 'text-error bg-error/10 border-error/20';
      case 'flagged':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
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

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-foreground">{trade.symbol}</h1>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trade.status)}`}>
              <Icon name={getStatusIcon(trade.status)} size={14} />
              <span className="capitalize">{trade.status}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  iconName="Edit"
                  iconPosition="left"
                  iconSize={16}
                >
                  Edit
                </Button>
                <Button
                  variant="success"
                  onClick={() => onTradeAction(trade.id, 'approve')}
                  iconName="CheckCircle"
                  iconPosition="left"
                  iconSize={16}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onTradeAction(trade.id, 'reject')}
                  iconName="XCircle"
                  iconPosition="left"
                  iconSize={16}
                >
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  iconName="X"
                  iconPosition="left"
                  iconSize={16}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  iconName="Save"
                  iconPosition="left"
                  iconSize={16}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Trade ID</span>
            <p className="font-medium text-foreground">{trade.id}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Entry Date</span>
            <p className="font-medium text-foreground">{new Date(trade.entryDate).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Exit Date</span>
            <p className="font-medium text-foreground">
              {trade.exitDate ? new Date(trade.exitDate).toLocaleDateString() : 'Open'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">P&L</span>
            <p className={`font-medium ${trade.pnl >= 0 ? 'text-success' : 'text-error'}`}>
              ${trade.pnl.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trade Parameters */}
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trade Parameters</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Entry Price</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTrade.entryPrice}
                        onChange={(e) => handleFieldChange('entryPrice', parseFloat(e.target.value))}
                        step="0.01"
                      />
                    ) : (
                      <p className="font-medium text-foreground">${trade.entryPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Exit Price</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTrade.exitPrice || ''}
                        onChange={(e) => handleFieldChange('exitPrice', parseFloat(e.target.value))}
                        step="0.01"
                      />
                    ) : (
                      <p className="font-medium text-foreground">
                        {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Quantity</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTrade.quantity}
                        onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value))}
                      />
                    ) : (
                      <p className="font-medium text-foreground">{trade.quantity}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Direction</label>
                    <p className={`font-medium ${trade.direction === 'long' ? 'text-success' : 'text-error'}`}>
                      {trade.direction.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Stop Loss</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTrade.stopLoss || ''}
                        onChange={(e) => handleFieldChange('stopLoss', parseFloat(e.target.value))}
                        step="0.01"
                      />
                    ) : (
                      <p className="font-medium text-foreground">
                        {trade.stopLoss ? `$${trade.stopLoss.toFixed(2)}` : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Take Profit</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedTrade.takeProfit || ''}
                        onChange={(e) => handleFieldChange('takeProfit', parseFloat(e.target.value))}
                        step="0.01"
                      />
                    ) : (
                      <p className="font-medium text-foreground">
                        {trade.takeProfit ? `$${trade.takeProfit.toFixed(2)}` : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Analysis */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Execution Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Execution Delay</span>
                  <span className="font-medium text-foreground">{trade.executionDelay}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Slippage</span>
                  <span className="font-medium text-foreground">${trade.slippage.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Commission</span>
                  <span className="font-medium text-foreground">${trade.commission.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spread</span>
                  <span className="font-medium text-foreground">${trade.spread.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validation & Warnings */}
          <div className="space-y-6">
            {/* Price Chart Placeholder */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Price Chart</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon name="TrendingUp" size={48} className="text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">Interactive price chart with entry/exit markers</p>
                </div>
              </div>
            </div>

            {/* Validation Checks */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Validation Checks</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={trade.hasLookaheadBias ? "AlertTriangle" : "CheckCircle"} 
                    size={16} 
                    className={trade.hasLookaheadBias ? "text-warning" : "text-success"} 
                  />
                  <span className="text-foreground">Lookahead Bias Check</span>
                  <span className={`text-sm ${trade.hasLookaheadBias ? "text-warning" : "text-success"}`}>
                    {trade.hasLookaheadBias ? "Warning" : "Passed"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon 
                    name={trade.realisticTiming ? "CheckCircle" : "AlertTriangle"} 
                    size={16} 
                    className={trade.realisticTiming ? "text-success" : "text-warning"} 
                  />
                  <span className="text-foreground">Execution Timing</span>
                  <span className={`text-sm ${trade.realisticTiming ? "text-success" : "text-warning"}`}>
                    {trade.realisticTiming ? "Realistic" : "Review Required"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon 
                    name={trade.validSpread ? "CheckCircle" : "AlertTriangle"} 
                    size={16} 
                    className={trade.validSpread ? "text-success" : "text-warning"} 
                  />
                  <span className="text-foreground">Spread Validation</span>
                  <span className={`text-sm ${trade.validSpread ? "text-success" : "text-warning"}`}>
                    {trade.validSpread ? "Valid" : "Unusual"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Icon 
                    name={trade.volumeCheck ? "CheckCircle" : "AlertTriangle"} 
                    size={16} 
                    className={trade.volumeCheck ? "text-success" : "text-warning"} 
                  />
                  <span className="text-foreground">Volume Check</span>
                  <span className={`text-sm ${trade.volumeCheck ? "text-success" : "text-warning"}`}>
                    {trade.volumeCheck ? "Sufficient" : "Low Volume"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Notes & Comments</h3>
              {isEditing ? (
                <textarea
                  value={editedTrade.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  placeholder="Add notes about this trade..."
                  className="w-full h-24 p-3 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-foreground">
                  {trade.notes || 'No notes available for this trade.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailPanel;