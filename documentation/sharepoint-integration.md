<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-SHAREPOINT%20INTEGRATION-blue?style=for-the-badge&labelColor=red&color=blue" alt="SHAREPOINT INTEGRATION" />
</div>

# 🏢 <span style="color:#DC143C">SharePoint</span> <span style="color:#FFFFFF">Integration</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

The platform is deployed as a **<span style="color:#FF6B35">SharePoint Framework (SPFx) web part</span>**, ensuring <span style="color:#32CD32">**seamless**</span>, <span style="color:#1E90FF">**secure**</span>, and <span style="color:#FF1493">**vibrant integration**</span> with SharePoint Online and on-premises.

## 🎨 <span style="color:#FFD700">Patriotic SharePoint Features</span>

- 🎨 <span style="color:#DC143C">**Red, white, and blue branding**</span>
- 🚀 <span style="color:#0000FF">**Modern workbench with integrated Angular**</span>
- 🛡️ <span style="color:#32CD32">**Secure, enterprise-grade deployment**</span>

# SharePoint Framework Integration Guide

## Overview

This comprehensive guide details the SharePoint Framework (SPFx) integration patterns, web part development, SharePoint services integration, and deployment strategies for the enterprise Angular + NestJS platform within Microsoft 365 environments.

## SPFx Web Part Architecture

### Web Part Structure

The SPFx web part serves as the bridge between SharePoint and the Angular application, providing authentication, context sharing, and seamless integration with SharePoint services.

```
src/webparts/uptimeStatus/
├── UptimeStatusWebPart.ts               # Main web part class
├── UptimeStatusWebPart.manifest.json   # Web part metadata and configuration
├── UptimeStatusWebPart.module.scss     # Web part-specific styles
├── loc/                                 # Localization resources
│   ├── en-us.js                        # English resources
│   └── mystrings.d.ts                  # TypeScript definitions
└── angularApp/                         # Angular application
```

### Web Part Implementation

#### Main Web Part Class (UptimeStatusWebPart.ts)

