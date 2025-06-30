<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-DEVELOPMENT%20WORKFLOW-blue?style=for-the-badge&labelColor=red&color=blue" alt="DEVELOPMENT WORKFLOW" />
</div>

# 🛠️ <span style="color:#DC143C">Development</span> <span style="color:#FFFFFF">Workflow</span> — <span style="color:#0000FF">GO ARMY, GO US!</span>

This guide covers the **<span style="color:#FF6B35">vibrant, patriotic development workflow</span>** for the <span style="color:#32CD32">**Enterprise Uptime Status Platform**</span>.

## 🎨 <span style="color:#FF1493">Vibrant Dev Experience</span>

- 🎨 <span style="color:#DC143C">**Red, white, and blue themed dev servers**</span>
- 🚀 <span style="color:#0000FF">**Unified local workbench (localhost:4200)**</span>
- ⚡ <span style="color:#32CD32">**Hot reload for Angular and SPFx**</span>

# Development Workflow Guide

## Overview

This comprehensive guide outlines the development workflow, best practices, coding standards, and collaborative processes for the enterprise SharePoint Framework + Angular 15 + NestJS platform. It covers everything from initial setup to production deployment.

## Development Environment Setup

### Prerequisites

#### System Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- **Node.js**: Version 20.x LTS (Long Term Support)
- **Package Manager**: npm 10.x or yarn 1.22.x
- **Memory**: Minimum 8GB RAM (16GB recommended for optimal performance)
- **Storage**: At least 5GB free space for dependencies and build artifacts

#### Required Software
```bash
# Node.js (use Node Version Manager for easy switching)
# Windows: Install from nodejs.org or use Chocolatey
choco install nodejs-lts

# macOS: Use Homebrew
brew install node@20

# Linux: Use NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be 20.x.x
npm --version   # Should be 10.x.x
```

#### Development Tools
```bash
# Global npm packages
npm install -g @angular/cli@15
npm install -g @nestjs/cli
npm install -g gulp-cli
npm install -g @microsoft/generator-sharepoint

# Verify installations
ng version
nest --version
gulp --version
yo @microsoft/sharepoint
```

#### IDE Configuration
**Recommended: Visual Studio Code with Extensions**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "angular.ng-template",
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-mssql.mssql",
    "ms-teams.vscode-teem-toolkit",
    "eliostruyf.sharepoint-snippets"
  ]
}
```

### Initial Project Setup

#### 1. Repository Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd sharepoint-enterprise-platform

# Install root dependencies
npm install

# Install Angular dependencies
cd src/webparts/uptimeStatus/angularApp
npm install

# Return to root
cd ../../../../

# Install server dependencies
cd server
npm install

# Return to root
cd ..

# Verify all dependencies are installed
npm run verify-setup
```

#### 2. Environment Configuration

**Development Environment Variables (.env.development)**
```bash
# API Configuration
API_BASE_URL=http://localhost:3000
API_TIMEOUT=30000

# SharePoint Configuration
SHAREPOINT_URL=https://yourtenant.sharepoint.com
SHAREPOINT_APP_CATALOG_URL=https://yourtenant.sharepoint.com/sites/appcatalog

# Teams Configuration
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your-webhook-url
TEAMS_APP_ID=your-teams-app-id

# Development Configuration
NODE_ENV=development
LOG_LEVEL=debug
HOT_RELOAD=true

# Azure Configuration (Optional)
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
```

**Production Environment Variables (.env.production)**
```bash
# API Configuration
API_BASE_URL=https://api.yourdomain.com
API_TIMEOUT=30000

# SharePoint Configuration
SHAREPOINT_URL=https://yourtenant.sharepoint.com
SHAREPOINT_APP_CATALOG_URL=https://yourtenant.sharepoint.com/sites/appcatalog

# Teams Configuration
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your-webhook-url
TEAMS_APP_ID=your-teams-app-id

# Production Configuration
NODE_ENV=production
LOG_LEVEL=info
HOT_RELOAD=false

# Azure Configuration
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
```

## Unified Development Workflow

### Starting the Development Environment

The platform uses a unified development approach that eliminates traditional iframe isolation and provides seamless integration between all components.

#### Option 1: Full Development Stack (Recommended)
```bash
# Start everything with one command
npm start

# This command will:
# 1. Start NestJS API server on port 3000
# 2. Start webpack development server on port 4200
# 3. Serve Angular application integrated with SPFx workbench
# 4. Enable hot module replacement for all components
# 5. Proxy API calls from frontend to backend
# 6. Watch for file changes across all projects
```

