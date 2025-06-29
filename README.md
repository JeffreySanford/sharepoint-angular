# SharePoint Framework + Angular 15 + NestJS Uptime Dashboard

## Summary

A comprehensive SharePoint Framework (SPFx) web part that hosts an Angular 15 application with Material Design 3 and a NestJS API backend. The solution provides uptime monitoring and time endpoints with a modern Material Design 3 interface.

**✅ Node.js v20 LTS Compatible** - Uses modern webpack dev server instead of legacy gulp serve to avoid Node.js compatibility issues.

## Architecture

- **Frontend**: Angular 15 with Material Design 3 (Expressive theme)
- **Backend**: NestJS API server providing uptime and time endpoints
- **Integration**: SPFx web part hosting the Angular app as static assets
- **Development**: Modern webpack dev server with API proxy for local development

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.18.2-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- Node.js v20 LTS

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

- **Node.js v20 LTS** (required for compatibility)
- **npm** or **yarn** package manager
- **SharePoint Framework development environment** set up
- **Modern browser** with ES2015+ support

## Project Structure

```
├── src/
│   ├── webparts/
│   │   └── uptimeStatus/
│   │       ├── UptimeStatusWebPart.ts          # SPFx web part
│   │       ├── UptimeStatusWebPart.module.scss
│   │       ├── UptimeStatusWebPart.manifest.json
│   │       ├── angularApp/                     # Angular 15 app
│   │       │   ├── src/
│   │       │   │   ├── app/
│   │       │   │   │   ├── app.component.ts
│   │       │   │   │   ├── app.component.html
│   │       │   │   │   ├── app.component.scss
│   │       │   │   │   ├── app.module.ts
│   │       │   │   │   └── uptime.service.ts
│   │       │   │   ├── main.ts
│   │       │   │   ├── polyfills.ts
│   │       │   │   ├── styles.scss
│   │       │   │   └── index.html
│   │       │   ├── angular.json
│   │       │   ├── package.json
│   │       │   └── tsconfig.json
│   │       └── loc/
│   └── index.ts
├── server/                                     # NestJS API
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── tsconfig.json
├── config/
├── webpack.dev.js                              # Custom webpack dev config
├── dev-workbench.html                          # Custom workbench
├── package.json                                # Root dependencies
├── gulpfile.js
└── tsconfig.json
```

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd sharepoint
   npm install
   ```

2. **Development Mode**
   ```bash
   npm run start:dev
   ```
   This starts both the NestJS API server and webpack dev server with Angular app.

3. **Open in Browser**
   ```
   http://localhost:4321
   ```

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Available Scripts

### Development Scripts

- **`npm start`** - Start NestJS API + webpack dev server (default modern workflow)
- **`npm run start:dev`** - Same as `npm start` (alternative alias)
- **`npm run start:api`** - Start only the NestJS API server on port 3000
- **`npm run start:spfx:legacy`** - Traditional SPFx gulp serve (has Node.js v20 compatibility issues)
- **`npm run start:spfx:dev`** - Start only the webpack dev server on port 4321

### Build Scripts

- **`npm run build`** - Build both Angular app and SPFx solution
- **`npm run build:angular`** - Build only the Angular application
- **`npm run build:spfx`** - Build only the SPFx web part
- **`npm run package-solution`** - Create SPFx package for deployment

### Testing Scripts

- **`npm run test:angular`** - Run Angular unit tests
- **`npm run test:api`** - Run NestJS unit tests

## API Endpoints

The NestJS API provides the following endpoints:

- **GET `/api/uptime`** - Returns server uptime information
- **GET `/api/time`** - Returns current server time

Example responses:
```json
// GET /api/uptime
{
  "uptime": "2 hours, 34 minutes",
  "uptimeSeconds": 9240,
  "startTime": "2024-01-15T10:30:00.000Z"
}

