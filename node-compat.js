// Node.js compatibility shim for SPFx with Node 20+
// This fixes the "primordials is not defined" error

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(...args) {
  if (args[0] === 'graceful-fs') {
    const fs = originalRequire.apply(this, args);
    
    // Add primordials shim if it doesn't exist
    if (typeof globalThis.primordials === 'undefined') {
      const util = require('util');
      globalThis.primordials = {
        ArrayIsArray: Array.isArray,
        ArrayPrototypeIncludes: (arr, item) => arr.includes(item),
        ArrayPrototypeIndexOf: (arr, item) => arr.indexOf(item),
        ArrayPrototypeJoin: (arr, sep) => arr.join(sep),
        ArrayPrototypeMap: (arr, fn) => arr.map(fn),
        ArrayPrototypePop: (arr) => arr.pop(),
        ArrayPrototypePush: (arr, ...items) => arr.push(...items),
        ArrayPrototypeSlice: (arr, start, end) => arr.slice(start, end),
        ArrayPrototypeSplice: (arr, start, deleteCount, ...items) => arr.splice(start, deleteCount, ...items),
        ArrayPrototypeUnshift: (arr, ...items) => arr.unshift(...items),
        BigIntAsIntN: (width, value) => BigInt.asIntN(width, value),
        BigIntAsUintN: (width, value) => BigInt.asUintN(width, value),
        FunctionPrototypeCall: (fn, thisArg, ...args) => fn.call(thisArg, ...args),
        FunctionPrototypeApply: (fn, thisArg, args) => fn.apply(thisArg, args),
        MathFloor: Math.floor,
        NumberIsInteger: Number.isInteger,
        NumberIsNaN: Number.isNaN,
        NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
        NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
        NumberParseInt: Number.parseInt,
        ObjectDefineProperty: Object.defineProperty,
        ObjectDefineProperties: Object.defineProperties,
        ObjectGetOwnPropertyDescriptor: Object.getOwnPropertyDescriptor,
        ObjectKeys: Object.keys,
        ObjectSetPrototypeOf: Object.setPrototypeOf,
        Promise: globalThis.Promise,
        PromisePrototypeThen: (promise, onFulfilled, onRejected) => promise.then(onFulfilled, onRejected),
        PromiseReject: (reason) => Promise.reject(reason),
        PromiseResolve: (value) => Promise.resolve(value),
        ReflectApply: Reflect.apply,
        RegExpPrototypeTest: (regexp, str) => regexp.test(str),
        SafeStringIterator: (str) => str[Symbol.iterator](),
        StringPrototypeCharCodeAt: (str, index) => str.charCodeAt(index),
        StringPrototypeIncludes: (str, searchStr) => str.includes(searchStr),
        StringPrototypeIndexOf: (str, searchStr) => str.indexOf(searchStr),
        StringPrototypeLastIndexOf: (str, searchStr) => str.lastIndexOf(searchStr),
        StringPrototypeSlice: (str, start, end) => str.slice(start, end),
        StringPrototypeSplit: (str, separator, limit) => str.split(separator, limit),
        StringPrototypeToLowerCase: (str) => str.toLowerCase(),
        StringPrototypeToUpperCase: (str) => str.toUpperCase(),
        StringPrototypeTrim: (str) => str.trim(),
        SymbolAsyncIterator: Symbol.asyncIterator,
        SymbolHasInstance: Symbol.hasInstance,
        SymbolIsConcatSpreadable: Symbol.isConcatSpreadable,
        SymbolIterator: Symbol.iterator,
        SymbolMatch: Symbol.match,
        SymbolReplace: Symbol.replace,
        SymbolSearch: Symbol.search,
        SymbolSpecies: Symbol.species,
        SymbolSplit: Symbol.split,
        SymbolToPrimitive: Symbol.toPrimitive,
        SymbolToStringTag: Symbol.toStringTag,
        TypedArrayPrototypeSet: (typedArray, array, offset) => typedArray.set(array, offset),
        Uint8Array: globalThis.Uint8Array,
        ...util.promisify
      };
    }
    
    return fs;
  }
  
  return originalRequire.apply(this, args);
};