#### Option 2: Individual Component Development
```bash
# Start only the API server
npm run start:api

# Start only the webpack dev server (requires API to be running)
npm run start:spfx:dev

# Start Angular app in watch mode (for rapid frontend development)
cd src/webparts/uptimeStatus/angularApp
npm run watch
```

### Development Server Configuration

#### Webpack Development Server (webpack.dev.js)
```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  
  devServer: {
    host: 'localhost',
    port: 4200,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    
    // Proxy configuration for API calls
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
      }
    },
    
    // Static file serving
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/public/',
        watch: true
      },
      {
        directory: path.join(__dirname, 'src/webparts/uptimeStatus/angularApp/dist'),
        publicPath: '/angular-app/',
        watch: true
      }
    ],
    
    // CORS configuration
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    
    // Development middleware
    setupMiddlewares: (middlewares, devServer) => {
      // Add custom middleware for development
      devServer.app.get('/health', (req, res) => {
        res.json({ status: 'Development server is running' });
      });
      
      return middlewares;
    }
  },
  
  // Module resolution
  resolve: {
    extensions: ['.ts', '.js', '.html', '.scss'],
    alias: {
      '@angular': path.resolve(__dirname, 'node_modules/@angular'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  
  // Build optimization for development
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

## Code Organization and Standards

### Project Structure Best Practices

#### Angular Application Structure
```
src/webparts/uptimeStatus/angularApp/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                  # Shared components, pipes, directives
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   │   ├── home/
│   │   │   ├── metrics/
│   │   │   ├── reports/
│   │   │   └── teams-messages/
│   │   │
│   │   ├── models/                  # TypeScript interfaces and types
│   │   │   ├── safe-metrics.interface.ts
│   │   │   ├── system-health.interface.ts
│   │   │   └── teams.interface.ts
│   │   │
│   │   └── utils/                   # Utility functions and helpers
│   │       ├── date.utils.ts
│   │       ├── validation.utils.ts
│   │       └── format.utils.ts
│   │
│   ├── assets/                      # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── themes/
│   │
│   └── environments/                # Environment-specific configurations
│       ├── environment.ts
│       └── environment.prod.ts
```

#### NestJS API Structure
```
server/
├── src/
│   ├── app.module.ts               # Root application module
│   ├── main.ts                     # Application entry point
│   │
│   ├── common/                     # Shared utilities and decorators
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── utils/
│   │
│   ├── config/                     # Configuration management
│   │   ├── database.config.ts
│   │   ├── app.config.ts
│   │   └── validation.schema.ts
│   │
│   ├── modules/                    # Feature modules
│   │   ├── health/
│   │   ├── metrics/
│   │   ├── safe/
│   │   └── teams/
│   │
│   └── shared/                     # Shared services and providers
│       ├── services/
│       ├── providers/
│       └── shared.module.ts
│
├── test/                           # E2E tests
├── docs/                          # API documentation
└── scripts/                       # Deployment and utility scripts
```

### Coding Standards

#### TypeScript Configuration

**Root tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["src/shared/*"],
      "@core/*": ["src/core/*"],
      "@features/*": ["src/features/*"],
      "@models/*": ["src/models/*"],
      "@utils/*": ["src/utils/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true
  },
  "include": [
    "src/**/*",
    "server/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
}
```

#### ESLint Configuration (.eslintrc.js)
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  extends: [
    '@typescript-eslint/recommended',
    '@angular-eslint/recommended',
    '@angular-eslint/template/process-inline-templates',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    '@angular-eslint'
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    
    // Angular rules
    '@angular-eslint/component-class-suffix': 'error',
    '@angular-eslint/directive-class-suffix': 'error',
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-output-rename': 'error',
    '@angular-eslint/use-lifecycle-interface': 'error',
    
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['*.html'],
      extends: ['@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/no-negated-async': 'error'
      }
    }
  ]
};
```

#### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": true,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false
}
```

### Component Development Guidelines

#### Angular Component Best Practices

