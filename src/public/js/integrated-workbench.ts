// Integrated Workbench TypeScript Configuration and Utilities
declare global {
  interface Window {
    workbenchConfig: WorkbenchConfig;
    testApiEndpoints: () => Promise<boolean>;
    loadDataFromEndpoint: (endpoint: ApiEndpoint) => void;
    formatEndpointData: (endpoint: string, data: any) => string;
    showEndpoints: () => void;
    showEndpointTests: () => void;
    refreshApiStatus: () => void;
    realDataAvailable: boolean;
    endpointTestResults: any[];
    forceShowMockData: () => void;
  }
}

// API Configuration Interfaces
interface ApiEndpoint {
  url: string;
  mode: 'proxy' | 'direct' | 'direct-nest';
  endpoint: string;
}

interface WorkbenchConfig {
  apiBaseUrl: string;
  useProxy: boolean;
  proxyPrefix: string;
  debug: boolean;
  apiEndpoints: string[];
  availableEndpoints: ApiEndpoint[];
  activeEndpoint?: string;
}

// WorkbenchIntegration class
class WorkbenchIntegration {
  constructor() {
    this.initialize();
  }

  private initialize(): void {
    console.log('🔧 Initializing integrated workbench...');
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }

  private start(): void {
    console.log('🚀 Starting workbench integration...');
    
    // Initialize configuration
    this.initializeWorkbench();
    // Check API status
    this.checkApiStatus();
    
    // Setup Angular integration
    this.setupDirectAngularIntegration();
    
    console.log('✅ Integrated workbench initialized');
  }

  private initializeWorkbench(): void {
    console.log('🔧 Initializing integrated workbench TypeScript utilities...');
    
    // Ensure global configuration exists
    if (typeof window !== 'undefined' && !window.workbenchConfig) {
      window.workbenchConfig = {
        apiBaseUrl: 'http://localhost:4200',
        useProxy: true,
        proxyPrefix: '/api',
        debug: true,
        apiEndpoints: [
          '/api/uptime',
          '/api/time',
          '/api/reports/system-health',
          '/api/reports/safe-metrics',
          '/api/reports/all',
          '/api/lists/metrics',
          '/api/lists',
          '/api/lists/activity'
        ],
        availableEndpoints: []
      };
    }
    
    console.log('✅ Integrated workbench TypeScript utilities initialized');
  }

  private async checkApiStatus(): Promise<boolean> {
    try {
      // Try multiple endpoints to find a working API
      const endpoints = [
        { url: 'http://localhost:4200', label: 'Angular App' },
        { url: 'http://localhost:4200/api/status', label: 'API (direct)' },
        { url: '/api/status', label: 'API (proxied)' },
        { url: 'http://localhost:4200/api/health', label: 'Health API' }
      ];
      
      let apiAvailable = false;
      
      // Try each endpoint
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            ...(endpoint.url.includes('http') ? { mode: 'cors' } : {})
          });
          
