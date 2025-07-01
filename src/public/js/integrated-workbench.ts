// Make sure this interface declaration is at the top of the file, outside any classes or functions
declare global {
  interface Window {
    DirectAngularIntegration?: any;
    spfxReady?: () => void;
    angularInitialized?: boolean;
    workbenchConfig?: {
      apiBaseUrl: string;
      useProxy: boolean;
      proxyPrefix: string;
      debug: boolean;
    };
    refreshPerformanceWebPart?: (useProxy?: boolean) => void;
    forceShowMockData?: () => void; // Add this new global function
  }
}

class WorkbenchIntegration {
  constructor() {
    this.initWorkbench();
    console.log('🔧 Initializing integrated workbench...');
  }

  initWorkbench() {
    document.addEventListener('DOMContentLoaded', () => {
      // Setup global objects for integration
      this.setupIntegrationObjects();
      
      // Try both integration approaches
      this.setupIframeIntegration();
      this.waitForDirectAngularIntegration(20); // 20 attempts * 500ms = 10 seconds
      
      // Check API status
      this.checkApiStatus();
      
      console.log('✅ Integrated workbench initialized');
    });
  }

  setupIntegrationObjects() {
    // Setup global callbacks for SPFx web part
    window.spfxReady = () => {
      console.log('✅ SPFx Web Part is ready');
      this.updateStatus('angular-status', '🔄 SPFx Ready, waiting for Angular...', '#ff9800');
    };
    
    // Setup Direct Angular Integration object
    window.DirectAngularIntegration = {
      ready: () => {
        console.log('✅ Angular signals it is ready');
        this.completeIntegration();
      },
      error: (err) => {
        console.error('❌ Angular integration error:', err);
        this.updateStatus('angular-status', '❌ Error', '#f44336');
      }
    };
    
    // Setup Performance WebPart refresh handler
    window.refreshPerformanceWebPart = (useProxy = false) => {
      console.log(`🔄 Manually refreshing performance web part (useProxy: ${useProxy})`);
      // Force re-rendering of the performance web part
      const performanceWebPart = document.getElementById('performance-metrics-webpart');
      if (performanceWebPart) {
        // First, try to refresh via event
        const event = new CustomEvent('refreshWebPart', { 
          detail: { id: 'performance-metrics', useProxy } 
        });
        performanceWebPart.dispatchEvent(event);
        
        // If API is unavailable, use mock data as fallback
        setTimeout(() => {
          const placeholder = document.getElementById('performance-loading-placeholder');
          if (placeholder && !placeholder.classList.contains('hidden')) {
            this.createMockPerformanceWebpart(true); // Force mock data
          }
        }, 2000);
      }
    };
    
    // Add global function to force mock data display
    window.forceShowMockData = () => {
      this.createMockPerformanceWebpart(true);
    };
    
    console.log('✅ Direct Angular Integration is set up and awaiting Angular initialization');
  }
  
  setupIframeIntegration() {
    const iframe = document.getElementById('angular-iframe') as HTMLIFrameElement;
    if (!iframe) return;
    
    // Handle iframe load event
    iframe.onload = () => {
      console.log('✅ Angular iframe loaded');
      this.updateStatus('angular-status', '✅ Loaded (iframe)', '#4caf50');
      
      // Try to setup messaging with the iframe
      try {
        // Setup message passing between SPFx and Angular iframe
        window.addEventListener('message', (event) => {
          // Only accept messages from our Angular application
          if (event.origin !== 'http://localhost:4200') return;
          
          if (event.data.type === 'ANGULAR_READY') {
            console.log('📣 Angular iframe signals ready via postMessage');
            // Handle Angular ready message
          }
        });
        
        // Send a message to the Angular app
        iframe.contentWindow?.postMessage({ type: 'SPFX_READY' }, 'http://localhost:4200');
      } catch (err) {
        console.warn('⚠️ Cross-origin restrictions prevented communication with Angular iframe', err);
      }
    };
  }