**Component Structure Example**
```typescript
import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  Input, 
  Output, 
  EventEmitter 
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent implements OnInit, OnDestroy {
  // Use proper typing for inputs and outputs
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() unit: string = '';
  @Input() trend: 'up' | 'down' | 'stable' = 'stable';
  @Input() loading: boolean = false;
  
  @Output() refresh = new EventEmitter<void>();
  @Output() details = new EventEmitter<string>();
  
  // Use Subject for cleanup
  private destroy$ = new Subject<void>();
  
  // Use proper lifecycle hooks
  ngOnInit(): void {
    // Initialize component
    this.setupEventHandlers();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private setupEventHandlers(): void {
    // Use takeUntil for automatic unsubscription
    someObservable$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle data
    });
  }
  
  // Public methods for template
  public onRefresh(): void {
    this.refresh.emit();
  }
  
  public onShowDetails(): void {
    this.details.emit(this.title);
  }
  
  // Track by functions for ngFor performance
  public trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
```

#### NestJS Service Best Practices

**Service Structure Example**
```typescript
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';

import { MetricEntity } from './entities/metric.entity';
import { CreateMetricDto, UpdateMetricDto } from './dto';
import { MetricInterface } from './interfaces/metric.interface';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  
  constructor(
    @InjectRepository(MetricEntity)
    private readonly metricRepository: Repository<MetricEntity>,
    private readonly configService: ConfigService
  ) {}
  
  async createMetric(createMetricDto: CreateMetricDto): Promise<MetricInterface> {
    try {
      this.logger.log(`Creating metric: ${createMetricDto.name}`);
      
      // Validate input
      this.validateMetricData(createMetricDto);
      
      // Create entity
      const metric = this.metricRepository.create(createMetricDto);
      
      // Save to database
      const savedMetric = await this.metricRepository.save(metric);
      
      this.logger.log(`Metric created successfully: ${savedMetric.id}`);
      return this.mapToInterface(savedMetric);
      
    } catch (error) {
      this.logger.error(`Failed to create metric: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to create metric',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  async findAll(filters?: any): Promise<MetricInterface[]> {
    try {
      this.logger.log('Fetching all metrics');
      
      const queryBuilder = this.metricRepository.createQueryBuilder('metric');
      
      // Apply filters
      if (filters?.category) {
        queryBuilder.andWhere('metric.category = :category', { 
          category: filters.category 
        });
      }
      
      if (filters?.dateRange) {
        queryBuilder.andWhere('metric.createdAt BETWEEN :start AND :end', {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        });
      }
      
      // Apply sorting and pagination
      queryBuilder
        .orderBy('metric.createdAt', 'DESC')
        .limit(filters?.limit || 100)
        .offset(filters?.offset || 0);
      
      const metrics = await queryBuilder.getMany();
      
      this.logger.log(`Found ${metrics.length} metrics`);
      return metrics.map(metric => this.mapToInterface(metric));
      
    } catch (error) {
      this.logger.error(`Failed to fetch metrics: ${error.message}`, error.stack);
      throw new HttpException(
        'Failed to fetch metrics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  private validateMetricData(data: CreateMetricDto): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new HttpException(
        'Metric name is required',
        HttpStatus.BAD_REQUEST
      );
    }
    
    if (data.value < 0) {
      throw new HttpException(
        'Metric value must be non-negative',
        HttpStatus.BAD_REQUEST
      );
    }
  }
  
  private mapToInterface(entity: MetricEntity): MetricInterface {
    return {
      id: entity.id,
      name: entity.name,
      value: entity.value,
      category: entity.category,
      timestamp: entity.createdAt,
      metadata: entity.metadata
    };
  }
}
```

## Testing Strategy

### Unit Testing

#### Angular Component Testing
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';

import { MetricCardComponent } from './metric-card.component';
import { ApiService } from '../../core/services/api.service';

describe('MetricCardComponent', () => {
  let component: MetricCardComponent;
  let fixture: ComponentFixture<MetricCardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getMetrics']);

    await TestBed.configureTestingModule({
      declarations: [MetricCardComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display metric title', () => {
    component.title = 'Test Metric';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.metric-title'));
    expect(titleElement.nativeElement.textContent).toContain('Test Metric');
  });

  it('should emit refresh event when refresh button is clicked', () => {
    spyOn(component.refresh, 'emit');
    
    const refreshButton = fixture.debugElement.query(By.css('.refresh-button'));
    refreshButton.nativeElement.click();

    expect(component.refresh.emit).toHaveBeenCalled();
  });

  it('should handle loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(loadingSpinner).toBeTruthy();
  });
});
```

