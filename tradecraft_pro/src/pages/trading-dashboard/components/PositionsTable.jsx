import React from 'react';
import PositionsList from './PositionsList';

// This is a wrapper component that uses PositionsList
// Keeping it for backward compatibility with existing imports
const PositionsTable = ({ onSymbolSelect }) => {
  return <PositionsList onSymbolSelect={onSymbolSelect} />;
};

export default PositionsTable;