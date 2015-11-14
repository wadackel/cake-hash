import get from "./get"
import extract from "./extract"
import insert from "./insert"
import remove from "./remove"
import combine from "./combine"
import check from "./check"
import flatten from "./flatten"
import expand from "./expand"
import map from "./map"
import reduce from "./reduce"

const VERSION = "0.0.1";


// Core
function CakeHash() {}
CakeHash.VERSION = VERSION;
CakeHash.get = get;
CakeHash.extract = extract;
CakeHash.insert = insert;
CakeHash.remove = remove;
CakeHash.combine = combine;
CakeHash.check = check;
CakeHash.flatten = flatten;
CakeHash.expand = expand;
CakeHash.map = map;
CakeHash.reduce = reduce;



// Export CakeHash module
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

const objectTypes = {
  "function": true,
  "object": true
};

const _exports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
const _module = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
const _global = checkGlobal(_exports && _module && typeof global == "object" && global);
const _self = checkGlobal(objectTypes[typeof self] && self);
const _window = checkGlobal(objectTypes[typeof window] && window);
const _moduleExports = (_module && _module.exports === _exports) ? _exports : null;
const _this = checkGlobal(objectTypes[typeof this] && this);
const root = _global || ((_window !== (_this && _this.window)) && _window) || _self || _this || Function("return this")();


(_window || _self || {}).CakeHash = CakeHash;

if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
  define(function() {
    return CakeHash;
  });
} else if (_exports && _module) {
  if (_moduleExports) {
    (_module.exports = CakeHash).CakeHash = CakeHash;
  } else {
    _exports.CakeHash = CakeHash;
  }
} else {
  root.CakeHash = CakeHash;
}