export const environment = {
  production: false,
  apiBaseUrl: '',  // Use empty string to leverage webpack dev server proxy
  endpoints: {
    lists: '/api/list',
    metrics: '/api/metrics',
    uptime: '/api/uptime'
  }
};