  waitForDirectAngularIntegration(attemptsLeft: number) {
    if (attemptsLeft <= 0) {
      console.log('⚠️ Direct Angular integration did not complete - using iframe instead');
      return;
    }

    // Check for Angular component
    const angularRoot = document.querySelector('app-root');
    const directIntegrationWorking = angularRoot && 
                                    angularRoot.childElementCount > 0 && 
                                    window['angularInitialized'] === true;
    
    if (directIntegrationWorking) {
      console.log('✅ Angular direct integration successful');
      this.completeIntegration();
      
      // Hide iframe since direct integration is working
      const iframe = document.getElementById('angular-iframe');
      if (iframe) (iframe as HTMLIFrameElement).style.display = 'none';
      
      // Show app-root with proper type assertion
      const angularElement = angularRoot;
      if (angularElement) {
        (angularElement as HTMLElement).style.display = 'block';
      }
    } else {
      // Try again in 500ms
      setTimeout(() => this.waitForDirectAngularIntegration(attemptsLeft - 1), 500);
    }
  }
  
  completeIntegration() {
    console.log('🎉 Integration complete - both SPFx and Angular are ready');
    this.updateStatus('angular-status', '✅ Ready', '#4caf50');
  }

  async checkApiStatus() {
    try {
      // Try multiple endpoints to find a working API
      const endpoints = [
        // Direct Angular app root
        { url: 'http://localhost:4200', label: 'Angular App' },
        // Direct API endpoint
        { url: 'http://localhost:4200/api/status', label: 'API (direct)' },
        // SPFx proxied endpoint
        { url: '/api/status', label: 'API (proxied)' },
        // Alternative API endpoint that might exist
        { url: 'http://localhost:4200/api/health', label: 'Health API' }
      ];
      
      let apiAvailable = false;
      
      // Try each endpoint
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            // Only use CORS for cross-origin requests
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
      
      // All endpoints failed - immediately show mock data
      if (!apiAvailable) {
        this.updateStatus('api-status', '❌ Not Available', '#f44336');
        console.log('API unavailable - showing mock data immediately');
        
        // Use direct DOM manipulation for better reliability
        setTimeout(() => {
          this.createMockPerformanceData();
        }, 500);
      }
      
      return apiAvailable;
    } catch (error) {
      console.error('API check failed:', error);
      this.updateStatus('api-status', '❌ Not Available', '#f44336');
      // Also create mock data on error
      this.createMockPerformanceWebpart(true);
      return false;
    }
  }
  
  createMockPerformanceWebpart(force = false) {
    // Call the direct method instead
    this.createMockPerformanceData();
  }
  
  createMockPerformanceData() {
    console.log('Creating immediate mock performance data directly');
    
    // Direct DOM manipulation - most reliable approach
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
            <em>Sample data shown - created by TypeScript at ${new Date().toLocaleTimeString()}</em>
          </div>
        </div>
      </div>
    `;
    
    console.log('✅ Mock performance data created directly in DOM');
  }
  
  updateStatus(elementId: string, message: string, color: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.color = color;
    }
  }

  // Direct method to create and show mock data in the performance panel
  createMockPerformanceData() {
    console.log('Creating immediate mock performance data');
    
    const performanceWebPart = document.getElementById('performance-metrics-webpart');
    if (!performanceWebPart) {
      console.error('Performance webpart container not found');
      return;
    }
    
    // Create mock content directly
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
          <button onclick="window.refreshPerformanceWebPart && window.refreshPerformanceWebPart(true)" 
                  style="padding: 8px 16px; background: #0078d4; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Retry API Connection
          </button>
        </div>
      </div>
    `;
    
    console.log('✅ Inline mock data created successfully');
  }
}

// Initialize the workbench
const workbench = new WorkbenchIntegration();

// Make mock data available globally for immediate access
window.forceShowMockData = () => {
  console.log('🔄 Global call to force show mock data');
  if (workbench) {
    try {
      // Use the simpler direct approach
      workbench.createMockPerformanceData();
    } catch (e) {
      console.error('Error showing mock data:', e);
      
      // Fallback to direct DOM manipulation if the workbench method fails
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

console.log('🚀 Integrated workbench script loaded');

// Ensure TypeScript knows we're modifying the global scope
export {};
    }
  }
};

console.log('🚀 Integrated workbench script loaded');

// Ensure TypeScript knows we're modifying the global scope
export {};