```typescript
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
  PropertyPaneToggle,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './UptimeStatusWebPart.module.scss';
import * as strings from 'UptimeStatusWebPartStrings';

export interface IUptimeStatusWebPartProps {
  title: string;
  description: string;
  apiBaseUrl: string;
  refreshInterval: number;
  enableTeamsIntegration: boolean;
  displayMode: 'compact' | 'full' | 'dashboard';
  theme: 'light' | 'dark' | 'auto';
  enableNotifications: boolean;
  maxItems: number;
}

export default class UptimeStatusWebPart extends BaseClientSideWebPart<IUptimeStatusWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _angularAppLoaded: boolean = false;

  public render(): void {
    // Create the main container
    const container = document.createElement('div');
    container.id = `uptime-status-${this.instanceId}`;
    container.className = styles.uptimeStatus;
    
    // Apply theme classes
    if (this._isDarkTheme) {
      container.classList.add(styles.dark);
    }
    
    // Set up Angular application container
    const angularContainer = document.createElement('div');
    angularContainer.id = `angular-app-${this.instanceId}`;
    angularContainer.className = styles.angularContainer;
    
    // Add loading indicator
    const loadingIndicator = this._createLoadingIndicator();
    angularContainer.appendChild(loadingIndicator);
    
    container.appendChild(angularContainer);
    
    // Clear and append to DOM element
    this.domElement.innerHTML = '';
    this.domElement.appendChild(container);
    
    // Initialize Angular application
    this._initializeAngularApp(angularContainer);
  }

  private _createLoadingIndicator(): HTMLElement {
    const loading = document.createElement('div');
    loading.className = styles.loadingContainer;
    loading.innerHTML = `
      <div class="${styles.spinner}">
        <div class="${styles.spinnerCircle}"></div>
      </div>
      <div class="${styles.loadingText}">
        Loading Dashboard...
      </div>
    `;
    return loading;
  }

  private _initializeAngularApp(container: HTMLElement): void {
    // Share SharePoint context with Angular application
    this._shareContextWithAngular();
    
    // Signal to Angular that the container is ready
    this._signalAngularReady(container.id);
    
    // Set up resize observer for responsive behavior
    this._setupResizeObserver(container);
    
    // Apply web part properties to Angular
    this._applyPropertiesToAngular();
  }

  private _shareContextWithAngular(): void {
    // Create comprehensive SharePoint context object
    const spfxContext = {
      // Page context
      pageContext: {
        web: {
          absoluteUrl: this.context.pageContext.web.absoluteUrl,
          serverRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
          id: this.context.pageContext.web.id,
          title: this.context.pageContext.web.title,
          templateName: this.context.pageContext.web.templateName,
          language: this.context.pageContext.web.language,
          isMultilingual: this.context.pageContext.web.isMultilingual,
          currentUICultureName: this.context.pageContext.web.currentUICultureName
        },
        site: {
          absoluteUrl: this.context.pageContext.site.absoluteUrl,
          serverRelativeUrl: this.context.pageContext.site.serverRelativeUrl,
          id: this.context.pageContext.site.id,
          classification: this.context.pageContext.site.classification
        },
        user: {
          displayName: this.context.pageContext.user.displayName,
          email: this.context.pageContext.user.email,
          loginName: this.context.pageContext.user.loginName,
          isAnonymousGuestUser: this.context.pageContext.user.isAnonymousGuestUser,
          isExternalGuestUser: this.context.pageContext.user.isExternalGuestUser,
          preferUserTimeZone: this.context.pageContext.user.preferUserTimeZone
        },
        list: this.context.pageContext.list ? {
          id: this.context.pageContext.list.id,
          title: this.context.pageContext.list.title,
          serverRelativeUrl: this.context.pageContext.list.serverRelativeUrl
        } : null,
        listItem: this.context.pageContext.listItem ? {
          id: this.context.pageContext.listItem.id
        } : null
      },
      
      // Service context
      serviceScope: this.context.serviceScope,
      
      // HTTP clients
      spHttpClient: this.context.spHttpClient,
      httpClient: this.context.httpClient,
      
      // Microsoft Graph client (if available)
      msGraphClientFactory: this.context.msGraphClientFactory,
      
      // Microsoft Teams context (if available)
      microsoftTeams: this.context.sdks?.microsoftTeams ? {
        context: this.context.sdks.microsoftTeams.context,
        teamsJs: this.context.sdks.microsoftTeams.teamsJs
      } : null,
      
      // Theme information
      theme: {
        isInverted: this._isDarkTheme,
        palette: this.context.microsoftTeams?.context?.theme || {},
        semanticColors: {}
      },
      
      // Web part properties
      properties: this.properties,
      
      // Environment information
      environment: {
        type: this.context.pageContext.site.absoluteUrl.includes('sharepoint.com') ? 'SharePointOnline' : 'SharePointOnPremises',
        version: Version.parse('1.18.2').toString()
      },
      
      // Capabilities
      capabilities: {
        canManageWeb: true, // This would be determined by actual permissions
        canManageList: true,
        canAddListItems: true,
        canEditListItems: true,
        canDeleteListItems: true
      }
    };
    
    // Make context available globally for Angular
    (window as any)['spfxContext'] = spfxContext;
    
    // Dispatch custom event to notify Angular
    const contextEvent = new CustomEvent('spfxContextReady', {
      detail: spfxContext
    });
    window.dispatchEvent(contextEvent);
  }

  private _signalAngularReady(containerId: string): void {
    // Signal that the web part container is ready for Angular
    const readyEvent = new CustomEvent('spfxWebPartReady', {
      detail: {
        containerId: containerId,
        instanceId: this.instanceId,
        properties: this.properties,
        domElement: this.domElement
      }
    });
    window.dispatchEvent(readyEvent);
  }

  private _setupResizeObserver(container: HTMLElement): void {
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          
          // Dispatch resize event for Angular to handle responsive behavior
          const resizeEvent = new CustomEvent('spfxWebPartResize', {
            detail: {
              instanceId: this.instanceId,
              width: width,
              height: height,
              breakpoint: this._getBreakpoint(width)
            }
          });
          window.dispatchEvent(resizeEvent);
        }
      });
      
      resizeObserver.observe(container);
    }
  }

  private _getBreakpoint(width: number): string {
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
  }

  private _applyPropertiesToAngular(): void {
    // Make web part properties available to Angular
    const propertiesEvent = new CustomEvent('spfxPropertiesChanged', {
      detail: {
        instanceId: this.instanceId,
        properties: this.properties
      }
    });
    window.dispatchEvent(propertiesEvent);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // Running in Microsoft Teams, get Teams context
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office':
              environmentMessage = this.context.isServedFromLocalhost ? 
                strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook':
              environmentMessage = this.context.isServedFromLocalhost ? 
                strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams':
              environmentMessage = this.context.isServedFromLocalhost ? 
                strings.AppLocalEnvironmentTeams : strings.AppTeamsEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }
          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? 
      strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    
    // Update CSS custom properties for dynamic theming
    const { semanticColors } = currentTheme;
    
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
      this.domElement.style.setProperty('--link', semanticColors.link || '');
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
      this.domElement.style.setProperty('--bodyBackground', semanticColors.bodyBackground || '');
      this.domElement.style.setProperty('--neutralLight', semanticColors.neutralLight || '');
      this.domElement.style.setProperty('--neutralLighter', semanticColors.neutralLighter || '');
      this.domElement.style.setProperty('--neutralDark', semanticColors.neutralDark || '');
      this.domElement.style.setProperty('--neutralPrimary', semanticColors.neutralPrimary || '');
    }

    // Notify Angular of theme changes
    const themeEvent = new CustomEvent('spfxThemeChanged', {
      detail: {
        instanceId: this.instanceId,
        theme: currentTheme,
        isDarkTheme: this._isDarkTheme
      }
    });
    window.dispatchEvent(themeEvent);
  }

  protected onDispose(): void {
    // Clean up Angular application
    const disposeEvent = new CustomEvent('spfxWebPartDispose', {
      detail: {
        instanceId: this.instanceId
      }
    });
    window.dispatchEvent(disposeEvent);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    // Update Angular application when properties change
    this._applyPropertiesToAngular();
    
    // Handle specific property changes
    switch (propertyPath) {
      case 'apiBaseUrl':
        this._validateApiUrl(newValue);
        break;
      case 'refreshInterval':
        this._validateRefreshInterval(newValue);
        break;
      case 'enableTeamsIntegration':
        this._handleTeamsIntegrationToggle(newValue);
        break;
    }
  }

  private _validateApiUrl(url: string): void {
    if (url && !this._isValidUrl(url)) {
      // Could show validation message in property pane
      console.warn('Invalid API URL provided:', url);
    }
  }

  private _isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  private _validateRefreshInterval(interval: number): void {
    if (interval < 30) {
      console.warn('Refresh interval should not be less than 30 seconds');
    }
  }

  private _handleTeamsIntegrationToggle(enabled: boolean): void {
    if (enabled && !this.context.sdks.microsoftTeams) {
      console.warn('Teams integration enabled but not running in Teams context');
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  description: 'Enter the title for your dashboard',
                  placeholder: 'e.g., Team Dashboard'
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  description: 'Enter a description for your dashboard',
                  multiline: true,
                  rows: 3
                }),
                PropertyPaneChoiceGroup('displayMode', {
                  label: 'Display Mode',
                  options: [
                    { key: 'compact', text: 'Compact View' },
                    { key: 'full', text: 'Full Dashboard' },
                    { key: 'dashboard', text: 'Executive Dashboard' }
                  ]
                })
              ]
            },
            {
              groupName: 'API Configuration',
              groupFields: [
                PropertyPaneTextField('apiBaseUrl', {
                  label: 'API Base URL',
                  description: 'Enter the base URL for the NestJS API server',
                  placeholder: 'https://api.yourdomain.com'
                }),
                PropertyPaneSlider('refreshInterval', {
                  label: 'Refresh Interval (seconds)',
                  min: 30,
                  max: 3600,
                  step: 30,
                  showValue: true
                })
              ]
            },
            {
              groupName: 'Teams Integration',
              groupFields: [
                PropertyPaneToggle('enableTeamsIntegration', {
                  label: 'Enable Teams Integration',
                  onText: 'Enabled',
                  offText: 'Disabled'
                }),
                PropertyPaneToggle('enableNotifications', {
                  label: 'Enable Notifications',
                  onText: 'On',
                  offText: 'Off'
                })
              ]
            },
            {
              groupName: 'Appearance',
              groupFields: [
                PropertyPaneChoiceGroup('theme', {
                  label: 'Theme',
                  options: [
                    { key: 'light', text: 'Light Theme' },
                    { key: 'dark', text: 'Dark Theme' },
                    { key: 'auto', text: 'Auto (Follow SharePoint)' }
                  ]
                }),
                PropertyPaneSlider('maxItems', {
                  label: 'Maximum Items to Display',
                  min: 5,
                  max: 100,
                  step: 5,
                  showValue: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
```

