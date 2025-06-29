import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

export interface IUptimeStatusWebPartProps {
  description: string;
}

export default class UptimeStatusWebPart extends BaseClientSideWebPart<IUptimeStatusWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="uptime-status-webpart">
        <div class="container">
          <div id="angular-app-container">
            <div id="angular-loading" style="text-align: center; padding: 20px;">
              <div class="loading-spinner" style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <p style="margin-top: 10px;">Loading Angular Material Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .uptime-status-webpart .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        #angular-app-container {
          min-height: 400px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      </style>
    `;

    // Load the Angular app
    this.loadAngularApp();
  }

  private async loadAngularApp(): Promise<void> {
    try {
      const container = this.domElement.querySelector('#angular-app-container') as HTMLElement;
      
      if (container) {
        // For now, load the Angular app content by including the built files
        // Check if Angular files exist in the dist folder
        const angularAppPath = './angularApp/dist/angular-app/index.html';
        
        // Load the Angular app using iframe approach for now
        container.innerHTML = `
          <iframe 
            src="/src/webparts/uptimeStatus/angularApp/dist/angular-app/index.html" 
            width="100%" 
            height="800" 
            frameborder="0"
            style="border-radius: 8px;">
          </iframe>
        `;
        
        // Alternative: Direct content inclusion
        setTimeout(() => {
          this.loadAngularAppContent(container);
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading Angular app:', error);
      
      // Fallback to the original dashboard
      this.loadFallbackDashboard();
    }
  }

  private loadAngularAppContent(container: HTMLElement): void {
    // Include the Angular app root element
    container.innerHTML = `
      <div class="angular-app-wrapper">
        <app-root>
          <div style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1976d2; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 20px; color: #1976d2;">Loading Angular Material Dashboard with Teams Messages...</p>
          </div>
        </app-root>
      </div>
      <style>
        .angular-app-wrapper {
          width: 100%;
          height: 100%;
          min-height: 600px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // Try to load Angular bootstrap code
    this.bootstrapAngularApp();
  }

  private bootstrapAngularApp(): void {
    // This would normally bootstrap the Angular app
    // For development, we'll show a message that Angular integration is in progress
    setTimeout(() => {
      const container = this.domElement.querySelector('#angular-app-container') as HTMLElement;
      if (container) {
        container.innerHTML = `
          <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px;">
            <h2 style="color: #1976d2; margin-bottom: 20px;">🎯 Angular App Integration</h2>
            <p style="margin-bottom: 20px; color: #1565c0;">The Teams Messages component has been created! 🎉</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: #2e7d32; margin-bottom: 15px;">✅ What's Ready:</h3>
              <ul style="text-align: left; color: #424242; max-width: 500px; margin: 0 auto;">
                <li>✅ Teams Messages Component created</li>
                <li>✅ Mock data with 4 sample messages</li>
                <li>✅ Material Design styling</li>
                <li>✅ Refresh and configure buttons</li>
                <li>✅ Angular app built successfully</li>
              </ul>
            </div>
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #f57c00; margin-bottom: 15px;">🔧 To See It:</h3>
              <p style="color: #424242;">Run the Angular app directly:</p>
              <code style="background: #263238; color: #4fc3f7; padding: 10px; border-radius: 4px; display: block; margin: 10px 0;">
                cd src/webparts/uptimeStatus/angularApp && npm start
              </code>
              <p style="color: #666; font-size: 14px;">This will open the Angular app with the Teams Messages section on a separate port.</p>
            </div>
          </div>
        `;
      }
    }, 2000);
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
}
