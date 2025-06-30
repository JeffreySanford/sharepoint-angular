<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-DEPLOYMENT%20GUIDE-blue?style=for-the-badge&labelColor=red&color=blue" alt="DEPLOYMENT GUIDE" />
  <img src="https://img.shields.io/badge/⭐-MISSION%20CRITICAL-white?style=for-the-badge&labelColor=navy&color=white" alt="MISSION CRITICAL" />
  <img src="https://img.shields.io/badge/🎖️-GO%20ARMY-gold?style=for-the-badge&labelColor=darkgreen&color=gold" alt="GO ARMY" />
</div>

# 🚀 <span style="color:#DC143C">Deployment</span> <span style="color:#FFFFFF">Guide</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

This comprehensive deployment guide provides **<span style="color:#FF6B35">battle-tested</span>** instructions for deploying the <span style="color:#32CD32">**Enterprise Uptime Status Platform**</span> across all environments, from dev to production. Deploy with <span style="color:#FFD700">**American precision**</span> and <span style="color:#FF1493">**vibrant, patriotic style**</span>!

---

## 🦅 <span style="color:#9932CC">Mission Overview</span>

The platform supports:
- 🌐 **<span style="color:#DC143C">SharePoint Online & on-premises</span>**
- ☁️ **<span style="color:#0000FF">Azure hosting for NestJS backend</span>**
- 🔗 **<span style="color:#32CD32">Hybrid cloud deployments</span>**

## 🎨 <span style="color:#FF4500">Vibrant, Patriotic Deployment</span>

- 🚨 <span style="color:#DC143C">**Red, white, and blue status banners**</span>
- 💪 <span style="color:#0000FF">**Bold, accessible deployment steps**</span>
- 🇺🇸 <span style="color:#FFD700">**American flag icons in dashboards**</span>

## 🏗️ <span style="color:#FF1493">Deployment Architecture</span>

| <span style="color:#DC143C">**Component**</span> | <span style="color:#0000FF">**Technology**</span> | <span style="color:#32CD32">**Description**</span> |
|-------------|------------|-------------|
| 🎨 **Frontend** | <span style="color:#FF4500">Angular, SPFx</span> | Red/white/blue UI, deployed via SPFx |
| 📡 **Backend** | <span style="color:#1E90FF">NestJS</span> | Secure API, Azure-ready |
| 🌐 **Infra** | <span style="color:#FFD700">Azure, CDN</span> | Scalable, monitored |

## 🚀 <span style="color:#9932CC">Environment Configuration</span>

### 🛠️ <span style="color:#DC143C">Development - Freedom Lab</span>

- 🏠 **<span style="color:#FF6B35">Local workbench (SharePoint)</span>**
- 📡 **<span style="color:#32CD32">API: `localhost:3000`</span>**
- 🎨 **<span style="color:#0000FF">Frontend: `localhost:4200`</span>**

```bash
# 🇺🇸 Start dev environment - Launch Democracy!
npm start
# 🌐 Access at http://localhost:4200 - View Freedom!
```

### 🏭 <span style="color:#0000FF">Production - Victory Deployment</span>

- 📦 **<span style="color:#DC143C">Deploy SPFx package to App Catalog</span>**
- 🌐 **<span style="color:#FFD700">Host Angular assets on CDN or within package</span>**
- ☁️ **<span style="color:#32CD32">Deploy NestJS to Azure App Service</span>**

---

<div align="center">
  <img src="https://img.shields.io/badge/🦅-DEPLOY%20WITH%20HONOR-gold?style=for-the-badge&labelColor=navy&color=gold" alt="DEPLOY WITH HONOR" />