### Web Part Manifest Configuration

#### UptimeStatusWebPart.manifest.json

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
  "id": "2edadf90-7f29-4737-954a-9a0d03e12446",
  "alias": "UptimeStatusWebPart",
  "componentType": "WebPart",
  
  "version": "*",
  "manifestVersion": 2,
  
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart", "TeamsPersonalApp", "TeamsTab", "SharePointFullPage"],
  
  "supportsThemeVariants": true,
  
  "preconfiguredEntries": [{
    "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
    "group": { 
      "default": "Advanced" 
    },
    "title": { 
      "default": "SAFe Metrics Dashboard" 
    },
    "description": { 
      "default": "Enterprise SAFe metrics and infrastructure monitoring dashboard with Angular 15 and Material Design 3" 
    },
    "officeFabricIconFontName": "BarChartVertical",
    "properties": {
      "title": "SAFe Metrics Dashboard",
      "description": "Real-time SAFe metrics and system monitoring",
      "apiBaseUrl": "http://localhost:3000",
      "refreshInterval": 300,
      "enableTeamsIntegration": true,
      "displayMode": "full",
      "theme": "auto",
      "enableNotifications": true,
      "maxItems": 50
    }
  }],
  
  "permissions": {
    "scopes": [
      {
        "resource": "Microsoft Graph",
        "scope": "User.Read"
      },
      {
        "resource": "Microsoft Graph", 
        "scope": "ChannelMessage.Send"
      },
      {
        "resource": "SharePoint",
        "scope": "AllSites.Read"
      }
    ]
  },
  
  "validDomains": [
    "*.sharepoint.com",
    "*.microsoftonline.com",
    "*.office.com",
    "localhost",
    "*.yourdomain.com"
  ],
  
  "webApiPermissionRequests": [
    {
      "resource": "Microsoft Graph",
      "scope": "User.Read"
    },
    {
      "resource": "Microsoft Graph",
      "scope": "ChannelMessage.Send"
    }
  ]
}
```

## 🚀 <span style="color:#FF4500">Deployment Steps - Victory Protocol</span>

1. 📦 **<span style="color:#DC143C">Package SPFx solution (`.sppkg`)</span>**
2. 🌐 **<span style="color:#0000FF">Deploy to SharePoint App Catalog</span>**
3. ➕ **<span style="color:#32CD32">Add web part to site</span>**
4. ⚡ **<span style="color:#FF6B35">Angular loads directly in web part</span>**

### 🎯 <span style="color:#9932CC">SharePoint Manifest - Freedom Configuration</span>

```json
{
  "id": "victory-uptime-webpart",
  "alias": "UptimeStatusWebPart",
  "componentType": "WebPart",
  "version": "🇺🇸.0.0.1",
  "manifestVersion": 2,
  "preconfiguredEntries": [{
    "groupId": "🦅 FREEDOM TOOLS 🦅",
    "group": { "default": "American Excellence" },
    "title": { "default": "🇺🇸 Uptime Status Dashboard 🇺🇸" }
  }]
}
```

## SharePoint Services Integration

### List and Library Integration

#### SharePoint List Service

```typescript
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SharePointListItem {
  Id: number;
  Title: string;
  Created: string;
  Modified: string;
  Author: {
    Title: string;
    Email: string;
  };
  Editor: {
    Title: string;
    Email: string;
  };
}

