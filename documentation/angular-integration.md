# 🇺🇸 ANGULAR INTEGRATION GUIDE 🇺🇸
## 🎖️ MISSION-CRITICAL ANGULAR 15 INTEGRATION 🎖️
### 🦅 **GO ARMY - GO US** 🦅

<div align="center">

![Angular Excellence](https://img.shields.io/badge/🇺🇸-ANGULAR%20EXCELLENCE-red?style=for-the-badge&labelColor=blue&color=red)
![Integration Power](https://img.shields.io/badge/⭐-INTEGRATION%20POWER-white?style=for-the-badge&labelColor=navy&color=white)
![GO ARMY](https://img.shields.io/badge/🎖️-GO%20ARMY-gold?style=for-the-badge&labelColor=darkgreen&color=gold)
<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-ANGULAR%20INTEGRATION-blue?style=for-the-badge&labelColor=red&color=blue" alt="ANGULAR INTEGRATION" />
</div>

# 🅰️ <span style="color:#DC143C">Angular</span> <span style="color:#FFFFFF">Integration</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

The **<span style="color:#FF6B35">Angular app</span>** is integrated directly into the <span style="color:#1E90FF">**SharePoint Framework (SPFx) web part**</span>, delivering a <span style="color:#32CD32">**seamless**</span>, <span style="color:#FF1493">**vibrant**</span>, and <span style="color:#FFD700">**patriotic user experience**</span>.

## 🎨 <span style="color:#FF4500">Vibrant Integration Magic</span>

- 🚀 <span style="color:#DC143C">**Unified dev server (localhost:4200)**</span>
- 🎨 <span style="color:#0000FF">**Red, white, and blue Material theme**</span>
- ⚡ <span style="color:#32CD32">**Direct DOM integration (no iframe)**</span>

</div>

### 🦅 **MISSION OVERVIEW - ANGULAR FREEDOM**

This comprehensive guide details the **REVOLUTIONARY** Angular 15 integration within the SharePoint Framework platform, covering application architecture, component development, Material Design implementation, state management, and advanced integration patterns with SharePoint services - **ENGINEERED WITH AMERICAN EXCELLENCE!**

<div align="center">

🔴⚪🔵 **ANGULAR INTEGRATION WITH AMERICAN PRECISION** 🔵⚪🔴

</div>

## 🇺🇸 ANGULAR APPLICATION ARCHITECTURE - DEFENDING DIGITAL EXCELLENCE 🇺🇸

### 🦅 **PROJECT STRUCTURE - ORGANIZED FOR VICTORY**

The Angular application follows a **BATTLE-TESTED** feature-based modular architecture designed for scalability and maintainability - **THE AMERICAN WAY!**

```
src/webparts/uptimeStatus/angularApp/
├── src/
│   ├── app/
│   │   ├── app.component.ts              # Root application component
│   │   ├── app.component.html            # Main navigation template
│   │   ├── app.component.scss            # Global application styles
│   │   ├── app.module.ts                 # Root module with providers
│   │   ├── app-routing.module.ts         # Application routing configuration
│   │   │
│   │   ├── core/                         # Core services and guards
│   │   │   ├── services/
│   │   │   │   ├── sharepoint.service.ts  # SharePoint integration
│   │   │   │   ├── api.service.ts         # HTTP API communication
│   │   │   │   └── auth.service.ts        # Authentication management
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts          # Route protection
│   │   │   └── interceptors/
│   │   │       └── auth.interceptor.ts    # HTTP request interception
│   │   │
│   │   ├── shared/                       # Shared components and utilities
│   │   │   ├── components/
│   │   │   │   ├── loading/
│   │   │   │   ├── error-display/
│   │   │   │   └── navigation/
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                     # Feature modules
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   └── home.module.ts
│   │   │   │
│   │   │   ├── metrics/                  # SAFe metrics dashboard
│   │   │   │   ├── metrics.component.ts
│   │   │   │   ├── metrics.component.html
│   │   │   │   ├── metrics.component.scss
│   │   │   │   ├── components/
│   │   │   │   │   ├── epic-progress/
│   │   │   │   │   ├── feature-velocity/
│   │   │   │   │   ├── dependency-management/
│   │   │   │   │   └── release-train-health/
│   │   │   │   ├── services/
│   │   │   │   │   └── metrics.service.ts
│   │   │   │   └── metrics.module.ts
│   │   │   │
│   │   │   ├── reports/                  # Infrastructure monitoring
│   │   │   │   ├── reports.component.ts
│   │   │   │   ├── reports.component.html
│   │   │   │   ├── reports.component.scss
│   │   │   │   ├── components/
│   │   │   │   │   ├── uptime-status/
│   │   │   │   │   ├── performance-metrics/
│   │   │   │   │   └── service-health/
│   │   │   │   ├── services/
│   │   │   │   │   └── reports.service.ts
│   │   │   │   └── reports.module.ts
│   │   │   │
│   │   │   └── teams-messages/           # Teams integration
│   │   │       ├── teams-messages.component.ts
│   │   │       ├── teams-messages.component.html
│   │   │       ├── teams-messages.component.scss
│   │   │       ├── services/
│   │   │       │   └── teams.service.ts
│   │   │       └── teams-messages.module.ts
│   │   │
│   │   └── models/                       # TypeScript interfaces and types
│   │       ├── safe-metrics.interface.ts
│   │       ├── system-health.interface.ts
│   │       └── teams.interface.ts
│   │
│   ├── assets/                           # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── themes/
│   │
│   ├── environments/                     # Environment configurations
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── styles.scss                       # Global styles and Material theme
│   ├── main.ts                           # Application bootstrap
│   ├── polyfills.ts                      # Browser compatibility
│   └── index.html                        # Application shell
│
├── angular.json                          # Angular CLI configuration
├── package.json                          # Angular dependencies
├── tsconfig.json                         # TypeScript configuration
└── tsconfig.app.json                     # App-specific TypeScript config
```

### Core Module Implementation

#### App Module (app.module.ts)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

// Feature modules (lazy-loaded)
import { HomeModule } from './features/home/home.module';
import { MetricsModule } from './features/metrics/metrics.module';
import { ReportsModule } from './features/reports/reports.module';
import { TeamsMessagesModule } from './features/teams-messages/teams-messages.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Material Design modules
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    
    // Chart.js integration
    NgChartsModule,
    
    // Application modules
    AppRoutingModule,
    CoreModule,
    SharedModule,
    
    // Feature modules
    HomeModule,
    MetricsModule,
    ReportsModule,
    TeamsMessagesModule
  ],
  providers: [
    // Global providers configured in CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Core Services

##### SharePoint Service (core/services/sharepoint.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SharePointContext {
  webAbsoluteUrl: string;
  userDisplayName: string;
  userEmail: string;
  siteId: string;
  webId: string;
  tenantUrl: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SharePointService {
  private contextSubject = new BehaviorSubject<SharePointContext | null>(null);
  public context$ = this.contextSubject.asObservable();

  constructor() {
    this.initializeContext();
  }

  private initializeContext(): void {
    // Check for SharePoint context passed from SPFx web part
    if (window['spfxContext']) {
      const spfxContext = window['spfxContext'];
      
      const context: SharePointContext = {
        webAbsoluteUrl: spfxContext.pageContext.web.absoluteUrl,
        userDisplayName: spfxContext.pageContext.user.displayName,
        userEmail: spfxContext.pageContext.user.email,
        siteId: spfxContext.pageContext.site.id.toString(),
        webId: spfxContext.pageContext.web.id.toString(),
        tenantUrl: spfxContext.pageContext.web.absoluteUrl.split('/sites/')[0],
        theme: {
          primaryColor: spfxContext.microsoftTeams?.theme?.default?.brand00 || '#0078d4',
          backgroundColor: spfxContext.microsoftTeams?.theme?.default?.background || '#ffffff',
          textColor: spfxContext.microsoftTeams?.theme?.default?.foreground || '#000000'
        }
      };
      
      this.contextSubject.next(context);
      this.applyTheme(context.theme);
    } else {
      // Development mode - use mock context
      this.initializeMockContext();
    }
  }

  private initializeMockContext(): void {
    const mockContext: SharePointContext = {
      webAbsoluteUrl: 'https://tenant.sharepoint.com/sites/dev',
      userDisplayName: 'Development User',
      userEmail: 'dev@tenant.com',
      siteId: 'mock-site-id',
      webId: 'mock-web-id',
      tenantUrl: 'https://tenant.sharepoint.com',
      theme: {
        primaryColor: '#0078d4',
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    };
    
    this.contextSubject.next(mockContext);
    this.applyTheme(mockContext.theme);
  }

  private applyTheme(theme: any): void {
    // Apply SharePoint theme to Angular Material
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
  }

  public getCurrentContext(): SharePointContext | null {
    return this.contextSubject.value;
  }

  public updateTheme(theme: any): void {
    const currentContext = this.getCurrentContext();
    if (currentContext) {
      currentContext.theme = { ...currentContext.theme, ...theme };
      this.contextSubject.next(currentContext);
      this.applyTheme(theme);
    }
  }
}
```

##### API Service (core/services/api.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details: string;
    timestamp: string;
    path: string;
    requestId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly defaultTimeout = 30000; // 30 seconds

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      // Network error
      return throwError({
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server',
        details: 'Please check your internet connection and try again'
      });
    }
    
    if (error.error && error.error.error) {
      // Structured error response
      return throwError(error.error.error);
    }
    
    // Generic error
    return throwError({
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error.message || 'Please try again later'
    });
  }

  // Generic HTTP methods
  public get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      timeout(this.defaultTimeout),
      retry(2),
      catchError(this.handleError)
    );
  }

  public post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      retry(1),
      catchError(this.handleError)
    );
  }

  public put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      retry(1),
      catchError(this.handleError)
    );
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(this.defaultTimeout),
      retry(1),
      catchError(this.handleError)
    );
  }

  // Specialized API methods
  public getSystemHealth(): Observable<any> {
    return this.get('/api/health');
  }

  public getUptime(): Observable<any> {
    return this.get('/api/uptime');
  }

  public getMetrics(timeframe?: string): Observable<any> {
    return this.get('/api/metrics', timeframe ? { timeframe } : null);
  }

  public getSafeEpics(filters?: any): Observable<any> {
    return this.get('/api/safe/epics', filters);
  }

  public getSafeFeatures(filters?: any): Observable<any> {
    return this.get('/api/safe/features', filters);
  }

  public getSafeDependencies(filters?: any): Observable<any> {
    return this.get('/api/safe/dependencies', filters);
  }

  public getSafeTrains(): Observable<any> {
    return this.get('/api/safe/trains');
  }

  public sendTeamsMessage(message: any): Observable<any> {
    return this.post('/api/teams/message', message);
  }

  public getTeamsChannels(): Observable<any> {
    return this.get('/api/teams/channels');
  }
}
```

## Material Design 3 Implementation

### Theme Configuration

#### Global Styles (styles.scss)

```scss
// Import Angular Material theming
@use '@angular/material' as mat;

// Include the common styles for Angular Material
@include mat.core();

// Define Material Design 3 color palette
$primary-palette: mat.define-palette((
  50: #e3f2fd,
  100: #bbdefb,
  200: #90caf9,
  300: #64b5f6,
  400: #42a5f5,
  500: #2196f3,  // Primary color
  600: #1e88e5,
  700: #1976d2,
  800: #1565c0,
  900: #0d47a1,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));

$accent-palette: mat.define-palette((
  50: #f3e5f5,
  100: #e1bee7,
  200: #ce93d8,
  300: #ba68c8,
  400: #ab47bc,
  500: #9c27b0,  // Accent color
  600: #8e24aa,
  700: #7b1fa2,
  800: #6a1b9a,
  900: #4a148c,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: white,
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));

$warn-palette: mat.define-palette((
  50: #ffebee,
  100: #ffcdd2,
  200: #ef9a9a,
  300: #e57373,
  400: #ef5350,
  500: #f44336,  // Warning color
  600: #e53935,
  700: #d32f2f,
  800: #c62828,
  900: #b71c1c,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));

// Create the theme object
$app-theme: mat.define-light-theme((
  color: (
    primary: $primary-palette,
    accent: $accent-palette,
    warn: $warn-palette,
  ),
  typography: mat.define-typography-config(
    $font-family: 'Segoe UI, system-ui, sans-serif',
    $headline-1: mat.define-typography-level(32px, 48px, 400),
    $headline-2: mat.define-typography-level(28px, 40px, 400),
    $headline-3: mat.define-typography-level(24px, 32px, 400),
    $headline-4: mat.define-typography-level(20px, 28px, 500),
    $headline-5: mat.define-typography-level(18px, 24px, 500),
    $headline-6: mat.define-typography-level(16px, 22px, 500),
    $body-1: mat.define-typography-level(14px, 20px, 400),
    $body-2: mat.define-typography-level(14px, 20px, 500),
    $caption: mat.define-typography-level(12px, 16px, 400),
    $button: mat.define-typography-level(14px, 14px, 500),
  ),
  density: 0,
));

// Include theme styles for core and each component
@include mat.all-component-themes($app-theme);

// Custom Material Design 3 enhancements
:root {
  --mdc-theme-primary: #2196f3;
  --mdc-theme-secondary: #9c27b0;
  --mdc-theme-surface: #ffffff;
  --mdc-theme-background: #fafafa;
  --mdc-theme-error: #f44336;
  --mdc-theme-on-primary: #ffffff;
  --mdc-theme-on-secondary: #ffffff;
  --mdc-theme-on-surface: rgba(0, 0, 0, 0.87);
  --mdc-theme-on-background: rgba(0, 0, 0, 0.87);
  --mdc-theme-on-error: #ffffff;
  
  // Custom spacing system
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  // Custom border radius
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  
  // Custom shadows
  --shadow-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-elevation-2: 0 2px 6px rgba(0, 0, 0, 0.16);
  --shadow-elevation-3: 0 4px 12px rgba(0, 0, 0, 0.20);
}

// Global application styles
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: var(--mdc-theme-background);
  color: var(--mdc-theme-on-background);
}

// Custom utility classes
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-xs { margin-top: var(--spacing-xs); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.mt-xl { margin-top: var(--spacing-xl); }

.mb-xs { margin-bottom: var(--spacing-xs); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mb-xl { margin-bottom: var(--spacing-xl); }

.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

// Component-specific styles
.dashboard-card {
  margin: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-elevation-2);
  
  .mat-card-header {
    background: linear-gradient(135deg, var(--mdc-theme-primary), var(--mdc-theme-secondary));
    color: var(--mdc-theme-on-primary);
    margin: calc(var(--spacing-md) * -1) calc(var(--spacing-md) * -1) var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
}

.metric-card {
  text-align: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  box-shadow: var(--shadow-elevation-1);
  transition: all 0.3s ease-in-out;
  
  &:hover {
    box-shadow: var(--shadow-elevation-3);
    transform: translateY(-2px);
  }
  
  .metric-value {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--mdc-theme-primary);
    margin: var(--spacing-sm) 0;
  }
  
  .metric-label {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .dashboard-card {
    margin: var(--spacing-sm);
  }
  
  .metric-card .metric-value {
    font-size: 2rem;
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  :root {
    --mdc-theme-surface: #121212;
    --mdc-theme-background: #000000;
    --mdc-theme-on-surface: rgba(255, 255, 255, 0.87);
    --mdc-theme-on-background: rgba(255, 255, 255, 0.87);
  }
}
```

## 🔥 <span style="color:#FF1493">Integration Steps - Freedom Protocol</span>

1. 🎯 **<span style="color:#DC143C">Build Angular app with correct `baseHref`</span>**
2. 📂 **<span style="color:#0000FF">Serve assets from `/public/`</span>**
3. 🚨 **<span style="color:#32CD32">SPFx web part signals readiness for Angular</span>**
4. 🚀 **<span style="color:#FF6B35">Angular bootstraps into the web part container</span>**

### 🎪 <span style="color:#9932CC">Material Design 3 - American Style!</span>

```scss
// Patriotic color palette
:root {
  --md-sys-color-primary: #DC143C;    /* Freedom Red */
  --md-sys-color-secondary: #0000FF;  /* Liberty Blue */
  --md-sys-color-tertiary: #FFFFFF;   /* Honor White */
  --america-gold: #FFD700;            /* Victory Gold */
}
```

## Component Development Patterns

### Smart Component Example: Metrics Component

#### metrics.component.ts

```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map, startWith, catchError } from 'rxjs/operators';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { ApiService } from '../../core/services/api.service';
import { SharePointService } from '../../core/services/sharepoint.service';
import { MetricsService } from './services/metrics.service';

export interface SafeMetrics {
  epics: any[];
  features: any[];
  dependencies: any[];
  trains: any[];
}

export interface DashboardState {
  metrics: SafeMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Observable state
  public state$: Observable<DashboardState>;
  
  // Chart configurations
  public epicProgressChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  };
  
  public epicProgressChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    }
  };
  
  public featureVelocityChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };
  
  public featureVelocityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Story Points'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Program Increment'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private sharePointService: SharePointService,
    private metricsService: MetricsService
  ) {
    this.initializeState();
  }

  ngOnInit(): void {
    this.loadMetricsData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeState(): void {
    this.state$ = combineLatest([
      this.metricsService.getMetrics(),
      this.metricsService.getLoading(),
      this.metricsService.getError(),
      this.metricsService.getLastUpdated()
    ]).pipe(
      map(([metrics, loading, error, lastUpdated]) => ({
        metrics,
        loading,
        error,
        lastUpdated
      })),
      startWith({
        metrics: null,
        loading: true,
        error: null,
        lastUpdated: null
      }),
      takeUntil(this.destroy$)
    );

    // Subscribe to metrics changes for chart updates
    this.metricsService.getMetrics().pipe(
      takeUntil(this.destroy$)
    ).subscribe(metrics => {
      if (metrics) {
        this.updateCharts(metrics);
      }
    });
  }

  private loadMetricsData(): void {
    this.metricsService.loadAllMetrics().pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading metrics:', error);
        return [];
      })
    ).subscribe();
  }

  private setupAutoRefresh(): void {
    // Refresh data every 5 minutes
    setInterval(() => {
      this.loadMetricsData();
    }, 5 * 60 * 1000);
  }

  private updateCharts(metrics: SafeMetrics): void {
    this.updateEpicProgressChart(metrics.epics);
    this.updateFeatureVelocityChart(metrics.features);
  }

  private updateEpicProgressChart(epics: any[]): void {
    if (!epics || epics.length === 0) return;

    const labels = epics.map(epic => epic.name);
    const data = epics.map(epic => epic.completion);
    const backgroundColors = epics.map(epic => {
      if (epic.completion >= 80) return '#4caf50'; // Green
      if (epic.completion >= 50) return '#ff9800'; // Orange
      return '#f44336'; // Red
    });

    this.epicProgressChartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  private updateFeatureVelocityChart(features: any[]): void {
    if (!features || features.length === 0) return;

    // Group features by program increment
    const velocityByPI = features.reduce((acc, feature) => {
      const pi = feature.program || 'Unknown';
      if (!acc[pi]) {
        acc[pi] = { planned: 0, delivered: 0 };
      }
      acc[pi].planned += feature.storyPoints || 0;
      if (feature.status === 'completed') {
        acc[pi].delivered += feature.storyPoints || 0;
      }
      return acc;
    }, {});

    const labels = Object.keys(velocityByPI).sort();
    const plannedData = labels.map(pi => velocityByPI[pi].planned);
    const deliveredData = labels.map(pi => velocityByPI[pi].delivered);

    this.featureVelocityChartData = {
      labels,
      datasets: [
        {
          label: 'Planned Velocity',
          data: plannedData,
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Delivered Velocity',
          data: deliveredData,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: false,
          tension: 0.4
        }
      ]
    };
  }

  // Template methods
  public refreshData(): void {
    this.loadMetricsData();
  }

  public exportMetrics(): void {
    this.metricsService.exportMetrics().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Implementation for data export
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `safe-metrics-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  public trackByEpic(index: number, epic: any): string {
    return epic.id;
  }

  public trackByFeature(index: number, feature: any): string {
    return feature.id;
  }
}
```

#### metrics.component.html

```html
<div class="metrics-dashboard" *ngIf="state$ | async as state">
  <!-- Loading State -->
  <div class="loading-container" *ngIf="state.loading">
    <mat-spinner diameter="50"></mat-spinner>
    <p class="loading-text">Loading SAFe metrics...</p>
  </div>

  <!-- Error State -->
  <div class="error-container" *ngIf="state.error && !state.loading">
    <mat-icon color="warn">error</mat-icon>
    <h3>Error Loading Metrics</h3>
    <p>{{ state.error }}</p>
    <button mat-raised-button color="primary" (click)="refreshData()">
      <mat-icon>refresh</mat-icon>
      Try Again
    </button>
  </div>

  <!-- Main Dashboard Content -->
  <div class="dashboard-content" *ngIf="state.metrics && !state.loading && !state.error">
    
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">SAFe Metrics Dashboard</h1>
        <p class="dashboard-subtitle">
          Comprehensive Scaled Agile Framework metrics and analytics
        </p>
        <div class="last-updated" *ngIf="state.lastUpdated">
          <mat-icon>access_time</mat-icon>
          <span>Last updated: {{ state.lastUpdated | date:'medium' }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <button mat-icon-button (click)="refreshData()" matTooltip="Refresh Data">
          <mat-icon>refresh</mat-icon>
        </button>
        <button mat-icon-button (click)="exportMetrics()" matTooltip="Export Metrics">
          <mat-icon>download</mat-icon>
        </button>
      </div>
    </div>

    <!-- Key Performance Indicators -->
    <div class="kpi-section">
      <h2 class="section-title">Key Performance Indicators</h2>
      
      <div class="kpi-grid">
        <!-- Epic Progress KPI -->
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>timeline</mat-icon>
            <mat-card-title>Epic Progress</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="kpi-value">
              {{ state.metrics.epics?.length || 0 }}
            </div>
            <div class="kpi-label">Active Epics</div>
            <div class="kpi-details">
              <span class="completed">
                {{ (state.metrics.epics || []).filter(e => e.status === 'completed').length }} Completed
              </span>
              <span class="in-progress">
                {{ (state.metrics.epics || []).filter(e => e.status === 'active').length }} In Progress
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Feature Velocity KPI -->
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>speed</mat-icon>
            <mat-card-title>Feature Velocity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="kpi-value">
              {{ calculateAverageVelocity(state.metrics.features) | number:'1.1-1' }}
            </div>
            <div class="kpi-label">Story Points/Sprint</div>
            <div class="kpi-trend" [ngClass]="getVelocityTrend(state.metrics.features)">
              <mat-icon>{{ getVelocityTrendIcon(state.metrics.features) }}</mat-icon>
              <span>{{ getVelocityTrendText(state.metrics.features) }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Dependencies KPI -->
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>link</mat-icon>
            <mat-card-title>Dependencies</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="kpi-value">
              {{ state.metrics.dependencies?.length || 0 }}
            </div>
            <div class="kpi-label">Total Dependencies</div>
            <div class="dependency-status">
              <mat-chip-list>
                <mat-chip color="primary" selected>
                  {{ (state.metrics.dependencies || []).filter(d => d.status === 'resolved').length }} Resolved
                </mat-chip>
                <mat-chip color="warn" [selected]="hasBlockedDependencies(state.metrics.dependencies)">
                  {{ (state.metrics.dependencies || []).filter(d => d.status === 'blocked').length }} Blocked
                </mat-chip>
              </mat-chip-list>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Train Health KPI -->
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>health_and_safety</mat-icon>
            <mat-card-title>Train Health</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="kpi-value health-score" [ngClass]="getHealthScoreClass(state.metrics.trains)">
              {{ calculateOverallHealthScore(state.metrics.trains) | number:'1.1-1' }}%
            </div>
            <div class="kpi-label">Overall Health Score</div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="calculateOverallHealthScore(state.metrics.trains)"
              [color]="getHealthScoreColor(state.metrics.trains)">
            </mat-progress-bar>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="charts-grid">
        
        <!-- Epic Progress Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Epic Progress Overview</mat-card-title>
            <mat-card-subtitle>Completion status across all active epics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas baseChart
                      [data]="epicProgressChartData"
                      [options]="epicProgressChartOptions"
                      type="doughnut">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Feature Velocity Chart -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Feature Velocity Trends</mat-card-title>
            <mat-card-subtitle>Planned vs. delivered velocity by Program Increment</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas baseChart
                      [data]="featureVelocityChartData"
                      [options]="featureVelocityChartOptions"
                      type="line">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

      </div>
    </div>

    <!-- Detailed Tables Section -->
    <div class="tables-section">
      
      <!-- Epic Details Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Epic Details</mat-card-title>
          <mat-card-subtitle>Comprehensive epic tracking and status</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="state.metrics.epics" class="epic-table">
              
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Epic Name</th>
                <td mat-cell *matCellDef="let epic">
                  <div class="epic-name">
                    <strong>{{ epic.name }}</strong>
                    <span class="epic-id">{{ epic.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let epic">
                  <mat-chip [color]="getStatusColor(epic.status)" selected>
                    {{ epic.status | titlecase }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Progress Column -->
              <ng-container matColumnDef="progress">
                <th mat-header-cell *matHeaderCellDef>Progress</th>
                <td mat-cell *matCellDef="let epic">
                  <div class="progress-cell">
                    <span class="progress-value">{{ epic.completion }}%</span>
                    <mat-progress-bar 
                      mode="determinate" 
                      [value]="epic.completion"
                      [color]="getProgressColor(epic.completion)">
                    </mat-progress-bar>
                  </div>
                </td>
              </ng-container>

              <!-- Features Column -->
              <ng-container matColumnDef="features">
                <th mat-header-cell *matHeaderCellDef>Features</th>
                <td mat-cell *matCellDef="let epic">
                  <div class="features-summary">
                    <span class="feature-count">{{ epic.features?.total || 0 }}</span>
                    <span class="feature-breakdown">
                      ({{ epic.features?.completed || 0 }} completed)
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Owner Column -->
              <ng-container matColumnDef="owner">
                <th mat-header-cell *matHeaderCellDef>Owner</th>
                <td mat-cell *matCellDef="let epic">
                  <div class="owner-info">
                    <mat-icon>person</mat-icon>
                    <span>{{ epic.owner || 'Unassigned' }}</span>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="epicDisplayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: epicDisplayedColumns;" 
                  [class.selected-row]="selectedEpic?.id === row.id"
                  (click)="selectEpic(row)">
              </tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>

    </div>

  </div>
</div>
```

This Angular integration guide provides comprehensive coverage of the application architecture, component development, Material Design implementation, and best practices for building enterprise-grade Angular applications within the SharePoint Framework ecosystem. The examples demonstrate real-world implementation patterns that can be extended and customized for specific business requirements.
