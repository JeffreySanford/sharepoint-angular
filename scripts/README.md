# Build Scripts

This directory contains utility scripts for managing the SPFx + Angular integration.

## Scripts

### `update-angular-assets.js`

Automatically updates Angular asset references in the SPFx web part after Angular builds.

**Purpose:**
- Angular builds generate files with content-based hashes (e.g., `main.abc123.js`)
- These hashes change with every build, breaking hardcoded references
- This script automatically discovers new hashes and updates the web part code

**Usage:**

```bash
# Build Angular and update asset references automatically
npm run build:angular:update

# Or update manually after an Angular build
npm run update-assets
```

**What it does:**
1. Scans the Angular dist directory for built files
2. Extracts file hashes from filenames
3. Updates the `knownHashes` object in `UptimeStatusWebPart.ts`
4. Updates CSS references in fallback methods
5. Creates an asset manifest for reference

**Generated Files:**
- `dist/angular-asset-manifest.json` - Contains hash information and build timestamp

## Development Workflow

### Standard Development
```bash
npm start  # Starts both API and webpack dev server
```

### After Angular Changes
```bash
# If you modify Angular code and want to update the SPFx integration:
npm run build:angular:update
```

### Production Build
```bash
# Build everything with updated asset references
npm run build:angular:update
npm run build
```

## Asset Discovery System

The web part now uses a multi-tier asset discovery system:

1. **Dynamic Discovery** - Parses Angular's `index.html` to find current assets
2. **Known Hash Fallback** - Uses updated hashes from this script
3. **Static Fallback** - Uses original hardcoded paths as last resort

This ensures the integration works even when:
- Angular rebuilds with new hashes
- Network requests fail
- Files are moved or renamed

## Troubleshooting

### "Angular dist directory not found"
- Run `cd src/webparts/uptimeStatus/angularApp && npm run build` first

### Asset references not updating
- Check that the web part file is not read-only
- Verify the script has proper permissions
- Check console output for specific errors

### Integration still using old files
- Clear browser cache
- Restart the webpack dev server
- Check that the asset manifest was created in `dist/`
