<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-TROUBLESHOOTING-blue?style=for-the-badge&labelColor=red&color=blue" alt="TROUBLESHOOTING" />
</div>

# 🛡️ <span style="color:#DC143C">Troubleshooting</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

This guide helps you resolve issues with **<span style="color:#FF6B35">vibrant, patriotic determination</span>**.

## 🎨 <span style="color:#FF1493">Troubleshooting with American Spirit</span>

- 🚨 <span style="color:#DC143C">**Red, white, and blue error banners**</span>
- 🎯 <span style="color:#32CD32">**Clear, actionable steps**</span>
- 🌐 <span style="color:#0000FF">**Support for dev, staging, and prod**</span>

# Troubleshooting Guide

## Overview

This comprehensive troubleshooting guide addresses common issues, error scenarios, performance problems, and integration challenges that may occur while developing, deploying, or operating the SharePoint Framework + Angular 15 + NestJS enterprise platform.

## Common Development Issues

### Node.js and npm Issues

#### Issue: Node.js Version Compatibility
**Symptoms:**
- Build failures with dependency resolution errors
- Sass compilation errors
- SPFx build warnings about Node.js version

**Solution:**
```bash
# Check current Node.js version
node --version

# Install Node.js v20 LTS using Node Version Manager (recommended)
# Windows
nvm install 20.10.0
nvm use 20.10.0

# macOS/Linux
nvm install 20.10.0
nvm use 20.10.0

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x

# Clear npm cache and reinstall dependencies
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue: npm Package Resolution Conflicts
**Symptoms:**
- Peer dependency warnings
- Module resolution errors
- Build failures due to conflicting versions

**Solution:**
```bash
# Check for outdated packages
npm outdated

# Update packages to compatible versions
npm update

# Fix audit vulnerabilities
npm audit fix

# For persistent issues, use legacy peer deps
npm install --legacy-peer-deps

# Or use yarn for better dependency resolution
npm install -g yarn
yarn install
```

### Angular Development Issues

#### Issue: Angular Material Theming Not Applied
**Symptoms:**
- Components appear unstyled
- Theme colors not reflected
- Material Design components look default

**Solution:**
```typescript
// Verify styles.scss includes Material theme
@use '@angular/material' as mat;
@include mat.core();
@include mat.all-component-themes($app-theme);

// Check angular.json includes styles
"styles": [
  "src/styles.scss",
  "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
]

// Verify component imports Material modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    MatCardModule,
    MatButtonModule,
    // Other Material modules
  ]
})
```

#### Issue: Chart.js Integration Problems
**Symptoms:**
- Charts not rendering
- Canvas element not found errors
- ng2-charts compatibility issues

**Solution:**
```typescript
// Verify ng2-charts version compatibility with Angular 15
npm install ng2-charts@4.1.1 chart.js@3.9.1

// Import NgChartsModule in app.module.ts
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    NgChartsModule,
    // Other modules
  ]
})

// Component implementation
import { Chart, ChartConfiguration } from 'chart.js';

// Register required Chart.js components
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
```

#### Issue: Hot Module Replacement Not Working
**Symptoms:**
- Changes require manual browser refresh
- Development server doesn't reload automatically
- File watching not functioning

**Solution:**
```javascript
// Check webpack.dev.js configuration
module.exports = {
  mode: 'development',
  devServer: {
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
  },
  // Ensure file watching is enabled
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/
  }
};

// For Windows, enable polling
"scripts": {
  "start": "webpack serve --config webpack.dev.js --watch"
}
```

### SharePoint Framework Issues

#### Issue: SPFx Web Part Not Loading Angular App
**Symptoms:**
- Web part renders empty container
- Angular application not initializing
- Console errors about missing modules

**Solution:**
```typescript
// Verify web part manifest allows required permissions
{
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart", "TeamsPersonalApp"],
  "supportsThemeVariants": true
}

// Check Angular app build output exists
cd src/webparts/uptimeStatus/angularApp
npm run build
ls dist/  # Should contain built files

