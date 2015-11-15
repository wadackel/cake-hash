/*!
 * cake-hash
 * CakePHP in Utility.Hash class like a collection manipulation. In JavaScript.
 * 
 * @author tsuyoshiwada
 * @homepage https://github.com/tsuyoshiwada/cake-hash
 * @license MIT
 * @version 0.0.1
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _get = require("./get");

var _get2 = _interopRequireDefault(_get);

var _extract = require("./extract");

var _extract2 = _interopRequireDefault(_extract);

var _insert = require("./insert");

var _insert2 = _interopRequireDefault(_insert);

var _remove = require("./remove");

var _remove2 = _interopRequireDefault(_remove);

var _combine = require("./combine");

var _combine2 = _interopRequireDefault(_combine);

var _check = require("./check");

var _check2 = _interopRequireDefault(_check);

var _flatten = require("./flatten");

var _flatten2 = _interopRequireDefault(_flatten);

var _expand = require("./expand");

var _expand2 = _interopRequireDefault(_expand);

var _map = require("./map");

var _map2 = _interopRequireDefault(_map);

var _reduce = require("./reduce");

var _reduce2 = _interopRequireDefault(_reduce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var VERSION = "0.0.1";

// Core
function CakeHash() {}
CakeHash.VERSION = VERSION;
CakeHash.get = _get2.default;
CakeHash.extract = _extract2.default;
CakeHash.insert = _insert2.default;
CakeHash.remove = _remove2.default;
CakeHash.combine = _combine2.default;
CakeHash.check = _check2.default;
CakeHash.flatten = _flatten2.default;
CakeHash.expand = _expand2.default;
CakeHash.map = _map2.default;
CakeHash.reduce = _reduce2.default;

// Export CakeHash module
function checkGlobal(value) {
  return value && value.Object === Object ? value : null;
}

var objectTypes = {
  "function": true,
  "object": true
};

var _exports = objectTypes[typeof exports === "undefined" ? "undefined" : _typeof(exports)] && exports && !exports.nodeType ? exports : null;
var _module = objectTypes[typeof module === "undefined" ? "undefined" : _typeof(module)] && module && !module.nodeType ? module : null;
var _global = checkGlobal(_exports && _module && (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global);
var _self = checkGlobal(objectTypes[typeof self === "undefined" ? "undefined" : _typeof(self)] && self);
var _window = checkGlobal(objectTypes[typeof window === "undefined" ? "undefined" : _typeof(window)] && window);
var _moduleExports = _module && _module.exports === _exports ? _exports : null;
var _this = checkGlobal(objectTypes[_typeof(undefined)] && undefined);
var root = _global || _window !== (_this && _this.window) && _window || _self || _this || Function("return this")();

(_window || _self || {}).CakeHash = CakeHash;

if (typeof define == "function" && _typeof(define.amd) == "object" && define.amd) {
  define(function () {
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./check":2,"./combine":3,"./expand":4,"./extract":5,"./flatten":6,"./get":7,"./insert":8,"./map":9,"./reduce":10,"./remove":11}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = check;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _extract = require("./extract");

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function check(data, path) {
  var results = (0, _extract2.default)(data, path);

  if (Core.isCollection(results)) {
    return !Core.empty(results);
  }

  return results != null;
}

},{"./extract":5,"./utils/core":13}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combine;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _extract = require("./extract");

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function combine(data, keyPath) {
  var valuePath = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
  var groupPath = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  if (Core.empty(data)) {
    return [];
  }

  var keys = (0, _extract2.default)(data, keyPath);
  var vals = undefined;

  if (Core.empty(keys)) {
    return [];
  }

  if (!Core.empty(valuePath)) {
    vals = (0, _extract2.default)(data, valuePath);
  }
  if (Core.empty(vals)) {
    vals = Collection.arrayFill(0, keys.length, null);
  }

  if (keys.length !== vals.length) {
    return [];
  }

  if (groupPath != null) {
    var group = (0, _extract2.default)(data, groupPath);
    if (!Core.empty(group)) {
      var c = keys.length;
      var out = {};
      for (var i = 0; i < c; i++) {
        if (group[i] == null || !Collection.hasProp(group, i)) {
          group[i] = 0;
        }
        if (out[group[i]] == null || !Collection.hasProp(out, group[i])) {
          out[group[i]] = {};
        }
        out[group[i]][keys[i]] = vals[i];
      }
      return Collection.objToArray(out);
    }
  }

  if (Core.empty(vals)) {
    return [];
  }

  return Collection.arrayCombine(keys, vals);
}

},{"./extract":5,"./utils/collection":12,"./utils/core":13}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = expand;

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function expand(data) {
  var separator = arguments.length <= 1 || arguments[1] === undefined ? "." : arguments[1];

  var results = {};

  Collection.each(data, function (value, flat) {
    var keys = (flat + "").split(separator).reverse();
    var child = {};
    child[keys.shift()] = value;
    Collection.each(keys, function (k) {
      child = _defineProperty({}, k, child);
    });
    results = Collection.merge(results, child, true);
  });

  return Collection.objToArray(results);
}

},{"./utils/collection":12}],5:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extract;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _text = require("./utils/text");

var Text = _interopRequireWildcard(_text);

var _get = require("./get");

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function extract(data, path) {
  if (!Core.isCollection(data)) {
    return null;
  }

  if (Core.empty(path)) {
    return data;
  }

  if (!/[{\[]/.test(path)) {
    return (0, _get2.default)(data, path, null);
  }

  var key = "__set_item__";
  var tokens = undefined;
  var context = _defineProperty({}, key, [data]);

  if (path.indexOf("[") < 0) {
    tokens = path.split(".");
  } else {
    tokens = Text.tokenize(path, ".", "[", "]");
  }

  Collection.each(tokens, function (token) {
    var next = [];

    var _Text$splitConditions = Text.splitConditions(token);

    var _Text$splitConditions2 = _slicedToArray(_Text$splitConditions, 2);

    var _token = _Text$splitConditions2[0];
    var conditions = _Text$splitConditions2[1];

    Collection.each(context[key], function (item) {
      Collection.each(item, function (v, k) {
        if (Text.matchToken(k, _token)) {
          next.push(v);
        }
      });
    });

    if (conditions) {
      (function () {
        var filter = [];
        Collection.each(next, function (item) {
          if (Core.isCollection(item) && Text.matches(item, conditions)) {
            filter.push(item);
          }
        });
        next = filter;
      })();
    }
    context = _defineProperty({}, key, next);
  });

  return context[key];
}

},{"./get":7,"./utils/collection":12,"./utils/core":13,"./utils/text":14}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function flatten(data) {
  var separator = arguments.length <= 1 || arguments[1] === undefined ? "." : arguments[1];

  return _flatten(data, separator);
}

function _flatten(input, separator) {
  var currentPath = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var results = {};
  var path = null;

  if (Core.isArray(input) && input.length === 0) {
    path = currentPath == null ? 0 : currentPath;
    results[path] = input;
    return results;
  }

  Collection.each(input, function (val, key) {
    path = currentPath == null ? key : "" + currentPath + separator + key;
    if (Core.isCollection(val)) {
      var children = _flatten(val, separator, path);
      if (Object.keys(children).length > 0) {
        results = Collection.merge(results, children);
      }
    } else if (val !== undefined) {
      results[path] = val;
    }
  });

  return Collection.objToArray(results);
}

},{"./utils/collection":12,"./utils/core":13}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = get;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function get(data, path) {
  var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var parts = undefined,
      val = undefined;

  if (!Core.isCollection(data)) {
    return defaultValue;
  }

  if (Core.empty(data) || path == null || path === "") {
    return defaultValue;
  }

  if (Core.isString(path) || Core.isNumeric(path)) {
    parts = (path + "").split(".");
  } else {
    if (!Core.isArray(path)) {
      return defaultValue;
    }
    parts = path;
  }

  val = Core.isCollection(data) ? Collection.clone(data) : data;
  Collection.each(parts, function (v) {
    if (Core.isCollection(val) && Collection.hasProp(val, v)) {
      val = val[v];
    } else {
      val = defaultValue;
      return false;
    }
  });

  return val;
}

},{"./utils/collection":12,"./utils/core":13}],8:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insert;

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _text = require("./utils/text");

var Text = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function insert(data, path) {
  var value = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var noTokens = path.indexOf("[") < 0;
  if (noTokens && path.indexOf(".") < 0) {
    data[path] = value;
    return data;
  }

  var tokens = undefined;
  if (noTokens) {
    tokens = path.split(".");
  } else {
    tokens = Text.tokenize(path, ".", "[", "]");
  }

  if (noTokens && path.indexOf("{") < 0) {
    return Collection.simpleOp("insert", data, tokens, value);
  }

  var token = tokens.shift();
  var nextPath = tokens.join(".");

  var _Text$splitConditions = Text.splitConditions(token);

  var _Text$splitConditions2 = _slicedToArray(_Text$splitConditions, 2);

  var _token = _Text$splitConditions2[0];
  var conditions = _Text$splitConditions2[1];

  Collection.each(data, function (v, k) {
    if (Text.matchToken(k, _token)) {
      if (!conditions || Text.matches(v, conditions)) {
        data[k] = nextPath ? insert(v, nextPath, value) : Collection.merge(v, value);
      }
    }
  });

  return data;
}

},{"./utils/collection":12,"./utils/text":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _extract = require("./extract");

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function map(data, path, callback) {
  var values = Collection.objToArray((0, _extract2.default)(data, path));
  return !Core.isArray(values) ? null : values.map(callback);
}

},{"./extract":5,"./utils/collection":12,"./utils/core":13}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reduce;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _extract = require("./extract");

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function reduce(data, path, callback) {
  var values = Collection.objToArray((0, _extract2.default)(data, path));
  return !Core.isArray(values) ? null : values.reduce(callback);
}

},{"./extract":5,"./utils/collection":12,"./utils/core":13}],11:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = remove;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _text = require("./utils/text");

var Text = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function remove(data, path) {
  var noTokens = path.indexOf("[") < 0;
  var noExpansion = path.indexOf("{") < 0;

  if (noExpansion && noTokens && path.indexOf(".") < 0) {
    delete data[path];
    return data;
  }

  var tokens = noTokens ? path.split(".") : Text.tokenize(path, ".", "[", "]");

  if (noExpansion && noTokens) {
    return Collection.simpleOp("remove", data, tokens);
  }

  var token = tokens.shift();
  var nextPath = tokens.join(".");

  var _Text$splitConditions = Text.splitConditions(token);

  var _Text$splitConditions2 = _slicedToArray(_Text$splitConditions, 2);

  var _token = _Text$splitConditions2[0];
  var conditions = _Text$splitConditions2[1];

  Collection.each(data, function (v, k) {
    var match = Text.matchToken(k, _token);
    if (match && Core.isCollection(v)) {
      if (conditions) {
        if (Text.matches(v, conditions)) {
          if (nextPath) {
            data[k] = remove(v, nextPath);
          } else {
            delete data[k];
          }
        }
      } else {
        data[k] = remove(v, nextPath);
      }
      if (Core.empty(data[k])) {
        delete data[k];
      }
    } else if (match && Core.empty(nextPath)) {
      delete data[k];
    }
  });

  return data;
}

},{"./utils/collection":12,"./utils/core":13,"./utils/text":14}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasProp = hasProp;
exports.clone = clone;
exports.merge = merge;
exports.each = each;
exports.arrayCombine = arrayCombine;
exports.arrayFill = arrayFill;
exports.objToArray = objToArray;
exports.simpleOp = simpleOp;

var _core = require("./core");

var Core = _interopRequireWildcard(_core);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function hasProp(obj, key) {
  return obj && obj.hasOwnProperty(key);
}

function clone(obj) {
  var _isArray = Core.isArray(obj);
  var _isObject = Core.isObject(obj);

  if (!_isArray && !_isObject) return undefined;

  var result = _isArray ? [] : {},
      key = undefined,
      val = undefined;

  for (key in obj) {
    if (!hasProp(obj, key)) continue;
    val = obj[key];
    if (Core.isCollection(val)) val = clone(val);
    result[key] = val;
  }

  return result;
}

function merge(obj, source) {
  var deep = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  each(source, function (value, key) {
    if (deep && hasProp(obj, key) && Core.isCollection(value)) {
      merge(obj[key], value, deep);
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

function each(obj, iterate, context) {
  if (obj == null) return obj;

  context = context || obj;

  if (Core.isObject(obj)) {
    for (var key in obj) {
      if (!hasProp(obj, key)) continue;
      if (iterate.call(context, obj[key], key) === false) break;
    }
  } else if (Core.isArray(obj)) {
    var i = undefined,
        length = obj.length;
    for (i = 0; i < length; i++) {
      if (iterate.call(context, obj[i], i) === false) break;
    }
  }

  return obj;
}

function arrayCombine(keys, values) {
  var data = {};
  var keyCount = keys && keys.length;
  var i = 0,
      key = undefined;

  if (!Core.isCollection(keys) || !Core.isCollection(values) || !Core.isNumber(keyCount) || !Core.isNumber(values.length) || !keyCount) {
    return null;
  }

  if (keyCount !== values.length) {
    return null;
  }

  for (i = 0; i < keyCount; i++) {
    key = keys[i];
    if (Core.isInteger(key)) {
      key = parseInt(key, 10);
    }
    data[key] = values[i];
  }

  return objToArray(data);
}

function arrayFill(startIndex, num, mixedVal) {
  var key = undefined,
      arr = [];
  if (!isNaN(startIndex) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      arr[key + startIndex] = mixedVal;
    }
  }
  return arr;
}

function objToArray(obj) {
  if (!Core.isObject(obj)) return obj;
  if (!Object.keys(obj).every(function (key) {
    return Core.isInteger(key);
  })) return obj;

  var array = [];
  each(obj, function (value, i) {
    array[i] = value;
  });
  return array;
}

function simpleOp(op, data, path) {
  var values = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var length = path.length;
  var last = length - 1;
  var list = data;

  each(path, function (key, i) {
    if ((Core.isNumeric(key) && parseInt(key, 10) > 0 || key === "0") && key.indexOf("0") !== 0) {
      key = parseInt(key, 10);
    }
    switch (op) {
      case "insert":
        if (i === last) {
          list[key] = values;
          return false;
        }
        if (list[key] == null || !hasProp(list, key)) {
          list[key] = {};
        }
        if (!Core.isCollection(list[key])) {
          list[key] = {};
        }
        list = list[key];
        break;

      case "remove":
        if (i === last) {
          delete list[key];
          return false;
        }
        if (list[key] == null || !hasProp(list, key)) {
          return false;
        }
        list = list[key];
        break;
    }
  });

  return data;
}

},{"./core":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isCollection = isCollection;
exports.isNumeric = isNumeric;
exports.isInteger = isInteger;
exports.empty = empty;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
var classTypes = {};

classTypeList.forEach(function (name) {
  classTypes["[object " + name + "]"] = name.toLowerCase();
});

function getType(obj) {
  if (obj == null) {
    return obj + "";
  }
  return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? classTypes[Object.prototype.toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isObject(obj) {
  return !isArray(obj) && getType(obj) === "object";
}

function isNumber(obj) {
  return getType(obj) === "number";
}

function isString(obj) {
  return getType(obj) === "string";
}

function isBoolean(obj) {
  return getType(obj) === "boolean";
}

function isCollection(obj) {
  return isArray(obj) || isObject(obj);
}

function isNumeric(obj) {
  var type = getType(obj);
  return (type === "number" || type === "string") && obj - parseFloat(obj) + 1 >= 0;
}

function isInteger(obj) {
  var type = getType(obj);
  return (type === "number" || type === "string") && /^([1-9]\d*|0)$/.test(obj);
}

function empty(obj) {
  if (isArray(obj)) {
    return obj.length === 0;
  } else if (isObject(obj)) {
    return Object.keys(obj).length === 0;
  } else if (isNumeric(obj)) {
    return parseFloat(obj) === 0;
  }
  return !obj;
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trim = trim;
exports.tokenize = tokenize;
exports.splitConditions = splitConditions;
exports.matchToken = matchToken;
exports.matches = matches;

var _core = require("./core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./collection");

var Collection = _interopRequireWildcard(_collection);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function trim(input) {
  return input.replace(/^\s+|\s+$/g, "");
}

function tokenize(str) {
  var separator = arguments.length <= 1 || arguments[1] === undefined ? "," : arguments[1];
  var left = arguments.length <= 2 || arguments[2] === undefined ? "(" : arguments[2];
  var right = arguments.length <= 3 || arguments[3] === undefined ? ")" : arguments[3];

  if (Core.empty(str)) {
    return [];
  }

  var depth = 0;
  var offset = 0;
  var buffer = "";
  var results = [];
  var length = str.length;
  var open = false;

  while (offset <= length) {
    var tmpOffset = -1;
    var offsets = [str.indexOf(separator, offset), str.indexOf(left, offset), str.indexOf(right, offset)];
    for (var i = 0; i < 3; i++) {
      if (offsets[i] !== -1 && (offsets[i] < tmpOffset || tmpOffset === -1)) {
        tmpOffset = offsets[i];
      }
    }
    if (tmpOffset !== -1) {
      buffer += str.substr(offset, tmpOffset - offset);
      var char = str.substr(tmpOffset, 1);
      if (!depth && char === separator) {
        results.push(buffer);
        buffer = "";
      } else {
        buffer += char;
      }
      if (left !== right) {
        if (char === left) {
          depth++;
        }
        if (char === right) {
          depth--;
        }
      } else {
        if (char === left) {
          if (!open) {
            depth++;
            open = true;
          } else {
            depth--;
          }
        }
      }
      offset = ++tmpOffset;
    } else {
      results.push(buffer + str.substr(offset));
      offset = length + 1;
    }
  }

  if (Core.empty(results) && !Core.empty(buffer)) {
    results.push(buffer);
  }

  if (!Core.empty(results)) {
    return results.map(function (val) {
      return trim(val);
    });
  }

  return [];
}

function splitConditions(token) {
  var conditions = false;
  var position = token.indexOf("[");
  if (position > -1) {
    conditions = token.substr(position);
    token = token.substr(0, position);
  }
  return [token, conditions];
}

function matchToken(key, token) {
  switch (token) {
    case "{n}":
      return Core.isNumeric(key);
    case "{s}":
      return Core.isString(key);
    case "{*}":
      return true;
    default:
      return Core.isNumeric(token) ? key == token : key === token;
  }
}

function matches(data, selector) {
  var identifier = "(?:\\\\.|[\\w-_\.]|[^\\x00-\\xa0])+";
  var attributes = new RegExp("\\s*(" + identifier + ")(?:\\s*([><!]?[=]|[><])\\s*(\\/.*?\\/|" + identifier + ")|)\\s*]", "g");
  var cond = undefined;

  while (cond = attributes.exec(selector)) {
    var attr = cond[1];
    var op = cond[2] || null;
    var val = cond[3] || null;
    var hasProperty = Collection.hasProp(data, attr);

    if (Core.empty(op) && Core.empty(val) && !hasProperty) {
      return false;
    }

    if (!(hasProperty || data[attr] != null)) {
      return false;
    }

    var prop = hasProperty ? prop = data[attr] : undefined;
    var _isBoolean = Core.isBoolean(prop) || prop === "true" || prop === "false";

    if (_isBoolean && Core.isNumeric(val)) {
      prop = prop ? "1" : "0";
    } else if (_isBoolean) {
      prop = prop ? "true" : "false";
    }

    if (op === "=" && val && val[0] === "/" && val[val.length - 1] === "/") {
      prop = Core.isString(prop) || Core.isNumeric(prop) ? prop : "";
      if (!new RegExp(val.substr(1, val.length - 2)).test(prop)) {
        return false;
      }
    } else if (op === "=" && prop != val || op === "!=" && prop == val || op === ">" && prop <= val || op === "<" && prop >= val || op === ">=" && prop < val || op === "<=" && prop > val) {
      return false;
    }
  }

  return true;
}

},{"./collection":12,"./core":13}]},{},[1]);