          if (response.ok) {
            this.updateStatus('api-status', `✅ Connected (${endpoint.label})`, '#4caf50');
            apiAvailable = true;
            break;
          }
        } catch (e) {
          console.log(`Failed to connect to ${endpoint.url}`);
        }
      }
      
      // All endpoints failed - show mock data
      if (!apiAvailable) {
        this.updateStatus('api-status', '❌ Not Available', '#f44336');
        console.log('API unavailable - showing mock data');
        
        setTimeout(() => {
          this.createMockPerformanceData();
        }, 500);
      }
      
      return apiAvailable;
    } catch (error) {
      console.error('API check failed:', error);
      this.updateStatus('api-status', '❌ Not Available', '#f44336');
      this.createMockPerformanceData();
      return false;
    }
  }

  public createMockPerformanceData(): void {
    console.log('Creating mock performance data');
    
    const performanceWebPart = document.getElementById('performance-metrics-webpart');
    const performancePlaceholder = document.getElementById('performance-loading-placeholder');
    
    if (!performanceWebPart) {
      console.error('Performance webpart container not found');
      return;
    }
    
    // Hide the loading placeholder if it exists
    if (performancePlaceholder) {
      performancePlaceholder.classList.add('hidden');
    }
    
    // Create mock content directly with inline styles
    performanceWebPart.innerHTML = `
      <div id="mock-performance-data" style="display: block; width: 100%;">
        <div style="padding: 20px; text-align: center;">
          <h3 style="margin-bottom: 15px; font-weight: 500; color: #333;">Performance Metrics (Sample Data)</h3>
          <div style="display: flex; justify-content: space-around; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; min-width: 100px; flex: 1;">
              <h4 style="font-size: 24px; margin-bottom: 5px; color: #1976d2;">92%</h4>
              <p style="margin: 0; color: #555;">Overall Score</p>
            </div>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; min-width: 100px; flex: 1;">
              <h4 style="font-size: 24px; margin-bottom: 5px; color: #388e3c;">64</h4>
              <p style="margin: 0; color: #555;">Issues Resolved</p>
            </div>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; min-width: 100px; flex: 1;">
              <h4 style="font-size: 24px; margin-bottom: 5px; color: #f57c00;">8.3</h4>
              <p style="margin: 0; color: #555;">Avg Days/Task</p>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; color: #666; margin-bottom: 15px;">
            <em>Sample data shown - API connection unavailable</em>
          </div>
        </div>
      </div>
    `;
    
    console.log('✅ Mock performance data created');
  }

  private updateStatus(elementId: string, message: string, color: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.color = color;
    }
  }

  private setupDirectAngularIntegration(): void {
    console.log('✅ Direct Angular Integration is set up and awaiting Angular initialization');
    
    if (typeof window === 'undefined') return;
    
    // Setup communication bridge between Angular and SPFx
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:4200') return;
      
      console.log('📨 Message received from Angular:', event.data);
      
      // Handle different message types
      switch (event.data.type) {
        case 'angular-ready':
          console.log('✅ Angular application is ready');
          break;
        case 'angular-data':
          console.log('📊 Data received from Angular:', event.data.payload);
          break;
        default:
          console.log('🔄 Unknown message type:', event.data.type);
      }
    });
  }

  private handleError(error: any): void {
    // Robust error logging
    console.error('[integrated-workbench] Script error:', error);

    // Optionally update the UI to show an error message
    const apiStatus = document.getElementById('api-status');
    if (apiStatus) {
      apiStatus.textContent = '❌ Script Error';
      apiStatus.style.color = '#f44336';
    }

    // Optionally: rethrow if you want to break execution, or just return to swallow the error
    // throw error;
    // For now, just log and return
  }
}

// SPFx Ready Callback
export function spfxReady(): void {
  console.log('✅ SPFx Web Part is ready');
  
  // Initialize any SPFx-specific functionality here
  if (typeof window !== 'undefined' && window.workbenchConfig) {
    console.log('🔗 SPFx integration ready with config:', window.workbenchConfig);
  }
}


// Initialize the workbench
const workbench = new WorkbenchIntegration();

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).spfxReady = spfxReady;
  
  // Make mock data available globally for immediate access
  window.forceShowMockData = () => {
    console.log('🔄 Global call to force show mock data');
    if (workbench) {
      try {
        workbench.createMockPerformanceData();
      } catch (e) {
        console.error('Error showing mock data:', e);
        
        // Fallback to direct DOM manipulation
        const performancePlaceholder = document.getElementById('performance-loading-placeholder');
        const performanceWebPart = document.getElementById('performance-metrics-webpart');
        
        if (performancePlaceholder) performancePlaceholder.classList.add('hidden');
        
        if (performanceWebPart) {
          performanceWebPart.innerHTML = `
            <div style="padding: 20px; text-align: center;">
              <h3>Performance Metrics (Fallback Data)</h3>
              <p>Sample performance data is displayed as a fallback.</p>
            </div>
          `;
        }
      }
    }
  };
}

console.log('🚀 Integrated workbench script loaded');
console.log('[integrated-workbench.ts] Compiled and loaded!');