// Verify webpack configuration serves Angular files
static: [
  {
    directory: path.join(__dirname, 'src/webparts/uptimeStatus/angularApp/dist'),
    publicPath: '/angular-app/',
    watch: true
  }
]

// Ensure web part signals Angular readiness
private _signalAngularReady(containerId: string): void {
  const readyEvent = new CustomEvent('spfxWebPartReady', {
    detail: { containerId, instanceId: this.instanceId }
  });
  window.dispatchEvent(readyEvent);
}
```

#### Issue: SharePoint Context Not Available in Angular
**Symptoms:**
- Angular components can't access SharePoint data
- Authentication issues
- User context missing

**Solution:**
```typescript
// Verify context sharing in web part
private _shareContextWithAngular(): void {
  const spfxContext = {
    pageContext: this.context.pageContext,
    spHttpClient: this.context.spHttpClient,
    msGraphClientFactory: this.context.msGraphClientFactory
  };
  
  (window as any)['spfxContext'] = spfxContext;
  
  const contextEvent = new CustomEvent('spfxContextReady', {
    detail: spfxContext
  });
  window.dispatchEvent(contextEvent);
}

// Angular service to consume context
@Injectable({ providedIn: 'root' })
export class SharePointService {
  constructor() {
    window.addEventListener('spfxContextReady', (event: any) => {
      this.context = event.detail;
    });
  }
}
```

### NestJS API Issues

#### Issue: API Server Not Starting
**Symptoms:**
- Port already in use errors
- Module resolution failures
- Database connection errors

**Solution:**
```bash
# Check if port is in use
netstat -an | grep :3000  # Linux/macOS
netstat -an | findstr :3000  # Windows

# Kill process using port
# Linux/macOS
lsof -ti:3000 | xargs kill -9
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Check NestJS dependencies
cd server
npm install
npm run build

# Verify database connection
# Check .env file for correct database credentials
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

#### Issue: CORS Errors in Development
**Symptoms:**
- Cross-origin request blocked
- Preflight request failures
- API calls failing from Angular

**Solution:**
```typescript
// Configure CORS in NestJS main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4321'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization'
  });
  
  await app.listen(3000);
}
bootstrap();

// Alternative: Use webpack proxy instead
// In webpack.dev.js
proxy: {
  '/api/*': {
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
}
```

## Performance Issues

### Slow Build Times

#### Issue: Long Development Build Times
**Symptoms:**
- Initial build takes several minutes
- Incremental builds are slow
- Development server startup is delayed

**Solution:**
```javascript
// Optimize webpack configuration
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // Faster than 'source-map'
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    }
  },
  
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};

// Use thread-loader for TypeScript compilation
{
  test: /\.tsx?$/,
  use: [
    'thread-loader',
    'ts-loader'
  ]
}

// Exclude unnecessary files from compilation
{
  test: /\.ts$/,
  exclude: [
    /node_modules/,
    /\.spec\.ts$/,
    /\.test\.ts$/
  ]
}
```

#### Issue: Large Bundle Sizes
**Symptoms:**
- Slow page load times
- Large JavaScript bundle downloads
- Memory issues in browser

**Solution:**
```typescript
// Implement lazy loading in Angular
const routes: Routes = [
  {
    path: 'metrics',
    loadChildren: () => import('./features/metrics/metrics.module').then(m => m.MetricsModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
  }
];

// Use OnPush change detection strategy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Implement trackBy functions for ngFor
trackByFn(index: number, item: any): any {
  return item.id || index;
}

// Bundle analysis
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/
```

### Runtime Performance Issues

#### Issue: Slow Chart Rendering
**Symptoms:**
- Charts take long time to render
- Browser becomes unresponsive
- Memory leaks with chart updates