export interface SharePointList {
  Id: string;
  Title: string;
  Description: string;
  ItemCount: number;
  Created: string;
  LastItemModifiedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharePointListService {
  private spHttpClient: SPHttpClient;
  private webAbsoluteUrl: string;

  constructor() {
    // Initialize from global context
    const context = (window as any)['spfxContext'];
    if (context) {
      this.spHttpClient = context.spHttpClient;
      this.webAbsoluteUrl = context.pageContext.web.absoluteUrl;
    }
  }

  // Get all lists in the current web
  public getLists(): Observable<SharePointList[]> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists?$filter=Hidden eq false&$select=Id,Title,Description,ItemCount,Created,LastItemModifiedDate`;
    
    return from(
      this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => response.json())
    ).pipe(
      map(data => data.value),
      catchError(this.handleError)
    );
  }

  // Get list items with paging and filtering
  public getListItems(
    listTitle: string, 
    select?: string[], 
    filter?: string, 
    orderBy?: string,
    top?: number,
    skip?: number
  ): Observable<SharePointListItem[]> {
    let endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items`;
    
    const queryParams: string[] = [];
    
    if (select && select.length > 0) {
      queryParams.push(`$select=${select.join(',')}`);
    }
    
    if (filter) {
      queryParams.push(`$filter=${filter}`);
    }
    
    if (orderBy) {
      queryParams.push(`$orderby=${orderBy}`);
    }
    
    if (top) {
      queryParams.push(`$top=${top}`);
    }
    
    if (skip) {
      queryParams.push(`$skip=${skip}`);
    }
    
    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }
    
