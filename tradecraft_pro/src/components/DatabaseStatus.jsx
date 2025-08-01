import React, { useState, useEffect } from 'react';
import dbInitService from '../services/dbInit';
import Icon from './AppIcon';

const DatabaseStatus = () => {
  const [status, setStatus] = useState({
    isConnected: false,
    canConnect: false,
    loading: true
  });

  useEffect(() => {
    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const connectionStatus = await dbInitService.getConnectionStatus();
      setStatus({
        ...connectionStatus,
        loading: false
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        canConnect: false,
        loading: false
      });
    }
  };

  if (status.loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span>Connecting to database...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status.isConnected ? (
        <>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-blue-600">LocalStorage Active</span>
          <Icon name="HardDrive" size={14} className="text-blue-600" />
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-600">Initializing...</span>
          <Icon name="Loader" size={14} className="text-yellow-600" />
        </>
      )}
    </div>
  );
};

export default DatabaseStatus;