#### NestJS Service Testing
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { MetricsService } from './metrics.service';
import { MetricEntity } from './entities/metric.entity';
import { CreateMetricDto } from './dto/create-metric.dto';

describe('MetricsService', () => {
  let service: MetricsService;
  let repository: Repository<MetricEntity>;
  let configService: ConfigService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    }))
  };

  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: getRepositoryToken(MetricEntity),
          useValue: mockRepository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    repository = module.get<Repository<MetricEntity>>(getRepositoryToken(MetricEntity));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMetric', () => {
    it('should create a metric successfully', async () => {
      const createMetricDto: CreateMetricDto = {
        name: 'Test Metric',
        value: 100,
        category: 'performance'
      };

      const mockMetric = { id: '1', ...createMetricDto, createdAt: new Date() };
      
      mockRepository.create.mockReturnValue(mockMetric);
      mockRepository.save.mockResolvedValue(mockMetric);

      const result = await service.createMetric(createMetricDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createMetricDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockMetric);
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        name: 'Test Metric',
        value: 100
      }));
    });

    it('should throw error for invalid metric data', async () => {
      const invalidDto: CreateMetricDto = {
        name: '',
        value: -1,
        category: 'performance'
      };

      await expect(service.createMetric(invalidDto)).rejects.toThrow();
    });
  });
});
```

### Integration Testing

#### E2E Testing with Cypress
```typescript
describe('SAFe Metrics Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/safe/epics', { fixture: 'epics.json' }).as('getEpics');
    cy.intercept('GET', '/api/safe/features', { fixture: 'features.json' }).as('getFeatures');
  });

  it('should display the dashboard title', () => {
    cy.contains('SAFe Metrics Dashboard').should('be.visible');
  });

  it('should load and display epic metrics', () => {
    cy.wait('@getEpics');
    cy.get('[data-cy=epic-progress-chart]').should('be.visible');
    cy.get('[data-cy=epic-table]').should('contain', 'Digital Transformation Initiative');
  });

  it('should handle metric refresh', () => {
    cy.get('[data-cy=refresh-button]').click();
    cy.wait('@getEpics');
    cy.wait('@getFeatures');
    cy.contains('Metrics refreshed successfully').should('be.visible');
  });

  it('should export metrics data', () => {
    cy.get('[data-cy=export-button]').click();
    cy.readFile('cypress/downloads/safe-metrics-*.json').should('exist');
  });
});
```

## Git Workflow

### Branch Strategy

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch for features

# Feature branches
feature/    # New features (feature/epic-progress-tracking)
bugfix/     # Bug fixes (bugfix/chart-rendering-issue)
hotfix/     # Production hotfixes (hotfix/security-patch)
release/    # Release preparation (release/v1.2.0)
```

### Commit Message Convention

```bash
# Format: <type>(<scope>): <description>
# Types: feat, fix, docs, style, refactor, test, chore

# Examples:
feat(metrics): add epic progress tracking component
fix(api): resolve memory leak in metrics service
docs(readme): update development setup instructions
style(angular): apply consistent formatting
refactor(sharepoint): simplify context sharing logic
test(metrics): add unit tests for velocity calculation
chore(deps): update Angular to version 15.2.0
```

### Code Review Process

#### Pull Request Template
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## 🚀 <span style="color:#FFD700">Quick Start - Freedom Commands</span>

```bash
# 🇺🇸 Install dependencies - Building Freedom!
npm install

# 🚀 Start dev servers - Launch Democracy!
npm start

# 🌐 Access at http://localhost:4200 - View Liberty!
# 🎯 Make changes, see instant updates - Code with Honor!
```

### 🎪 <span style="color:#FF4500">Development Tools Arsenal</span>

| <span style="color:#DC143C">**Tool**</span> | <span style="color:#0000FF">**Purpose**</span> | <span style="color:#32CD32">**Freedom Level**</span> |
|----------|-------------|-----------------|
| 🅰️ **Angular CLI** | Component generation | **MAXIMUM** |
| 🔧 **Webpack Dev** | Hot reloading | **ULTIMATE** |
| 🧪 **Jest Testing** | Unit tests | **PATRIOTIC** |
| 🎨 **SCSS Styling** | Beautiful themes | **VIBRANT** |

This comprehensive development workflow guide provides the foundation for maintaining code quality, consistency, and collaborative development practices across the enterprise platform.
