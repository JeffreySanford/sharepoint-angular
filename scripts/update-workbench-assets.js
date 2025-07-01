const fs = require('fs');
const path = require('path');

// Paths
const angularDistPath = path.join(__dirname, '../src/webparts/uptimeStatus/angularApp/dist/angularApp');
const workbenchHtmlPath = path.join(__dirname, '../src/integrated-workbench.html');

// Function to get actual filenames from Angular dist
function getAngularAssets() {
  try {
    const files = fs.readdirSync(angularDistPath);
    
    const assets = {
      styles: files.find(f => f.startsWith('styles.') && f.endsWith('.css')),
      runtime: files.find(f => f.startsWith('runtime.') && f.endsWith('.js')),
      polyfills: files.find(f => f.startsWith('polyfills.') && f.endsWith('.js')),
      main: files.find(f => f.startsWith('main.') && f.endsWith('.js'))
    };
    
    console.log('Found Angular assets:', assets);
    return assets;
  } catch (error) {
    console.error('Error reading Angular dist directory:', error);
    return null;
  }
}

// Function to update the HTML file
function updateWorkbenchHtml(assets) {
  try {
    let html = fs.readFileSync(workbenchHtmlPath, 'utf8');
    
    // Update CSS reference (handle both with and without hashes)
    if (assets.styles) {
      html = html.replace(
        /<link rel="stylesheet" href="\/styles(\..*?)?\.css">/,
        `<link rel="stylesheet" href="/${assets.styles}">`
      );
    }
    
    // Update JS references (handle both with and without hashes)
    if (assets.runtime) {
      html = html.replace(
        /<script src="\/runtime(\..*?)?\.js"><\/script>/,
        `<script src="/${assets.runtime}"></script>`
      );
    }
    
    if (assets.polyfills) {
      html = html.replace(
        /<script src="\/polyfills(\..*?)?\.js"><\/script>/,
        `<script src="/${assets.polyfills}"></script>`
      );
    }
    
    if (assets.main) {
      html = html.replace(
        /<script src="\/main(\..*?)?\.js"><\/script>/,
        `<script src="/${assets.main}"></script>`
      );
    }
    
    fs.writeFileSync(workbenchHtmlPath, html);
    console.log('✅ Updated workbench HTML with latest Angular assets');
    
  } catch (error) {
    console.error('Error updating workbench HTML:', error);
  }
}

// Main execution
console.log('🔄 Updating workbench with latest Angular assets...');
const assets = getAngularAssets();

if (assets && Object.values(assets).every(asset => asset)) {
  updateWorkbenchHtml(assets);
} else {
  console.error('❌ Could not find all required Angular assets');
  console.log('Make sure to run "npm run build:angular" first');
}