    return from(
      this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => response.json())
    ).pipe(
      map(data => data.value),
      catchError(this.handleError)
    );
  }

  // Create a new list item
  public createListItem(listTitle: string, item: any): Observable<SharePointListItem> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items`;
    
    const headers = {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'X-RequestDigest': this.getRequestDigest()
    };
    
    return from(
      this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: headers,
        body: JSON.stringify(item)
      }).then((response: SPHttpClientResponse) => response.json())
    ).pipe(
      map(data => data.d),
      catchError(this.handleError)
    );
  }

  // Update an existing list item
  public updateListItem(listTitle: string, itemId: number, item: any): Observable<void> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;
    
    const headers = {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose',
      'X-RequestDigest': this.getRequestDigest(),
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    };
    
    return from(
      this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: headers,
        body: JSON.stringify(item)
      })
    ).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // Delete a list item
  public deleteListItem(listTitle: string, itemId: number): Observable<void> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items(${itemId})`;
    
    const headers = {
      'Accept': 'application/json;odata=verbose',
      'X-RequestDigest': this.getRequestDigest(),
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    };
    
    return from(
      this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
        headers: headers
      })
    ).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  private getRequestDigest(): string {
    // In a real implementation, you would get this from SharePoint
    // For now, return a placeholder
    return 'request-digest-value';
  }

  private handleError(error: any): Observable<never> {
    console.error('SharePoint List Service Error:', error);
    throw error;
  }
}
```

### Microsoft Graph Integration

#### Graph Service for Teams and User Data

```typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
}

export interface TeamsChannel {
  id: string;
  displayName: string;
  description?: string;
  email?: string;
  webUrl: string;
  membershipType: 'standard' | 'private';
}

export interface TeamsMessage {
  id: string;
  body: {
    content: string;
    contentType: 'text' | 'html';
  };
  from: {
    user: GraphUser;
  };
  createdDateTime: string;
  lastModifiedDateTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private graphClient: MSGraphClientV3;

  constructor() {
    this.initializeGraphClient();
  }

  private async initializeGraphClient(): Promise<void> {
    const context = (window as any)['spfxContext'];
    if (context && context.msGraphClientFactory) {
      this.graphClient = await context.msGraphClientFactory.getClient('3');
    }
  }

