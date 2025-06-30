import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export interface IUptimeStatusWebPartProps {
  description: string;
}

// Extend window interface for integration callbacks
declare global {
  interface Window {
    spfxReady?: () => void;
    integratedWorkbench?: any;
  }
}

export default class UptimeStatusWebPart extends BaseClientSideWebPart<IUptimeStatusWebPartProps> {

  public render(): void {
    // Initialize environment-specific features
    this.setupHotReload();
    
    const config = this.getEnvironmentConfig();
    console.log(`🔧 SPFx Web Part initializing in ${config.isDevelopment ? 'development' : 'production'} mode...`);
    
    // Update the existing container instead of creating a new one
    this.domElement.innerHTML = `
      <div style="width: 100%; min-height: 600px; background: #fef7ff;">
        <div style="text-align: center; padding: 40px; color: #666;">
          <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 15px;">SPFx Web Part Ready - ${config.isDevelopment ? 'Loading Angular (Dev Mode)' : 'Loading Angular'}...</p>
          ${config.enableHotReload ? '<p style="font-size: 12px; color: #1976d2; margin-top: 8px;">🔥 Hot reload enabled</p>' : ''}
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    // Signal to the integrated workbench that SPFx is ready
    setTimeout(() => {
      if (window.spfxReady) {
        console.log('🎯 Calling spfxReady callback...');
        window.spfxReady();
      } else {
        console.log('⚠️ spfxReady callback not available yet, retrying...');
        // If the workbench isn't ready yet, wait and try again
        setTimeout(() => {
          if (window.spfxReady) {
            console.log('🎯 Calling spfxReady callback (retry)...');
            window.spfxReady();
          } else {
            console.log('❌ spfxReady callback still not available');
          }
        }, 2000);
      }
    }, 500);
    
    console.log('✅ SPFx Web Part ready for Angular integration');
  }

  private async loadAngularApp(): Promise<void> {
    try {
      const container = this.domElement.querySelector('#angular-app-container') as HTMLElement;
      
      if (container) {
        // Simple, reliable iframe approach with better debugging
        container.innerHTML = `
          <div class="angular-wrapper">
            <iframe 
              id="angular-iframe"
              src="/angular-app/" 
              width="100%" 
              height="700px" 
              frameborder="0"
              style="border: none; border-radius: 8px; background: #fef7ff;"
              title="Angular Material Dashboard"
              onload="console.log('✅ Angular iframe loaded successfully');"
              onerror="console.error('❌ Angular iframe failed to load');">
            </iframe>
          </div>
          <style>
            .angular-wrapper {
              width: 100%;
              height: 700px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              background: #fef7ff;
            }
            .angular-wrapper iframe {
              display: block;
            }
          </style>
        `;
        
        // Add iframe load monitoring
        setTimeout(() => {
          const iframe = this.domElement.querySelector('#angular-iframe') as HTMLIFrameElement;
          if (iframe) {
            try {
              console.log('🔍 Iframe source:', iframe.src);
              console.log('🔍 Iframe contentWindow:', iframe.contentWindow);
              
              // Check if iframe content is accessible and loaded
              if (iframe.contentDocument || iframe.contentWindow) {
                console.log('✅ Angular iframe content is accessible');
              } else {
                console.warn('⚠️ Angular iframe content may not be loaded yet');
              }
            } catch (error) {
              console.warn('⚠️ Iframe content access restricted (this is normal for cross-origin):', error.message);
            }
          }
        }, 2000);
        
        console.log('✅ Angular app iframe loaded');
      }
    } catch (error) {
      console.error('Error loading Angular app:', error);
      this.loadFallbackDashboard();
    }
  }

  private async loadAngularAppDirect(container: HTMLElement): Promise<void> {
    try {
      // Create the exact structure Angular expects
      container.innerHTML = `
        <div id="angular-wrapper" style="width: 100%; min-height: 600px; background: #fef7ff;">
          <app-root>
            <div class="angular-loading" style="text-align: center; padding: 60px;">
              <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <p style="margin-top: 20px; color: #1976d2; font-family: 'Segoe UI', sans-serif; font-size: 16px;">Loading Angular Components...</p>
            </div>
          </app-root>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          #angular-wrapper {
            border-radius: 8px;
            overflow: hidden;
            font-family: Roboto, "Segoe UI", sans-serif;
          }
          /* Angular Material integration styles */
          #angular-wrapper .mat-toolbar {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          #angular-wrapper .mat-tab-group {
            background: transparent !important;
          }
          #angular-wrapper .content-container {
            padding: 0 !important;
          }
          #angular-wrapper .app-container {
            background: #fef7ff !important;
          }
          /* Ensure Angular Material icons work */
          #angular-wrapper .material-icons {
            font-family: 'Material Icons' !important;
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }
        </style>
      `;

      // Load Google Fonts for Material Icons (in case they're not loaded)
      if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        document.head.appendChild(iconLink);
      }

      // Load Roboto font
      if (!document.querySelector('link[href*="fonts.googleapis.com/css"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap';
        document.head.appendChild(fontLink);
      }

      // Load Angular assets dynamically
      await this.loadAngularAssets();
      
      // Wait for Angular to bootstrap
      let attempts = 0;
      const maxAttempts = 30; // 15 seconds total
      
      const checkAngularBootstrap = () => {
        attempts++;
        const appRoot = container.querySelector('app-root');
        const hasContent = appRoot && appRoot.innerHTML && !appRoot.innerHTML.includes('angular-loading');
        
        if (hasContent) {
          console.log('✅ Angular app successfully integrated into SPFx web part');
          // Hide any loading indicators
          const loadingElements = container.querySelectorAll('.angular-loading');
          loadingElements.forEach(el => el.remove());
          
          // Trigger a custom event to notify that Angular is ready
          window.dispatchEvent(new CustomEvent('angularReady', { 
            detail: { source: 'spfx-integration' } 
          }));
          
        } else if (attempts < maxAttempts) {
          console.log(`🔄 Waiting for Angular bootstrap... (${attempts}/${maxAttempts})`);
          setTimeout(checkAngularBootstrap, 500);
        } else {
          console.warn('⚠️ Angular app did not bootstrap within expected time');
          
          // Show a helpful error message but don't fail completely
          const loadingElement = container.querySelector('.angular-loading');
          if (loadingElement) {
            loadingElement.innerHTML = `
              <div style="text-align: center; padding: 40px;">
                <div style="color: #f57c00; font-size: 24px; margin-bottom: 16px;">⚠️</div>
                <h3 style="color: #f57c00; margin: 0 0 12px 0;">Angular Loading Delayed</h3>
                <p style="color: #666; font-size: 14px; margin: 0 0 16px 0;">
                  The Angular application is taking longer than expected to load.<br>
                  This might be due to network conditions or build issues.
                </p>
                <button onclick="location.reload()" style="
                  background: #1976d2; 
                  color: white; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 4px; 
                  cursor: pointer;
                  font-family: 'Segoe UI', sans-serif;
                ">Retry</button>
              </div>
            `;
          }
        }
      };
      
      setTimeout(checkAngularBootstrap, 1000);
      
    } catch (error) {
      console.error('Error loading Angular app directly:', error);
      throw error;
    }
  }

  private async loadAngularStyles(): Promise<void> {
    // Try dynamic discovery first
    try {
      const assetFiles = await this.discoverAngularFiles();
      if (assetFiles.css) {
        await this.loadStylesheet(assetFiles.css);
        return;
      }
    } catch (error) {
      console.warn('⚠️ Dynamic CSS discovery failed, using fallback:', error);
    }
    
    // Fallback to known CSS file
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/angular-app/styles.6ebe7572d8605f36.css';
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to load Angular styles'));
      document.head.appendChild(link);
    });
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private async loadFallbackDashboard(): Promise<void> {
    try {
      const container = this.domElement.querySelector('#angular-app-container') as HTMLElement;
      
      if (container) {
        // Load dashboard interface
        setTimeout(() => {
          container.innerHTML = `
            <div style="padding: 20px;">
              <h2 style="color: #1976d2; margin-bottom: 20px; font-family: 'Segoe UI', sans-serif;">🚀 Uptime Dashboard</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #1976d2; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h3 style="margin: 0 0 12px 0; color: #1565c0; font-size: 16px; font-weight: 600;">⏱️ Server Uptime</h3>
                  <p style="margin: 0; font-size: 28px; font-weight: bold; color: #0d47a1;" id="uptime-display">Loading...</p>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #1976d2; opacity: 0.8;">seconds online</p>
                </div>
                <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #4caf50; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 16px; font-weight: 600;">🕒 Current Time</h3>
                  <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1b5e20;" id="time-display">Loading...</p>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #388e3c; opacity: 0.8;">server time</p>
                </div>
              </div>
              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #ff9800; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 12px 0; color: #f57c00; font-size: 16px; font-weight: 600;">📊 System Status</h3>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 12px; height: 12px; background: #4caf50; border-radius: 50%; animation: pulse 2s infinite;"></div>
                  <span style="color: #ef6c00; font-weight: 500;">All systems operational</span>
                </div>
                <div style="margin-top: 12px; font-size: 14px; color: #f57c00; opacity: 0.8;">
                  API endpoints: <span id="api-status">Checking...</span>
                </div>
              </div>
            </div>
            <style>
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            </style>
          `;
          
          // Load data from API
          this.loadData();
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      const container = this.domElement.querySelector('#angular-app-container') as HTMLElement;
      if (container) {
        container.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #d32f2f;">
            <h3>❌ Error Loading Dashboard</h3>
            <p>Please check the console for details.</p>
            <p style="font-size: 14px; opacity: 0.7;">Error: ${error.message}</p>
          </div>
        `;
      }
    }
  }

  private async loadData(): Promise<void> {
    try {
      // Update API status
      const apiStatusElement = this.domElement.querySelector('#api-status') as HTMLElement;
      if (apiStatusElement) {
        apiStatusElement.textContent = '✅ Connected';
        apiStatusElement.style.color = '#4caf50';
      }

      // Load uptime data
      const uptimeResponse = await fetch('/api/uptime');
      if (!uptimeResponse.ok) {
        throw new Error(`HTTP ${uptimeResponse.status}`);
      }
      const uptimeData = await uptimeResponse.json();
      
      const uptimeElement = this.domElement.querySelector('#uptime-display') as HTMLElement;
      if (uptimeElement) {
        uptimeElement.textContent = uptimeData.uptime.toString();
      }

      // Load time data
      const timeResponse = await fetch('/api/time');
      if (!timeResponse.ok) {
        throw new Error(`HTTP ${timeResponse.status}`);
      }
      const timeData = await timeResponse.json();
      
      const timeElement = this.domElement.querySelector('#time-display') as HTMLElement;
      if (timeElement) {
        const date = new Date(timeData.time);
        timeElement.textContent = date.toLocaleString();
      }

      // Auto-refresh every 30 seconds
      setTimeout(() => {
        this.loadData();
      }, 30000);

    } catch (error) {
      console.error('Error loading data:', error);
      
      // Update API status
      const apiStatusElement = this.domElement.querySelector('#api-status') as HTMLElement;
      if (apiStatusElement) {
        apiStatusElement.textContent = '❌ Connection failed';
        apiStatusElement.style.color = '#f44336';
      }
      
      const uptimeElement = this.domElement.querySelector('#uptime-display') as HTMLElement;
      const timeElement = this.domElement.querySelector('#time-display') as HTMLElement;
      
      if (uptimeElement) uptimeElement.textContent = 'Error';
      if (timeElement) timeElement.textContent = 'Error loading data';

      // Retry after 10 seconds on error
      setTimeout(() => {
        this.loadData();
      }, 10000);
    }
  }

  protected dataVersion: Version = Version.parse('1.0');

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Uptime Status Configuration'
          },
          groups: [
            {
              groupName: 'Basic Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description Field'
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private async loadAngularAssets(): Promise<void> {
    try {
      console.log('🔍 Discovering Angular assets dynamically...');
      
      // First, try to get the asset manifest from Angular
      const assetFiles = await this.discoverAngularFiles();
      
      // Load CSS first
      if (assetFiles.css) {
        console.log('📄 Loading Angular CSS:', assetFiles.css);
        await this.loadStylesheet(assetFiles.css);
      }
      
      // Load JavaScript files in correct order
      const scriptLoadOrder = ['runtime', 'polyfills', 'main'];
      
      for (const scriptType of scriptLoadOrder) {
        const scriptFile = assetFiles.scripts.find(file => file.includes(scriptType));
        if (scriptFile) {
          console.log(`📄 Loading Angular ${scriptType}:`, scriptFile);
          await this.loadScript(scriptFile);
        } else {
          console.warn(`⚠️ Could not find ${scriptType} script file`);
        }
      }
      
      console.log('✅ All Angular assets loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading Angular assets dynamically, falling back to hardcoded paths:', error);
      // Fallback to hardcoded paths
      await this.loadAngularAssetsStaticFallback();
    }
  }

  private async discoverAngularFiles(): Promise<{css: string; scripts: string[]}> {
    const config = this.getEnvironmentConfig();
    const indexUrl = `${config.baseUrl}index.html`;
    
    try {
      // Try to fetch the Angular index.html to parse asset references
      const indexResponse = await fetch(indexUrl);
      if (!indexResponse.ok) {
        throw new Error(`Failed to fetch Angular index from ${indexUrl}: ${indexResponse.status}`);
      }
      
      const indexHtml = await indexResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(indexHtml, 'text/html');
      
      // Extract CSS files
      const cssLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      const cssFiles = cssLinks
        .map(link => (link as HTMLLinkElement).href)
        .filter(href => href.includes('styles.') && href.endsWith('.css'))
        .map(href => {
          // Convert to relative path if needed
          try {
            const url = new URL(href);
            return config.baseUrl + url.pathname.split('/').pop();
          } catch {
            return href.startsWith('/') ? href : `${config.baseUrl}${href}`;
          }
        });
      
      // Extract JavaScript files
      const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
      const scriptFiles = scriptTags
        .map(script => (script as HTMLScriptElement).src)
        .filter(src => src.includes('.js'))
        .map(src => {
          // Convert to relative path if needed
          try {
            const url = new URL(src);
            return config.baseUrl + url.pathname.split('/').pop();
          } catch {
            return src.startsWith('/') ? src : `${config.baseUrl}${src}`;
          }
        });
      
      const result = {
        css: cssFiles[0] || `${config.baseUrl}styles.css`, // fallback
        scripts: scriptFiles
      };
      
      console.log('🔍 Discovered Angular files:', result);
      return result;
      
    } catch (error) {
      console.warn(`⚠️ Could not parse Angular index.html from ${indexUrl}, using file system discovery:`, error);
      return await this.discoverAngularFilesFromDirectory();
    }
  }

  private async discoverAngularFilesFromDirectory(): Promise<{css: string; scripts: string[]}> {
    const config = this.getEnvironmentConfig();
    
    try {
      // Try to discover files by testing common patterns
      const baseUrl = config.baseUrl;
      
      const discoveredFiles: {css: string; scripts: string[]} = {
        css: '',
        scripts: []
      };
      
      // Test for CSS file
      const cssTestUrls = [
        `${baseUrl}styles.6ebe7572d8605f36.css`, // current known hash
        `${baseUrl}styles.css` // fallback
      ];
      
      for (const testUrl of cssTestUrls) {
        try {
          const response = await fetch(testUrl, { method: 'HEAD' });
          if (response.ok) {
            discoveredFiles.css = testUrl;
            break;
          }
        } catch (error) {
          console.warn(`Could not test CSS file ${testUrl}:`, error);
        }
      }
      
      // Test for JavaScript files
      const scriptTypes = ['runtime', 'polyfills', 'main'];
      const knownHashes = {
        runtime: '9b4bceb37d0dc2b9',
        polyfills: '80fc3bd2f7d6428c',
        main: '689f4f7577df83b7'
      };
      
      for (const scriptType of scriptTypes) {
        const testUrls = [
          `${baseUrl}${scriptType}.${knownHashes[scriptType]}.js`, // current known hash
          `${baseUrl}${scriptType}.js` // fallback
        ];
        
        for (const testUrl of testUrls) {
          try {
            const response = await fetch(testUrl, { method: 'HEAD' });
            if (response.ok) {
              discoveredFiles.scripts.push(testUrl);
              break;
            }
          } catch (error) {
            console.warn(`Could not test script file ${testUrl}:`, error);
          }
        }
      }
      
      console.log('🔍 Discovered files from directory:', discoveredFiles);
      return discoveredFiles;
      
    } catch (error) {
      console.error('❌ Directory discovery failed:', error);
      throw error;
    }
  }

  private async loadAngularAssetsStaticFallback(): Promise<void> {
    console.log('🔄 Using static fallback for Angular assets...');
    
    // Load Angular CSS
    await this.loadAngularStyles();
    
    // Load Angular JavaScript files in correct order (hardcoded as fallback)
    await this.loadScript('/angular-app/runtime.9b4bceb37d0dc2b9.js');
    await this.loadScript('/angular-app/polyfills.80fc3bd2f7d6428c.js');
    await this.loadScript('/angular-app/main.689f4f7577df83b7.js');
  }

  private async loadStylesheet(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if stylesheet is already loaded
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
      document.head.appendChild(link);
    });
  }

  private getEnvironmentConfig(): { isDevelopment: boolean; baseUrl: string; enableHotReload: boolean } {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Detect development environment
    const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1' || port === '4200';
    
    return {
      isDevelopment,
      baseUrl: isDevelopment ? '/angular-app/' : '/dist/angular-app/',
      enableHotReload: isDevelopment && port === '4200'
    };
  }

  private setupHotReload(): void {
    const config = this.getEnvironmentConfig();
    
    if (config.enableHotReload) {
      console.log('🔥 Setting up hot reload for Angular assets...');
      
      // Listen for webpack hot module replacement events
      if (typeof window !== 'undefined' && (window as any).module && (window as any).module.hot) {
        (window as any).module.hot.accept(() => {
          console.log('🔄 Hot reload triggered, refreshing Angular integration...');
          // Re-render the Angular app
          this.render();
        });
      }
      
      // Listen for file system changes (development mode)
      let lastModified = Date.now();
      const checkForUpdates = async () => {
        try {
          const response = await fetch('/angular-app/index.html', { method: 'HEAD' });
          const lastModifiedHeader = response.headers.get('last-modified');
          if (lastModifiedHeader) {
            const serverLastModified = new Date(lastModifiedHeader).getTime();
            if (serverLastModified > lastModified) {
              console.log('🔄 Angular files updated, reloading...');
              lastModified = serverLastModified;
              // Small delay to ensure files are fully written
              setTimeout(() => this.render(), 1000);
            }
          }
        } catch (error) {
          // Silently handle errors in development
        }
      };
      
      // Check for updates every 5 seconds in development
      setInterval(checkForUpdates, 5000);
    }
  }
}

// Development workbench initialization
// This code runs when the bundle is loaded in the development environment
if (typeof window !== 'undefined' && document.getElementById('uptime-status-webpart')) {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Initializing SPFx Web Part...');
    
    const containerElement = document.getElementById('uptime-status-webpart');
    if (containerElement) {
      try {
        // Create a mock SPFx context for development
        const mockContext = {
          domElement: containerElement,
          properties: { description: 'Development Instance' },
          instanceId: 'dev-instance',
          serviceScope: null
        } as any;
        
        // Create and initialize the web part using proper ES6 class instantiation
        const webPart = new UptimeStatusWebPart();
        
        // Set up the web part with mock context
        (webPart as any).context = mockContext;
        (webPart as any).properties = mockContext.properties;
        (webPart as any).domElement = containerElement;
        
        // Render the web part
        webPart.render();
        console.log('✅ SPFx Web Part initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing web part:', error);
        
        // Show error in the container
        containerElement.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #d32f2f; border: 1px solid #ffcdd2; border-radius: 8px; background: #ffebee;">
            <h3>❌ Web Part Initialization Error</h3>
            <p>Check the browser console for details.</p>
            <pre style="text-align: left; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">${error.message}</pre>
          </div>
        `;
      }
    }
  });
}
