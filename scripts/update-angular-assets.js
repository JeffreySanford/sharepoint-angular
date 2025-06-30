#!/usr/bin/env node

/**
 * Script to update Angular asset references after build
 * This helps maintain the dynamic asset loading system
 */

const fs = require('fs');
const path = require('path');

// Paths
const angularDistPath = path.join(__dirname, '../src/webparts/uptimeStatus/angularApp/dist/angularApp');
const webPartPath = path.join(__dirname, '../src/webparts/uptimeStatus/UptimeStatusWebPart.ts');

function updateAngularAssetReferences() {
  console.log('🔄 Updating Angular asset references...');
  
  try {
    // Check if Angular dist exists
    if (!fs.existsSync(angularDistPath)) {
      console.log('⚠️ Angular dist directory not found. Build Angular first with: cd src/webparts/uptimeStatus/angularApp && npm run build');
      return;
    }
    
    // Read the Angular dist directory
    const files = fs.readdirSync(angularDistPath);
    console.log('📁 Found files:', files);
    
    // Extract file hashes
    const assetHashes = {
      runtime: null,
      polyfills: null,
      main: null,
      styles: null
    };
    
    files.forEach(file => {
      if (file.startsWith('runtime.') && file.endsWith('.js')) {
        assetHashes.runtime = file.match(/runtime\.([a-f0-9]+)\.js/)?.[1];
      } else if (file.startsWith('polyfills.') && file.endsWith('.js')) {
        assetHashes.polyfills = file.match(/polyfills\.([a-f0-9]+)\.js/)?.[1];
      } else if (file.startsWith('main.') && file.endsWith('.js')) {
        assetHashes.main = file.match(/main\.([a-f0-9]+)\.js/)?.[1];
      } else if (file.startsWith('styles.') && file.endsWith('.css')) {
        assetHashes.styles = file.match(/styles\.([a-f0-9]+)\.css/)?.[1];
      }
    });
    
    console.log('🔍 Extracted hashes:', assetHashes);
    
    // Read the web part file
    let webPartContent = fs.readFileSync(webPartPath, 'utf8');
    
    // Update the known hashes in the discoverAngularFilesFromDirectory method
    if (assetHashes.runtime || assetHashes.polyfills || assetHashes.main) {
      const knownHashesRegex = /const knownHashes = \{[\s\S]*?\};/;
      const newKnownHashes = `const knownHashes = {
        runtime: '${assetHashes.runtime || '9b4bceb37d0dc2b9'}',
        polyfills: '${assetHashes.polyfills || '80fc3bd2f7d6428c'}',
        main: '${assetHashes.main || '689f4f7577df83b7'}'
      };`;
      
      if (knownHashesRegex.test(webPartContent)) {
        webPartContent = webPartContent.replace(knownHashesRegex, newKnownHashes);
        console.log('✅ Updated known hashes in web part file');
      }
    }
    
    // Update CSS hash in fallback method
    if (assetHashes.styles) {
      const cssHashRegex = /styles\.[a-f0-9]+\.css/g;
      webPartContent = webPartContent.replace(cssHashRegex, `styles.${assetHashes.styles}.css`);
      console.log('✅ Updated CSS hash in web part file');
    }
    
    // Write the updated web part file
    fs.writeFileSync(webPartPath, webPartContent, 'utf8');
    console.log('✅ Angular asset references updated successfully!');
    
    // Create a manifest file for reference
    const manifestPath = path.join(__dirname, '../dist/angular-asset-manifest.json');
    const manifestDir = path.dirname(manifestPath);
    if (!fs.existsSync(manifestDir)) {
      fs.mkdirSync(manifestDir, { recursive: true });
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      hashes: assetHashes,
      files: files.filter(f => f.endsWith('.js') || f.endsWith('.css'))
    }, null, 2));
    
    console.log('📄 Created asset manifest at:', manifestPath);
    
  } catch (error) {
    console.error('❌ Error updating Angular asset references:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateAngularAssetReferences();
}

module.exports = { updateAngularAssetReferences };
