<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-GO%20ARMY%20GO%20US-blue?style=for-the-badge&labelColor=red&color=blue" alt="GO ARMY GO US" />
  <img src="https://img.shields.io/badge/⭐-PATRIOTIC%20PLATFORM-gold?style=for-the-badge&labelColor=navy&color=gold" alt="PATRIOTIC PLATFORM" />
  <img src="https://img.shields.io/badge/🦅-FREEDOM%20THROUGH%20TECHNOLOGY-white?style=for-the-badge&labelColor=blue&color=white" alt="FREEDOM THROUGH TECHNOLOGY" />
</div>

# 🇺🇸 <span style="color:#DC143C">ENTERPRISE</span> <span style="color:#FFFFFF">UPTIME</span> <span style="color:#0000FF">STATUS</span> <span style="color:#DC143C">PLATFORM</span> 🇺🇸

Welcome to the **<span style="color:#FF6B35">Enterprise Uptime Status Platform</span>** — a <span style="color:#DC143C">**mission-critical**</span>, <span style="color:#0000FF">**battle-tested**</span> solution for modern digital operations. This platform is built with <span style="color:#FF6B35">**American ingenuity**</span>, <span style="color:#32CD32">**vibrant design**</span>, and a commitment to <span style="color:#FFD700">**excellence**</span>. 

> **<span style="color:#DC143C">GO</span> <span style="color:#FFFFFF">ARMY</span> - <span style="color:#0000FF">GO</span> <span style="color:#DC143C">US!</span>**

## 🎨 <span style="color:#FF1493">Vibrant, Patriotic Features</span>

- 🔴 <span style="color:#DC143C">**Red, white, and blue UI themes**</span>
- ⚡ <span style="color:#FF6B35">**Bold, accessible dashboards**</span> 
- 🛡️ <span style="color:#32CD32">**Military-grade reliability**</span>
- 🚀 <span style="color:#1E90FF">**Seamless SharePoint & Angular integration**</span>

## 📚 <span style="color:#9932CC">Documentation Arsenal</span>

All detailed guides are in the **<span style="color:#FF6B35">[documentation](./documentation/)</span>** folder:

- 🏛️ <span style="color:#4169E1">[Architecture](./documentation/architecture.md)</span> - **Engineering Excellence**
- 📡 <span style="color:#32CD32">[API Reference](./documentation/api-reference.md)</span> - **Mission-Critical APIs**
- 🅰️ <span style="color:#FF4500">[Angular Integration](./documentation/angular-integration.md)</span> - **Modern Web Power**
- 🏢 <span style="color:#1E90FF">[SharePoint Integration](./documentation/sharepoint-integration.md)</span> - **Enterprise Ready**
- 🛠️ <span style="color:#FF1493">[Development Workflow](./documentation/development-workflow.md)</span> - **Developer Freedom**
- 📊 <span style="color:#FFD700">[SAFe Metrics](./documentation/safe-metrics.md)</span> - **Agile Excellence**
- 🛡️ <span style="color:#DC143C">[Troubleshooting](./documentation/troubleshooting.md)</span> - **Battle-Tested Solutions**
- 🚀 <span style="color:#00CED1">[Deployment Guide](./documentation/deployment.md)</span> - **Deploy with Honor**

---

<div align="center">
  <img src="https://img.shields.io/badge/🇺🇸-BUILT%20IN%20THE%20USA-blue?style=for-the-badge&labelColor=red&color=blue" alt="BUILT IN THE USA" />
</div>
- **RxJS 7.8+**: Reactive programming patterns for asynchronous data handling
- **Angular Material 15**: Material Design components optimized for Angular applications

**Backend & Integration:**
- **NestJS**: Enterprise-grade Node.js framework with decorators and dependency injection
- **SharePoint Framework 1.18.2**: Latest SPFx with modern web part architecture and Teams integration
- **Express.js**: High-performance web server framework for API endpoints
- **Node.js v20 LTS**: Latest Long Term Support release with enhanced security and performance