// GET /api/time
{
  "currentTime": "2024-01-15T13:04:30.000Z",
  "timezone": "UTC",
  "formatted": "1/15/2024, 1:04:30 PM"
}
```

## Development Workflow

### Default Development (Recommended)

Use the modern webpack dev server with API proxy:

```bash
npm start
```

This will:
- Start NestJS API on port 3000
- Start webpack dev server on port 4321
- Proxy `/api/*` requests to the NestJS server
- Auto-reload on file changes
- Serve the custom workbench at `http://localhost:4321`

### Legacy SPFx Development

Use the traditional SPFx gulp serve (has Node.js v20 compatibility issues):

```bash
npm run start:spfx:legacy
```

### Component Development

For API-only development:

```bash
npm run start:api
```

For webpack dev server only (requires API to be running separately):

```bash
npm run start:spfx:dev
```

## Build and Deployment

### Local Build

```bash
npm run build
```

This builds both the Angular app and SPFx web part.

### Create Deployment Package

```bash
npm run package-solution
```

Creates a `.sppkg` file in the `sharepoint/solution` directory that can be deployed to SharePoint Online.

## Troubleshooting

### Node.js v20 Compatibility Issues

If you encounter node-sass or other compatibility issues:

1. Use the modern development workflow (`npm run start:dev`) instead of `gulp serve`
2. Ensure all dependencies are installed with Node.js v20
3. Clear node_modules and reinstall if needed:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Port Conflicts

- NestJS API runs on port 3000
- Webpack dev server runs on port 4321
- Angular dev server runs on port 4200

If you encounter port conflicts, modify the ports in:
- `webpack.dev.js` (webpack dev server)
- `server/src/main.ts` (NestJS API)
- `src/webparts/uptimeStatus/angularApp/angular.json` (Angular dev server)

### API Proxy Issues

If API requests are not being proxied correctly:

1. Check that the NestJS server is running on port 3000
2. Verify proxy configuration in `webpack.dev.js`
3. Check browser network tab for failed requests
4. Ensure API endpoints start with `/api/`

### Build Errors

For TypeScript compilation errors:
```bash
npm run build:angular
npm run build:spfx
```

For dependency issues:
```bash
npm audit fix
npm update
```

## Recent Updates

### ✅ Compilation Issues Resolved (June 27, 2025)

The initial compilation errors related to:
- Missing SPFx dependencies (`resx-strings`, `@ms/sp-telemetry`, etc.)
- Sass deprecation warnings
- TypeScript errors in the web part

**Resolution:**
- Updated webpack configuration with proper fallbacks for missing SPFx modules
- Simplified the SPFx web part to focus on hosting the dashboard
- Removed problematic dependencies while maintaining core functionality
- Both development servers now compile and run successfully

**Current Status:**
- ✅ NestJS API server: Running on port 3000
- ✅ Webpack dev server: Running on port 4321 with API proxy
- ✅ API endpoints accessible via proxy
- ✅ No compilation errors
- ✅ Dashboard interface loads successfully

---

## Features

This solution demonstrates:

- **Modern Angular Integration** - Angular 15 with Material Design 3 in SPFx
- **API Integration** - NestJS backend with clean REST endpoints
- **Development Tooling** - Modern webpack dev server with hot reload
- **Material Design 3** - Expressive theme with modern UI components
- **TypeScript** - Full TypeScript support across all layers
- **Node.js v20 Compatibility** - Modern Node.js LTS support
- **Proxy Configuration** - Seamless API proxying in development
- **Component Architecture** - Modular, reusable Angular components
- **Build Optimization** - Optimized builds for both development and production

## Technical Details

### Angular Material 3 Integration

The Angular app uses Material Design 3 with the Expressive theme:
- Dynamic color system
- Material You design principles
- Responsive layout components
- Accessibility features

### NestJS API Architecture

The API follows NestJS best practices:
- Modular controller structure
- Dependency injection
- TypeScript decorators
- Express.js under the hood

### SPFx Integration

The SharePoint web part:
- Loads Angular app as static assets
- Provides SharePoint context to Angular
- Maintains SPFx lifecycle compatibility
- Supports both modern and classic SharePoint experiences

## References

- [SharePoint Framework Documentation](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/)
- [Angular Material Design 3](https://material.angular.io/)
- [NestJS Documentation](https://nestjs.com/)
- [Node.js v20 LTS](https://nodejs.org/)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)