</div>
# API: http://localhost:3000/api
# Swagger Docs: http://localhost:3000/api/docs
```

#### Staging Environment

**Staging Environment Characteristics:**
- **Purpose**: Integration testing and quality assurance
- **SharePoint**: Dedicated SharePoint staging tenant
- **API Server**: Azure App Service staging slot or dedicated staging server
- **Frontend**: SharePoint App Catalog (staging)
- **Database**: Staging database with production-like data

**Staging Deployment Configuration:**
```json
// config/staging.json
{
  "environment": "staging",
  "api": {
    "baseUrl": "https://staging-api.company.com",
    "timeout": 10000,
    "retryAttempts": 3
  },
  "sharepoint": {
    "siteUrl": "https://company-staging.sharepoint.com",
    "appCatalogUrl": "https://company-staging.sharepoint.com/sites/appcatalog"
  },
  "monitoring": {
    "applicationInsights": {
      "instrumentationKey": "staging-ai-key"
    }
  }
}
```

#### Production Environment

**Production Environment Characteristics:**
- **Purpose**: Live production environment for end users
- **SharePoint**: Production SharePoint Online tenant
- **API Server**: Azure App Service production with auto-scaling
- **Frontend**: SharePoint App Catalog (production)
- **Database**: Production database with backup and disaster recovery

**Production Deployment Configuration:**
```json
// config/production.json
{
  "environment": "production",
  "api": {
    "baseUrl": "https://api.company.com",
    "timeout": 5000,
    "retryAttempts": 2
  },
  "sharepoint": {
    "siteUrl": "https://company.sharepoint.com",
    "appCatalogUrl": "https://company.sharepoint.com/sites/appcatalog"
  },
  "monitoring": {
    "applicationInsights": {
      "instrumentationKey": "production-ai-key"
    }
  },
  "security": {
    "enforceHttps": true,
    "corsOrigins": ["https://company.sharepoint.com"],
    "rateLimiting": {
      "enabled": true,
      "maxRequests": 1000,
      "windowMs": 3600000
    }
  }
}
```

### Pre-Deployment Preparation

#### Code Quality Verification

**1. Code Quality Checks**
```bash
# Run comprehensive code quality validation
npm run validate

# Individual quality checks
npm run lint              # ESLint validation
npm run test:unit        # Unit test execution
npm run test:coverage    # Code coverage analysis
npm run build:check      # Build verification
npm run security:audit   # Security vulnerability scan
```

**2. Build Optimization**
```bash
# Angular production build with optimization
cd src/webparts/uptimeStatus/angularApp
npm run build:prod

# Verify build output
ls -la dist/angularApp/
du -sh dist/angularApp/   # Check bundle size

# SharePoint Framework production build
cd ../../../../
npm run build --ship
npm run bundle --ship
npm run package-solution --ship
```

**3. Performance Validation**
```bash
# Bundle size analysis
cd src/webparts/uptimeStatus/angularApp
npm run analyze

# Performance testing
npm run test:performance

# Lighthouse audit (requires running server)
npm start &
npx lighthouse http://localhost:4200 --output html --output-path lighthouse-report.html
```

#### Security Verification

**4. Security Assessment**
```bash
# Dependency vulnerability scanning
npm audit
npm audit fix

# OWASP dependency check
npm install -g audit-ci
audit-ci --config audit-ci.json

# Static application security testing (SAST)
npm run security:sast
```

**5. Configuration Validation**
```bash
# Validate environment configurations
npm run validate:config

# Test API endpoints
npm run test:api

# Verify SharePoint permissions
npm run verify:permissions
```

### SharePoint Online Deployment

#### SharePoint Framework Package Deployment

**1. Package Preparation**
```bash
# Build production SharePoint package
npm run clean
npm run build --ship
npm run bundle --ship
npm run package-solution --ship

# Verify package contents
unzip -l sharepoint/solution/uptime-status-platform.sppkg
```

**2. App Catalog Deployment**

**Manual Deployment Process:**
1. **Access App Catalog**: Navigate to SharePoint Admin Center → Apps → App Catalog
2. **Upload Package**: Upload `uptime-status-platform.sppkg` to Apps for SharePoint
3. **Configure Deployment**: 
   - Enable "Make this solution available to all sites in the organization"
   - Configure API permissions if required
4. **Deploy Package**: Click "Deploy" to make the solution available

**PowerShell Deployment Script:**
```powershell
# Connect to SharePoint Online
Connect-PnPOnline -Url "https://company-admin.sharepoint.com" -Interactive

# Upload and deploy app package
Add-PnPApp -Path "./sharepoint/solution/uptime-status-platform.sppkg" -Overwrite -Publish

# Install app to specific site
Install-PnPApp -Identity "uptime-status-platform" -Scope Tenant

# Verify deployment
Get-PnPApp -Identity "uptime-status-platform"
```

**3. Site Collection Deployment**
```powershell
# Connect to target site collection
Connect-PnPOnline -Url "https://company.sharepoint.com/sites/dashboard" -Interactive

# Install app to site
Install-PnPApp -Identity "uptime-status-platform"

# Add web part to page
$page = Get-PnPPage -Identity "Home.aspx"
Add-PnPPageWebPart -Page $page -DefaultWebPartType "UptimeStatusWebPart"
```

#### API Permissions Configuration

**4. Microsoft Graph API Permissions**
```json
// package-solution.json - API permissions
{
  "solution": {
    "webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "User.Read"
      },
      {
        "resource": "Microsoft Graph", 
        "scope": "Team.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "ChannelMessage.Send"
      }
    ]
  }
}
```

**5. Permission Approval Process**
1. **Navigate to API Access**: SharePoint Admin Center → Advanced → API access
2. **Review Pending Requests**: Review all pending API permission requests
3. **Approve Permissions**: Approve necessary permissions for the application
4. **Verify Access**: Test API functionality after permission approval

### Azure Backend Deployment

#### Azure App Service Deployment

**1. Azure Resource Creation**
```bash
# Login to Azure CLI
az login