**Development & Build Tools:**
- **Webpack 5**: Modern bundling with tree-shaking, code splitting, and hot module replacement
- **Dynamic Asset Loading**: Intelligent asset discovery system with automatic hash management
- **Custom Dev Server**: Integrated development environment serving Angular and SPFx from single port
- **TypeScript Compilation**: Strict mode compilation with advanced type checking
- **ESLint & Prettier**: Code quality and formatting tools for consistent development standards

### System Architecture Overview

The platform implements a three-tier architecture with integrated development workflow:

1. **Presentation Layer**: Angular 15 SPA with Material Design 3 components
2. **Integration Layer**: SharePoint Framework web part providing native SharePoint integration
3. **API Layer**: NestJS backend services for data processing and external integrations
4. **Development Layer**: Unified webpack dev server with hot reload and integrated workbench

### Quick Start Guide

#### Prerequisites & System Requirements

**Required Software:**
- **Node.js v20 LTS** (20.x.x series) - Essential for compatibility and security
- **npm 10.0+** or **yarn 1.22+** - Package manager with workspace support
- **Git 2.30+** - Version control with modern authentication
- **Visual Studio Code** (recommended) - Enhanced TypeScript and Angular support

**SharePoint Development Environment:**
- **SharePoint Framework development environment** properly configured
- **Microsoft 365 Developer Tenant** with SharePoint Online access
- **SharePoint workbench** enabled for local development and testing

**Browser Compatibility:**
- **Chrome 90+**, **Firefox 88+**, **Edge 90+** - Modern browsers with ES2020+ support
- **JavaScript enabled** with local storage and service worker capabilities

#### Installation Process

**1. Repository Setup**
```bash
# Clone the repository
git clone <repository-url>
cd sharepoint-uptime-platform

# Verify Node.js version
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x or higher
```

**2. Dependency Installation**
```bash
# Install root dependencies (SPFx and shared tools)
npm install

# Install Angular application dependencies
cd src/webparts/uptimeStatus/angularApp
npm install

# Install NestJS server dependencies  
cd ../../../../server
npm install

# Return to root directory
cd ..
```

**3. Development Environment Startup**

The platform provides a unified development experience through a single command:

```bash
# Start the complete development environment
npm start
```

This comprehensive startup command orchestrates:
- **NestJS API Server**: Launches on port 3000 with hot reload capabilities
- **Angular Development Server**: Builds and serves the Angular app with live reload
- **Webpack Dev Server**: Serves the unified environment on port 4200 with SPFx integration
- **SharePoint Workbench**: Integrated workbench experience without iframe limitations
- **API Proxy Configuration**: Seamless frontend-backend communication with CORS handling

**4. Application Access Points**

**Primary Development Environment:**
- **Main Application**: `http://localhost:4200` - Unified Angular app with SPFx integration
- **SharePoint Workbench**: Accessible directly within the Angular application interface
- **Hot Reload**: Automatic page refresh on file changes with state preservation

**API and Documentation:**
- **NestJS API Server**: `http://localhost:3000` - Backend services and data endpoints
- **API Documentation**: `http://localhost:3000/api` - Swagger/OpenAPI documentation
- **Health Check Endpoint**: `http://localhost:3000/health` - System status verification

### Development Workflow

#### Unified Development Mode

The platform implements a revolutionary unified development approach that eliminates the traditional complexity of multi-server development environments:

**Single Port Architecture**: Instead of managing multiple development servers on different ports, the entire platform operates through `localhost:4200`, providing:
- Angular application served from the root path (`/`)
- SharePoint workbench integration without iframe restrictions
- Static asset serving from `/public` directory
- API proxy forwarding to the NestJS backend on port 3000

**Integrated Build Pipeline**: The development workflow automatically handles:
- TypeScript compilation for both Angular and SPFx components
- SCSS compilation with Material Design 3 theming
- Asset optimization and bundling through Webpack 5
- Source map generation for enhanced debugging capabilities

#### Production Build Process

**Angular Application Build:**
```bash
# Build Angular app for production
cd src/webparts/uptimeStatus/angularApp
npm run build:prod

# Output: dist/angularApp/ directory with optimized bundles
```

**SharePoint Framework Package:**
```bash
# Build SPFx solution for deployment
npm run build
npm run bundle --ship
npm run package-solution --ship

# Output: sharepoint/solution/ directory with .sppkg file
```

