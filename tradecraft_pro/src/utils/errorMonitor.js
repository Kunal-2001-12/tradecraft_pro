// Error Monitoring Utility
// Captures and logs runtime errors for debugging

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.isEnabled = import.meta.env.DEV;
    
    if (this.isEnabled) {
      this.setupErrorHandlers();
    }
  }

  setupErrorHandlers() {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.logError('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Override console.error to capture React errors
    const originalError = console.error;
    console.error = (...args) => {
      // Check if this is a React error
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('Warning:') || 
        message.includes('Error:') ||
        message.includes('Failed to')
      )) {
        this.logWarning('React Warning/Error', { message, args });
      }
      originalError.apply(console, args);
    };

    // Override console.warn to capture warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      this.logWarning('Console Warning', { args });
      originalWarn.apply(console, args);
    };
  }

  logError(type, details) {
    const errorEntry = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorEntry);
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    console.group(`🚨 ${type}`);
    console.error('Details:', details);
    console.error('Timestamp:', errorEntry.timestamp);
    console.groupEnd();
  }

  logWarning(type, details) {
    const warningEntry = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.warnings.push(warningEntry);
    
    // Keep only last 100 warnings
    if (this.warnings.length > 100) {
      this.warnings = this.warnings.slice(-100);
    }
  }

  getErrorSummary() {
    return {
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
      recentErrors: this.errors.slice(-10),
      recentWarnings: this.warnings.slice(-10),
      errorTypes: this.getErrorTypes(),
      commonIssues: this.getCommonIssues()
    };
  }

  getErrorTypes() {
    const types = {};
    this.errors.forEach(error => {
      types[error.type] = (types[error.type] || 0) + 1;
    });
    return types;
  }

  getCommonIssues() {
    const issues = [];
    
    // Check for common React issues
    const reactErrors = this.errors.filter(e => 
      e.details.message && (
        e.details.message.includes('Cannot read property') ||
        e.details.message.includes('Cannot read properties') ||
        e.details.message.includes('is not a function') ||
        e.details.message.includes('undefined')
      )
    );

    if (reactErrors.length > 0) {
      issues.push({
        type: 'Null/Undefined Access',
        count: reactErrors.length,
        suggestion: 'Add null checks and default values'
      });
    }

    // Check for network errors
    const networkErrors = this.errors.filter(e => 
      e.details.message && (
        e.details.message.includes('fetch') ||
        e.details.message.includes('Network') ||
        e.details.message.includes('CORS')
      )
    );

    if (networkErrors.length > 0) {
      issues.push({
        type: 'Network Issues',
        count: networkErrors.length,
        suggestion: 'Check API endpoints and CORS configuration'
      });
    }

    return issues;
  }

  displayErrorReport() {
    if (!this.isEnabled) return;

    const summary = this.getErrorSummary();
    
    console.group('📊 Error Monitor Report');
    console.log(`Total Errors: ${summary.totalErrors}`);
    console.log(`Total Warnings: ${summary.totalWarnings}`);
    
    if (summary.totalErrors > 0) {
      console.group('🔥 Error Types');
      Object.entries(summary.errorTypes).forEach(([type, count]) => {
        console.log(`${type}: ${count}`);
      });
      console.groupEnd();
    }

    if (summary.commonIssues.length > 0) {
      console.group('💡 Common Issues');
      summary.commonIssues.forEach(issue => {
        console.log(`${issue.type} (${issue.count}): ${issue.suggestion}`);
      });
      console.groupEnd();
    }

    if (summary.recentErrors.length > 0) {
      console.group('🚨 Recent Errors');
      summary.recentErrors.forEach(error => {
        console.log(`[${error.timestamp}] ${error.type}:`, error.details);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  clearErrors() {
    this.errors = [];
    this.warnings = [];
    console.log('🧹 Error monitor cleared');
  }

  // Export errors for debugging
  exportErrors() {
    const data = {
      errors: this.errors,
      warnings: this.warnings,
      summary: this.getErrorSummary(),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradecraft-errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global error monitor instance
const errorMonitor = new ErrorMonitor();

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.errorMonitor = errorMonitor;
}

export default errorMonitor;