  // Get current user information
  public getCurrentUser(): Observable<GraphUser> {
    return from(
      this.graphClient
        .api('/me')
        .select('id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation')
        .get()
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get user's Teams
  public getUserTeams(): Observable<any[]> {
    return from(
      this.graphClient
        .api('/me/joinedTeams')
        .select('id,displayName,description,webUrl')
        .get()
    ).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  // Get channels for a specific team
  public getTeamChannels(teamId: string): Observable<TeamsChannel[]> {
    return from(
      this.graphClient
        .api(`/teams/${teamId}/channels`)
        .select('id,displayName,description,email,webUrl,membershipType')
        .get()
    ).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  // Send message to a Teams channel
  public sendChannelMessage(teamId: string, channelId: string, message: string): Observable<TeamsMessage> {
    const messageBody = {
      body: {
        contentType: 'text',
        content: message
      }
    };

    return from(
      this.graphClient
        .api(`/teams/${teamId}/channels/${channelId}/messages`)
        .post(messageBody)
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get channel messages
  public getChannelMessages(teamId: string, channelId: string, top: number = 20): Observable<TeamsMessage[]> {
    return from(
      this.graphClient
        .api(`/teams/${teamId}/channels/${channelId}/messages`)
        .top(top)
        .expand('replies')
        .get()
    ).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  // Search for users
  public searchUsers(query: string): Observable<GraphUser[]> {
    return from(
      this.graphClient
        .api('/users')
        .filter(`startsWith(displayName,'${query}') or startsWith(mail,'${query}')`)
        .select('id,displayName,mail,userPrincipalName,jobTitle,department')
        .top(10)
        .get()
    ).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  // Get user's calendar events
  public getUserEvents(startTime?: string, endTime?: string): Observable<any[]> {
    let api = this.graphClient.api('/me/events');
    
    if (startTime && endTime) {
      api = api.filter(`start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`);
    }
    
    return from(
      api
        .select('id,subject,start,end,location,attendees')
        .orderby('start/dateTime')
        .top(50)
        .get()
    ).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Microsoft Graph Service Error:', error);
    throw error;
  }
}
```

## Teams Integration

### Teams Context Handling

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TeamsContext {
  teamId?: string;
  channelId?: string;
  chatId?: string;
  tid: string;
  theme: string;
  locale: string;
  userPrincipalName: string;
  userObjectId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsContextService {
  private contextSubject = new BehaviorSubject<TeamsContext | null>(null);
  public context$ = this.contextSubject.asObservable();

  constructor() {
    this.initializeTeamsContext();
  }

  private initializeTeamsContext(): void {
    const spfxContext = (window as any)['spfxContext'];
    
    if (spfxContext?.microsoftTeams) {
      const teamsContext = spfxContext.microsoftTeams.context;
      
      const context: TeamsContext = {
        teamId: teamsContext.teamId,
        channelId: teamsContext.channelId,
        chatId: teamsContext.chatId,
        tid: teamsContext.tid,
        theme: teamsContext.theme || 'default',
        locale: teamsContext.locale || 'en-US',
        userPrincipalName: teamsContext.userPrincipalName,
        userObjectId: teamsContext.userObjectId
      };
      
      this.contextSubject.next(context);
      this.applyTeamsTheme(teamsContext.theme);
    }
  }

  private applyTeamsTheme(theme: string): void {
    // Apply Teams theme to Angular application
    const body = document.body;
    body.classList.remove('teams-default', 'teams-dark', 'teams-contrast');
    body.classList.add(`teams-${theme}`);
  }

  public isInTeams(): boolean {
    return this.contextSubject.value !== null;
  }

  public getCurrentContext(): TeamsContext | null {
    return this.contextSubject.value;
  }
}
```

## Deployment Strategies

### Development Deployment

```bash
# Build the solution
npm run build

# Package for SharePoint
npm run package-solution

# Deploy to local SharePoint development environment
npm run deploy:dev
```

### Production Deployment

#### Azure DevOps Pipeline (azure-pipelines.yml)

```yaml
trigger:
  branches:
    include:
    - main
    - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'
  nodeVersion: '20.x'

stages:
- stage: Build
  displayName: 'Build Stage'
  jobs:
  - job: Build
    displayName: 'Build Job'
    steps:
    - task: NodeTool@0
      displayName: 'Install Node.js'
      inputs:
        versionSpec: $(nodeVersion)

    - task: Npm@1
      displayName: 'Install Dependencies'
      inputs:
        command: 'install'
        workingDir: '.'

    - task: Npm@1
      displayName: 'Build Angular Application'
      inputs:
        command: 'custom'
        customCommand: 'run build:angular'
        workingDir: '.'

    - task: Npm@1
      displayName: 'Build SPFx Solution'
      inputs:
        command: 'custom'
        customCommand: 'run build:spfx'
        workingDir: '.'

    - task: Npm@1
      displayName: 'Package Solution'
      inputs:
        command: 'custom'
        customCommand: 'run package-solution'
        workingDir: '.'

    - task: PublishBuildArtifacts@1
      displayName: 'Publish Artifacts'
      inputs:
        pathtoPublish: 'sharepoint/solution'
        artifactName: 'spfx-package'

- stage: Deploy
  displayName: 'Deploy Stage'
  dependsOn: Build
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  jobs:
  - deployment: Deploy
    displayName: 'Deploy to SharePoint'
    environment: 'Production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: DownloadBuildArtifacts@0
            inputs:
              buildType: 'current'
              downloadType: 'single'
              artifactName: 'spfx-package'
              downloadPath: '$(System.ArtifactsDirectory)'

          - task: PowerShell@2
            displayName: 'Deploy to SharePoint App Catalog'
            inputs:
              targetType: 'inline'
              script: |
                # Connect to SharePoint using PnP PowerShell
                Connect-PnPOnline -Url "$(SharePointUrl)" -Interactive
                
                # Upload and deploy the package
                Add-PnPApp -Path "$(System.ArtifactsDirectory)/spfx-package/*.sppkg" -Overwrite
                
                # Install the app to specific sites
                Install-PnPApp -Identity "safe-metrics-dashboard" -Scope Site
```

This comprehensive SharePoint Framework integration guide provides detailed implementation patterns for building enterprise-grade SPFx web parts that seamlessly integrate Angular applications with SharePoint services, Microsoft Graph, and Teams functionality.