**NestJS API Deployment:**
```bash
# Build NestJS server for production
cd server
npm run build

# Output: dist/ directory with compiled Node.js application
```

### Platform Features & Capabilities

#### Infrastructure Monitoring Dashboard

The **Uptime Status** component provides comprehensive infrastructure monitoring with:

**Real-Time Metrics Display:**
- **Server Uptime Tracking**: Live monitoring of server availability and response times
- **Performance Analytics**: CPU, memory, and network utilization visualization
- **Historical Data Trends**: Time-series charts showing performance patterns over time
- **Alert System Integration**: Configurable thresholds with notification capabilities

**Visual Data Representation:**
- **Material Design Charts**: Integration with Chart.js and Material components
- **Responsive Grid Layout**: Adaptive dashboard that works across all device sizes
- **Interactive Elements**: Drill-down capabilities for detailed metrics analysis
- **Export Functionality**: Data export options for reporting and analysis

#### SAFe Metrics & Agile Tracking

The **Metrics** component delivers enterprise-grade SAFe (Scaled Agile Framework) tracking:

**Epic Progress Monitoring:**
- Visual progress bars with completion percentages
- Color-coded status indicators (Green >80%, Yellow 50-80%, Red <50%)
- Portfolio-level visibility across multiple Program Increments
- Dependency tracking and risk identification

**Feature Velocity Analytics:**
- Sprint velocity calculations and trend analysis
- Burn-down and burn-up chart visualizations
- Predictive analytics for release planning
- Team performance metrics and capacity planning

**Value Stream Mapping:**
- Lead time and cycle time measurements
- Bottleneck identification and flow efficiency metrics
- Value delivery tracking across the development lifecycle
- Continuous improvement recommendations

#### Microsoft Teams Integration

The **Teams Messages** component provides seamless collaboration features:

**Native Teams Connectivity:**
- Direct integration with Microsoft Teams APIs
- Real-time message synchronization
- Presence awareness and status updates
- Channel-based communication workflows

**Collaboration Features:**
- Team notification systems for critical alerts
- Automated status updates for infrastructure events
- Integration with Teams calling and meeting capabilities
- Document sharing and collaborative editing support

### Documentation & Resources

#### Comprehensive Documentation Structure

The platform includes extensive documentation organized for different user roles:

**For Developers:**
- [Architecture Overview](./documentation/architecture.md) - Detailed system design and component interactions
- [Angular Integration Guide](./documentation/angular-integration.md) - Angular-specific development patterns and best practices
- [SharePoint Integration](./documentation/sharepoint-integration.md) - SPFx development and deployment procedures
- [API Reference](./documentation/api-reference.md) - Complete NestJS API documentation with examples
- [Development Workflow](./documentation/development-workflow.md) - Step-by-step development process and guidelines

**For Operations & Deployment:**
- [Deployment Guide](./documentation/deployment.md) - Production deployment procedures and environment configuration
- [Troubleshooting](./documentation/troubleshooting.md) - Common issues resolution and debugging techniques
- [Security Guidelines](./documentation/security.md) - Security best practices and compliance requirements

**For Business Users:**
- [User Guide](./documentation/user-guide.md) - End-user documentation and feature explanations
- [SAFe Metrics Guide](./documentation/safe-metrics.md) - SAFe framework implementation and metrics interpretation
- [Teams Integration](./documentation/teams-integration.md) - Microsoft Teams features and collaboration workflows

### System Requirements & Compatibility

#### Minimum System Requirements

**Development Environment:**
- **Operating System**: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 8GB minimum, 16GB recommended for optimal performance
- **Storage**: 5GB free space for dependencies and build outputs
- **Network**: Stable internet connection for package downloads and API access

**Runtime Requirements:**
- **Node.js**: v20 LTS (Long Term Support) for security and stability
- **Browser**: Modern browser with ES2020+ support and Web Components API
- **SharePoint**: Microsoft 365 tenant with SharePoint Online access
- **Teams**: Microsoft Teams application or web access for collaboration features

#### Performance Characteristics