# Create resource group
az group create --name "rg-uptime-platform-prod" --location "East US"

# Create App Service plan
az appservice plan create \
  --name "asp-uptime-platform" \
  --resource-group "rg-uptime-platform-prod" \
  --sku "P1v2" \
  --is-linux

# Create App Service
az webapp create \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --plan "asp-uptime-platform" \
  --runtime "node|20-lts"
```

**2. Application Configuration**
```bash
# Configure application settings
az webapp config appsettings set \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    API_BASE_URL=https://uptime-platform-api.azurewebsites.net \
    CORS_ORIGINS=https://company.sharepoint.com

# Configure connection strings
az webapp config connection-string set \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=tcp:sql-server.database.windows.net;Database=uptime-platform;User ID=admin;Password=password;Encrypt=true"
```

**3. Deployment Process**
```bash
# Build NestJS application for production
cd server
npm run build

# Create deployment package
zip -r deployment.zip dist/ node_modules/ package.json

# Deploy to Azure App Service
az webapp deployment source config-zip \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --src deployment.zip
```

#### Docker Container Deployment

**4. Containerized Deployment Option**
```dockerfile
# Dockerfile for production deployment
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
USER node

CMD ["npm", "run", "start:prod"]
```

**5. Azure Container Instances Deployment**
```bash
# Build and push Docker image
docker build -t uptime-platform-api:latest .
docker tag uptime-platform-api:latest company.azurecr.io/uptime-platform-api:latest
docker push company.azurecr.io/uptime-platform-api:latest

# Deploy to Azure Container Instances
az container create \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --image "company.azurecr.io/uptime-platform-api:latest" \
  --cpu 2 \
  --memory 4 \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

### Database Configuration

#### Azure SQL Database Setup

**1. Database Creation**
```bash
# Create Azure SQL Server
az sql server create \
  --name "sql-uptime-platform" \
  --resource-group "rg-uptime-platform-prod" \
  --location "East US" \
  --admin-user "sqladmin" \
  --admin-password "SecurePassword123!"

# Create database
az sql db create \
  --name "uptime-platform" \
  --server "sql-uptime-platform" \
  --resource-group "rg-uptime-platform-prod" \
  --service-objective "S2"

# Configure firewall rules
az sql server firewall-rule create \
  --name "AllowAzureServices" \
  --server "sql-uptime-platform" \
  --resource-group "rg-uptime-platform-prod" \
  --start-ip-address "0.0.0.0" \
  --end-ip-address "0.0.0.0"
```

**2. Database Schema Deployment**
```sql
-- database/schema.sql
CREATE TABLE [dbo].[Metrics] (
    [Id] int IDENTITY(1,1) PRIMARY KEY,
    [MetricType] nvarchar(50) NOT NULL,
    [Value] decimal(18,2) NOT NULL,
    [Timestamp] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    [Tags] nvarchar(max) NULL
);

CREATE TABLE [dbo].[SafeEpics] (
    [Id] int IDENTITY(1,1) PRIMARY KEY,
    [EpicId] nvarchar(50) NOT NULL UNIQUE,
    [Name] nvarchar(255) NOT NULL,
    [Completion] decimal(5,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [CreatedDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedDate] datetime2 NOT NULL DEFAULT GETUTCDATE()
);
```

```bash
# Deploy database schema
sqlcmd -S sql-uptime-platform.database.windows.net \
       -d uptime-platform \
       -U sqladmin \
       -P SecurePassword123! \
       -i database/schema.sql
```

### Monitoring and Observability Setup

#### Application Insights Configuration

**1. Application Insights Resource Creation**
```bash
# Create Application Insights resource
az monitor app-insights component create \
  --app "uptime-platform-insights" \
  --resource-group "rg-uptime-platform-prod" \
  --location "East US" \
  --kind "web" \
  --retention-time 90

# Get instrumentation key
az monitor app-insights component show \
  --app "uptime-platform-insights" \
  --resource-group "rg-uptime-platform-prod" \
  --query "instrumentationKey" \
  --output tsv
```

**2. Application Insights Integration**
```typescript
// NestJS Application Insights integration
import { NestFactory } from '@nestjs/core';
import { ApplicationInsights } from 'applicationinsights';

async function bootstrap() {
  // Initialize Application Insights
  ApplicationInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .start();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

#### Health Check Configuration

**3. Health Check Endpoints**
```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('api', 'http://localhost:3000/api'),
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
```

**4. Azure Monitor Alerts**
```bash
# Create availability test
az monitor app-insights web-test create \
  --resource-group "rg-uptime-platform-prod" \
  --app-insights "uptime-platform-insights" \
  --name "api-availability" \
  --url "https://uptime-platform-api.azurewebsites.net/health" \
  --frequency 300 \
  --timeout 30 \
  --locations "us-east-1,us-west-1,europe-west-1"