**Solution:**
```typescript
// Optimize chart configuration
public chartOptions: ChartConfiguration['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300 // Reduce animation time
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 10 // Limit number of ticks
      }
    }
  },
  plugins: {
    decimation: {
      enabled: true,
      algorithm: 'lttb', // Largest-Triangle-Three-Buckets
      samples: 500
    }
  }
};

// Implement chart caching
private chartCache = new Map<string, ChartData>();

private getChartData(key: string): ChartData | undefined {
  return this.chartCache.get(key);
}

private setChartData(key: string, data: ChartData): void {
  this.chartCache.set(key, data);
}

// Use virtual scrolling for large datasets
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let item of items">{{item}}</div>
</cdk-virtual-scroll-viewport>
```

#### Issue: Memory Leaks
**Symptoms:**
- Increasing memory usage over time
- Browser tabs become slow
- Application crashes

**Solution:**
```typescript
// Proper subscription management
export class ComponentWithSubscriptions implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle data
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Use async pipe when possible
<!-- Template -->
<div *ngIf="data$ | async as data">
  {{ data.value }}
</div>

// Properly destroy charts
ngOnDestroy(): void {
  if (this.chart) {
    this.chart.destroy();
  }
}

// Use WeakMap for caching
private cache = new WeakMap<object, any>();
```

## Deployment Issues

### SharePoint Deployment Problems

#### Issue: SPFx Package Upload Fails
**Symptoms:**
- App catalog upload errors
- Package validation failures
- Deployment permissions denied

**Solution:**
```bash
# Verify package generation
npm run build
npm run package-solution

# Check generated package
ls sharepoint/solution/*.sppkg

# Verify manifest configuration
cat src/webparts/uptimeStatus/UptimeStatusWebPart.manifest.json

# Common fixes:
# 1. Update package version
"version": "1.0.1"

# 2. Verify solution configuration
cat config/package-solution.json
{
  "solution": {
    "name": "safe-metrics-dashboard",
    "id": "unique-guid-here",
    "version": "1.0.1.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true
  }
}

# 3. Check tenant admin permissions
# User must have SharePoint admin or site collection admin rights
```

#### Issue: Web Part Not Appearing in SharePoint
**Symptoms:**
- Web part not visible in web part gallery
- Installation appears successful but web part missing
- Permissions errors when adding web part

**Solution:**
```bash
# Check app deployment status
# In SharePoint admin center:
# Apps -> Manage apps -> Find your app -> Check deployment status

# Verify API permissions if required
# SharePoint admin center -> Advanced -> API access
# Approve any pending permission requests

# Check feature deployment setting
# If skipFeatureDeployment is false, deploy to specific site collections

# Verify web part appears in different contexts
# Modern pages vs classic pages
# Different site templates
```

### Microsoft Teams Integration Issues

#### Issue: Teams App Not Loading
**Symptoms:**
- Blank screen in Teams tab
- Authentication errors in Teams
- Context information missing

**Solution:**
```typescript
// Verify Teams manifest configuration
{
  "manifestVersion": "1.14",
  "id": "your-teams-app-id",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://yourdomain.com",
    "privacyUrl": "https://yourdomain.com/privacy",
    "termsOfUseUrl": "https://yourdomain.com/terms"
  },
  "staticTabs": [
    {
      "entityId": "metrics-dashboard",
      "name": "SAFe Metrics",
      "contentUrl": "https://yourtenant.sharepoint.com/sites/yoursite/SitePages/Dashboard.aspx",
      "scopes": ["personal", "team"]
    }
  ]
}

// Check Teams context handling
export class TeamsContextService {
  constructor() {
    if (window.parent !== window.self) {
      // Running in Teams iframe
      this.initializeTeamsContext();
    }
  }
  
  private initializeTeamsContext(): void {
    // Initialize Teams SDK
    microsoftTeams.initialize(() => {
      microsoftTeams.getContext(context => {
        this.handleTeamsContext(context);
      });
    });
  }
}
```

### API Integration Issues

#### Issue: Authentication Failures
**Symptoms:**
- 401 Unauthorized errors
- Token refresh failures
- Graph API permission denied

