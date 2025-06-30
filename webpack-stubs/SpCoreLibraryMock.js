// Mock for @microsoft/sp-core-library

// Version class mock
class Version {
  constructor(version) {
    this.version = version || '1.0.0';
  }
  
  static parse(versionString) {
    return new Version(versionString);
  }
  
  toString() {
    return this.version;
  }
}

// UrlUtilities mock
const UrlUtilities = {
  resolve: (baseUrl, relativeUrl) => {
    if (!baseUrl || !relativeUrl) return relativeUrl || baseUrl || '';
    
    // Simple URL resolution - in a real scenario this would be more complex
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    if (relativeUrl.startsWith('/')) {
      const baseParts = baseUrl.split('/');
      return `${baseParts[0]}//${baseParts[2]}${relativeUrl}`;
    }
    
    return `${baseUrl.replace(/\/$/, '')}/${relativeUrl}`;
  },
  
  removeEndSlash: (url) => {
    return url ? url.replace(/\/$/, '') : url;
  },
  
  isAbsoluteUrl: (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
  }
};

// Text utilities mock
const Text = {
  format: (template, ...args) => {
    if (!template) return '';
    return template.replace(/{(\d+)}/g, (match, index) => {
      const argIndex = parseInt(index, 10);
      return args[argIndex] !== undefined ? args[argIndex] : match;
    });
  }
};

// Log levels
const LogLevel = {
  Verbose: 0,
  Info: 1,
  Warning: 2,
  Error: 3
};

// Logger mock
const Log = {
  verbose: (message, scope) => console.log(`[VERBOSE] ${scope || 'SPFx'}: ${message}`),
  info: (message, scope) => console.info(`[INFO] ${scope || 'SPFx'}: ${message}`),
  warn: (message, scope) => console.warn(`[WARNING] ${scope || 'SPFx'}: ${message}`),
  error: (message, scope) => console.error(`[ERROR] ${scope || 'SPFx'}: ${message}`)
};

// Guid mock
const Guid = {
  newGuid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  empty: '00000000-0000-0000-0000-000000000000',
  
  isValid: (guid) => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  }
};

// Environment type mock
const EnvironmentType = {
  Test: 0,
  Local: 1,
  SharePoint: 2,
  ClassicSharePoint: 3
};

// Export everything
const spCoreLibrary = {
  Version,
  UrlUtilities,
  Text,
  LogLevel,
  Log,
  Guid,
  EnvironmentType
};

module.exports = spCoreLibrary;
module.exports.default = spCoreLibrary;

// Named exports
module.exports.Version = Version;
module.exports.UrlUtilities = UrlUtilities;
module.exports.Text = Text;
module.exports.LogLevel = LogLevel;
module.exports.Log = Log;
module.exports.Guid = Guid;
module.exports.EnvironmentType = EnvironmentType;
