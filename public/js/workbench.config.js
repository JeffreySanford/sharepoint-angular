/**
 * Configuration constants for the SPFx Development Workbench
 */

window.WorkbenchConfig = {
  // Refresh intervals (in milliseconds)
  DATA_REFRESH_INTERVAL: 30000, // 30 seconds
  ERROR_RETRY_INTERVAL: 10000,  // 10 seconds
  LOADING_DELAY: 1000,          // 1 second

  // API endpoints
  API_ENDPOINTS: {
    UPTIME: '/api/uptime',
    TIME: '/api/time'
  },

  // UI constants
  UI: {
    BUNDLE_PATH: '/bundle.js',
    LOADING_TEXT: 'Loading Angular Material Dashboard...',
    ERROR_MESSAGES: {
      BUNDLE_LOAD: 'Could not load the webpack bundle. Please check if the development server is running.',
      INITIALIZATION: 'Error initializing web part',
      DASHBOARD_LOAD: 'Error Loading Dashboard',
      DATA_LOAD: 'Error loading data'
    }
  },

  // Status indicators
  STATUS: {
    CONNECTED: '✅ Connected',
    FAILED: '❌ Connection failed',
    CHECKING: 'Checking...',
    ERROR: 'Error',
    OPERATIONAL: 'All systems operational'
  },

  // Colors
  COLORS: {
    SUCCESS: '#4caf50',
    ERROR: '#f44336',
    WARNING: '#ff9800',
    INFO: '#1976d2'
  }
};