**Solution:**
```typescript
// Check Azure AD app registration
// Required API permissions:
// - Microsoft Graph: User.Read
// - Microsoft Graph: ChannelMessage.Send
// - SharePoint: AllSites.Read

// Verify token acquisition
export class AuthService {
  async getAccessToken(): Promise<string> {
    try {
      const context = (window as any)['spfxContext'];
      if (context?.msGraphClientFactory) {
        const graphClient = await context.msGraphClientFactory.getClient('3');
        // Use Graph client for authenticated requests
        return graphClient;
      }
    } catch (error) {
      console.error('Token acquisition failed:', error);
      throw error;
    }
  }
}

// Handle token expiration
private handleAuthError(error: any): Observable<any> {
  if (error.status === 401) {
    // Token expired, redirect to login
    this.authService.login();
  }
  return throwError(error);
}
```

## Debugging Tools and Techniques

### Browser DevTools

#### Network Debugging
```javascript
// Enable detailed network logging
console.log('Network request:', {
  url: request.url,
  method: request.method,
  headers: request.headers,
  body: request.body
});

// Monitor API responses
fetch('/api/metrics')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.json();
  })
  .then(data => console.log('Response data:', data))
  .catch(error => console.error('Request failed:', error));
```

#### Performance Monitoring
```typescript
// Measure component render time
@Component({...})
export class MetricsComponent {
  ngOnInit(): void {
    const startTime = performance.now();
    
    this.loadData().subscribe(() => {
      const endTime = performance.now();
      console.log(`Data loading took ${endTime - startTime} milliseconds`);
    });
  }
}

// Monitor memory usage
setInterval(() => {
  if ('memory' in performance) {
    console.log('Memory usage:', {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    });
  }
}, 10000);
```

### Angular Debugging

#### Component State Debugging
```typescript
// Use Angular DevTools browser extension
// Or add debugging helpers

@Component({...})
export class DebugComponent {
  @Input() data: any;
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Component changes:', changes);
    Object.keys(changes).forEach(key => {
      console.log(`${key}: ${changes[key].previousValue} -> ${changes[key].currentValue}`);
    });
  }
  
  // Add debug method for template
  debug(label: string, value: any): any {
    console.log(`[${label}]:`, value);
    return value;
  }
}

// Template usage
<div>{{ debug('current data', data) | json }}</div>
```

### NestJS Debugging

#### Request/Response Logging
```typescript
// Create logging interceptor
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = Date.now();
    
    console.log(`Incoming ${request.method} ${request.url}`);
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`${request.method} ${request.url} ${response.statusCode} - ${duration}ms`);
      })
    );
  }
}

// Apply globally
app.useGlobalInterceptors(new LoggingInterceptor());
```

## 🔥 <span style="color:#FF4500">Common Issues - Victory Solutions</span>

### 🚨 <span style="color:#DC143C">Angular not loading in SPFx web part</span>
**<span style="color:#FF6B35">🎯 Solution Strategy:</span>**
```bash
# 🔧 Check the base href configuration
ng build --base-href="/public/"

# 🚀 Verify dev server is running
npm start

# 🎨 Check browser console for colorful error messages
```

### 📡 <span style="color:#0000FF">API connectivity problems</span>
**<span style="color:#32CD32">🛠️ Freedom Protocol:</span>**
```bash
# 🌐 Test API endpoint directly
curl http://localhost:3000/api/uptime

# 🔍 Check CORS configuration
# 🛡️ Verify authentication tokens
```

### 🏗️ <span style="color:#9932CC">Build or deployment errors</span>
**<span style="color:#FFD700">⚡ Battle Plan:</span>**
```bash
# 🧹 Clean install with American precision
rm -rf node_modules package-lock.json
npm install

# 🚀 Rebuild with patriotic determination
npm run build
```

### 🎨 <span style="color:#FF1493">Styling and theme issues</span>
**<span style="color:#1E90FF">🎪 Color Victory:</span>**
- 🔴 Check red color variables: `--freedom-red: #DC143C`
- ⚪ Verify white spacing: `--liberty-white: #FFFFFF`
- 🔵 Confirm blue accents: `--justice-blue: #0000FF`