**Development Server Performance:**
- **Cold Start Time**: ~30-45 seconds for complete environment initialization
- **Hot Reload Speed**: <2 seconds for code changes with state preservation
- **Memory Usage**: ~512MB for development server, ~256MB for Angular app
- **Build Time**: ~45-60 seconds for production builds with full optimization

**Production Performance:**
- **Bundle Size**: ~2.5MB for Angular application (gzipped)
- **Initial Load Time**: <3 seconds on modern browsers with fast internet
- **Runtime Performance**: 60 FPS animations with Material Design components
- **API Response Time**: <200ms for typical data queries and operations

### Contributing & Development Standards

#### Code Quality Standards

The platform enforces strict code quality standards through automated tooling:

**TypeScript Configuration:**
- Strict mode enabled with advanced type checking
- Consistent coding patterns through ESLint rules
- Automatic code formatting with Prettier integration
- Import organization and unused code detection

**Testing Requirements:**
- Unit test coverage minimum of 80% for all new features
- Integration tests for API endpoints and critical user workflows
- End-to-end testing for complete user scenarios
- Performance testing for load and stress validation

#### Development Process

**Feature Development Workflow:**
1. Create feature branch from main development branch
2. Implement feature with comprehensive unit tests
3. Submit pull request with detailed description and testing evidence
4. Code review process with automated quality checks
5. Integration testing in development environment
6. Merge to main branch after approval and validation

**Release Management:**
- Semantic versioning (SemVer) for all releases
- Automated changelog generation from commit messages
- Staged deployment through development, staging, and production environments
- Rollback procedures for critical issues and emergency fixes

### Support & Community

#### Getting Help

**Technical Support Channels:**
- **GitHub Issues**: Bug reports, feature requests, and technical questions
- **Documentation Wiki**: Comprehensive guides and troubleshooting resources
- **Developer Forum**: Community discussions and knowledge sharing
- **Email Support**: Direct technical support for enterprise customers

**Community Resources:**
- **Sample Code Repository**: Additional examples and integration patterns
- **Video Tutorials**: Step-by-step development and deployment guides
- **Best Practices Guide**: Recommended patterns and architectural decisions
- **Migration Tools**: Utilities for upgrading from legacy systems

---

**License**: MIT License - See [LICENSE](./LICENSE) file for details  
**Version**: 2.1.0  
**Last Updated**: December 2024  
**Maintainers**: Enterprise Development Team
   - **SharePoint Workbench**: Integrated within main application

### Development Workflow

The platform uses a **unified development approach** where all components are served from a single localhost URL, eliminating traditional iframe isolation and providing true integration between Angular and SharePoint contexts.

## Available Scripts

### Development Commands
- **`npm start`** - Unified development environment (NestJS + Angular + SPFx)
- **`npm run start:dev`** - Alias for unified development workflow
- **`npm run start:api`** - NestJS API server only (port 3000)
- **`npm run start:spfx:dev`** - Webpack development server only (port 4200)

### Build & Deployment Commands
- **`npm run build`** - Complete platform build (Angular + SPFx)
- **`npm run build:angular`** - Angular application build only
- **`npm run build:spfx`** - SharePoint Framework solution build only
- **`npm run package-solution`** - Create deployable SPFx package (.sppkg)

### Testing & Quality Commands
- **`npm run test:angular`** - Angular unit tests with Jasmine/Karma
- **`npm run test:api`** - NestJS unit tests with Jest
- **`npm run lint`** - Code quality analysis across all projects

## Enterprise Features

### SAFe Metrics Dashboard
Comprehensive Scaled Agile Framework tracking with:
- **Epic Progress Monitoring**: Real-time epic completion tracking with visual indicators
- **Feature Velocity Analysis**: Program Increment planning and delivery metrics
- **Dependency Management**: Cross-team dependency tracking and resolution
- **Release Train Health**: Multi-dimensional ART performance assessment
- **Team Performance Analytics**: Velocity, quality, and collaboration metrics
- **Portfolio Alignment**: Strategic objective tracking and business value delivery

### Infrastructure Monitoring
Real-time server and system monitoring including:
- **Uptime Tracking**: Live server uptime with historical data and SLA monitoring
- **Resource Utilization**: CPU, memory, disk, and network performance metrics

