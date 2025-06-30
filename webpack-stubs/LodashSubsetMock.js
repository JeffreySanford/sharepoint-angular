// Mock for @microsoft/sp-lodash-subset
// This provides the lodash functions that SPFx expects

const lodashSubset = {
  forEach: (collection, iteratee) => {
    if (Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i++) {
        iteratee(collection[i], i, collection);
      }
    } else if (collection && typeof collection === 'object') {
      for (const key in collection) {
        if (collection.hasOwnProperty(key)) {
          iteratee(collection[key], key, collection);
        }
      }
    }
    return collection;
  },
  
  isUndefined: (value) => value === undefined,
  
  isString: (value) => typeof value === 'string',
  
  isNumber: (value) => typeof value === 'number' && !isNaN(value),
  
  isBoolean: (value) => typeof value === 'boolean',
  
  isFunction: (value) => typeof value === 'function',
  
  isObject: (value) => value !== null && typeof value === 'object',
  
  isArray: Array.isArray,
  
  isEmpty: (value) => {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
  
  merge: (...sources) => {
    const target = sources[0] || {};
    for (let i = 1; i < sources.length; i++) {
      const source = sources[i];
      if (source) {
        Object.assign(target, source);
      }
    }
    return target;
  },
  
  clone: (value) => {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return [...value];
    return { ...value };
  },
  
  cloneDeep: (value) => {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(lodashSubset.cloneDeep);
    if (value instanceof Date) return new Date(value.getTime());
    
    const cloned = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        cloned[key] = lodashSubset.cloneDeep(value[key]);
      }
    }
    return cloned;
  },
  
  get: (object, path, defaultValue) => {
    if (!object || !path) return defaultValue;
    
    const keys = Array.isArray(path) ? path : path.toString().split('.');
    let result = object;
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  },
  
  set: (object, path, value) => {
    if (!object || !path) return object;
    
    const keys = Array.isArray(path) ? path : path.toString().split('.');
    let current = object;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return object;
  }
};

// Export in a way that matches the expected module structure
module.exports = lodashSubset;
module.exports.default = lodashSubset;

// Also export individual functions for named imports
Object.keys(lodashSubset).forEach(key => {
  module.exports[key] = lodashSubset[key];
});