# Create alert rule for high error rate
az monitor metrics alert create \
  --name "high-error-rate" \
  --resource-group "rg-uptime-platform-prod" \
  --scopes "/subscriptions/sub-id/resourceGroups/rg-uptime-platform-prod/providers/Microsoft.Web/sites/uptime-platform-api" \
  --condition "avg exceptions/server > 10" \
  --window-size 5m \
  --evaluation-frequency 1m
```

### Security Configuration

#### SSL/TLS Configuration

**1. Custom Domain and SSL Certificate**
```bash
# Add custom domain to App Service
az webapp config hostname add \
  --hostname "api.company.com" \
  --webapp-name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod"

# Create managed SSL certificate
az webapp config ssl create \
  --hostname "api.company.com" \
  --webapp-name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod"

# Bind SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint "<thumbprint>" \
  --ssl-type SNI \
  --webapp-name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod"
```

#### Authentication and Authorization

**2. Azure AD Integration**
```bash
# Configure Azure AD authentication
az webapp auth update \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --enabled true \
  --action LoginWithAzureActiveDirectory \
  --aad-client-id "<client-id>" \
  --aad-client-secret "<client-secret>" \
  --aad-allowed-token-audiences "https://api.company.com"
```

**3. API Security Headers**
```typescript
// security.middleware.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function setupSecurity(app: INestApplication) {
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
      }
    }
  }));

  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  }));

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['https://company.sharepoint.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });
}
```

### Post-Deployment Verification

#### Deployment Validation

**1. Functional Testing**
```bash
# API health check
curl -f https://api.company.com/health

# SharePoint web part verification
# Navigate to SharePoint site and verify web part loads correctly

# End-to-end testing
npm run test:e2e:production

# Performance testing
npm run test:performance:production
```

**2. Security Validation**
```bash
# SSL certificate validation
curl -I https://api.company.com

# Security headers check
curl -I https://api.company.com | grep -i security

# Vulnerability scanning
npm run security:scan:production
```

#### Monitoring Configuration

**3. Monitoring Validation**
```bash
# Application Insights telemetry verification
# Check Azure portal for incoming telemetry data

# Alert testing
# Trigger test conditions to verify alert notifications

# Log aggregation verification
# Verify logs are being collected and stored properly
```

### Rollback Procedures

#### Emergency Rollback

**1. SharePoint Package Rollback**
```powershell
# Connect to SharePoint Online
Connect-PnPOnline -Url "https://company-admin.sharepoint.com" -Interactive

# Remove current app version
Uninstall-PnPApp -Identity "uptime-status-platform"

# Deploy previous version
Add-PnPApp -Path "./backup/uptime-status-platform-v1.0.sppkg" -Overwrite -Publish
Install-PnPApp -Identity "uptime-status-platform" -Scope Tenant
```

**2. Azure App Service Rollback**
```bash
# List deployment slots
az webapp deployment slot list \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod"

# Swap back to previous slot
az webapp deployment slot swap \
  --name "uptime-platform-api" \
  --resource-group "rg-uptime-platform-prod" \
  --slot "staging" \
  --target-slot "production"
```

**3. Database Rollback**
```sql
-- Execute rollback script if schema changes were made
-- Restore from backup if necessary
RESTORE DATABASE [uptime-platform] 
FROM DISK = '/backups/uptime-platform-backup.bak'
WITH REPLACE;
```

### Maintenance and Updates

#### Regular Maintenance Tasks

**1. Dependency Updates**
```bash
# Security updates
npm audit fix

# Package updates
npm update

# Rebuild and redeploy
npm run build:prod
npm run deploy:prod
```

**2. Database Maintenance**
```sql
-- Update statistics
UPDATE STATISTICS [dbo].[Metrics];
UPDATE STATISTICS [dbo].[SafeEpics];

-- Reindex tables
ALTER INDEX ALL ON [dbo].[Metrics] REBUILD;
ALTER INDEX ALL ON [dbo].[SafeEpics] REBUILD;
```

**3. Performance Monitoring**
```bash
# Review Application Insights metrics
# Monitor API response times
# Check error rates and exceptions
# Verify resource utilization
```

This comprehensive deployment guide ensures reliable, secure, and scalable deployment of the Enterprise Uptime Status Platform across all environments, with proper monitoring, security configurations, and rollback procedures.
