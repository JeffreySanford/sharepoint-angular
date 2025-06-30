// Mock for @microsoft/sp-webpart-base

// Ensure proper prototype chain for ES6 class inheritance
function BaseClientSideWebPart() {
  // Initialize properties
  Object.defineProperty(this, 'properties', {
    value: {},
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  Object.defineProperty(this, 'context', {
    value: {
      instanceId: 'mock-instance',
      manifest: {
        id: 'mock-webpart',
        alias: 'MockWebPart'
      },
      serviceScope: {
        consume: () => ({})
      },
      pageContext: {
        web: {
          title: 'Mock Web',
          serverRelativeUrl: '/'
        },
        site: {
          serverRelativeUrl: '/'
        }
      }
    },
    writable: true,
    enumerable: true,
    configurable: true
  });
  
  Object.defineProperty(this, 'domElement', {
    value: null,
    writable: true,
    enumerable: true,
    configurable: true
  });
}

BaseClientSideWebPart.prototype.render = function() {
  // Override in derived classes
  console.log('BaseClientSideWebPart.render() called');
};

BaseClientSideWebPart.prototype.onInit = function() {
  return Promise.resolve();
};

BaseClientSideWebPart.prototype.onDispose = function() {
  // Cleanup logic
};

Object.defineProperty(BaseClientSideWebPart.prototype, 'dataVersion', {
  get: function() {
    return this._dataVersion || { major: 1, minor: 0 };
  },
  set: function(value) {
    this._dataVersion = value;
  }
});

BaseClientSideWebPart.prototype.getPropertyPaneConfiguration = function() {
  return {
    pages: []
  };
};

BaseClientSideWebPart.prototype.onPropertyPaneFieldChanged = function(propertyPath, oldValue, newValue) {
  // Property change handler
};

BaseClientSideWebPart.prototype.onPropertyPaneConfigurationStart = function() {
  // Configuration start handler
};

BaseClientSideWebPart.prototype.onPropertyPaneConfigurationComplete = function() {
  // Configuration complete handler
};

// Web part context mock
const WebPartContext = {
  instanceId: 'mock-instance',
  manifest: {
    id: 'mock-webpart'
  },
  serviceScope: {
    consume: () => ({})
  }
};

// Export
const spWebpartBase = {
  BaseClientSideWebPart,
  WebPartContext
};

module.exports = spWebpartBase;
module.exports.default = spWebpartBase;
module.exports.BaseClientSideWebPart = BaseClientSideWebPart;
module.exports.WebPartContext = WebPartContext;
