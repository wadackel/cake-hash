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

},{"./extract":5,"./utils/core":14}],3:[function(require,module,exports){
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

},{"./extract":5,"./utils/collection":13,"./utils/core":14}],4:[function(require,module,exports){
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

},{"./utils/collection":13}],5:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extract;

var _Core = require("./utils/Core");

var Core = _interopRequireWildcard(_Core);

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

},{"./get":7,"./utils/Core":12,"./utils/collection":13,"./utils/text":15}],6:[function(require,module,exports){
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

},{"./utils/collection":13,"./utils/core":14}],7:[function(require,module,exports){
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

},{"./utils/collection":13,"./utils/core":14}],8:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insert;

var _core = require("./utils/core");

var Core = _interopRequireWildcard(_core);

var _collection = require("./utils/collection");

var Collection = _interopRequireWildcard(_collection);

var _text = require("./utils/text");

var Text = _interopRequireWildcard(_text);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function insert(data, path, values) {
  var noTokens = path.indexOf("[") < 0;
  if (noTokens && path.indexOf(".") < 0) {
    data[path] = values;
    return data;
  }

  var tokens = undefined;
  if (noTokens) {
    tokens = path.split(".");
  } else {
    tokens = Text.tokenize(path, ".", "[", "]");
  }

  if (noTokens && path.indexOf("{") < 0) {
    return Collection.simpleOp("insert", data, tokens, values);
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
        data[k] = nextPath ? insert(v, nextPath, values) : Collection.merge(v, values);
      }
    }
  });

  return data;
}

},{"./utils/collection":13,"./utils/core":14,"./utils/text":15}],9:[function(require,module,exports){
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

},{"./extract":5,"./utils/collection":13,"./utils/core":14}],10:[function(require,module,exports){
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

},{"./extract":5,"./utils/collection":13,"./utils/core":14}],11:[function(require,module,exports){
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

},{"./utils/collection":13,"./utils/core":14,"./utils/text":15}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./core":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./collection":13,"./core":14}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FrZS1oYXNoLmpzIiwic3JjL2NoZWNrLmpzIiwic3JjL2NvbWJpbmUuanMiLCJzcmMvZXhwYW5kLmpzIiwic3JjL2V4dHJhY3QuanMiLCJzcmMvZmxhdHRlbi5qcyIsInNyYy9nZXQuanMiLCJzcmMvaW5zZXJ0LmpzIiwic3JjL21hcC5qcyIsInNyYy9yZWR1Y2UuanMiLCJzcmMvcmVtb3ZlLmpzIiwic3JjL3V0aWxzL0NvcmUuanMiLCJzcmMvdXRpbHMvY29sbGVjdGlvbi5qcyIsInNyYy91dGlscy9jb3JlLmpzIiwic3JjL3V0aWxzL3RleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1dBLElBQU0sT0FBTyxHQUFHLE9BQU87OztBQUFDLEFBSXhCLFNBQVMsUUFBUSxHQUFHLEVBQUU7QUFDdEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDM0IsUUFBUSxDQUFDLEdBQUcsZ0JBQU0sQ0FBQztBQUNuQixRQUFRLENBQUMsT0FBTyxvQkFBVSxDQUFDO0FBQzNCLFFBQVEsQ0FBQyxNQUFNLG1CQUFTLENBQUM7QUFDekIsUUFBUSxDQUFDLE1BQU0sbUJBQVMsQ0FBQztBQUN6QixRQUFRLENBQUMsT0FBTyxvQkFBVSxDQUFDO0FBQzNCLFFBQVEsQ0FBQyxLQUFLLGtCQUFRLENBQUM7QUFDdkIsUUFBUSxDQUFDLE9BQU8sb0JBQVUsQ0FBQztBQUMzQixRQUFRLENBQUMsTUFBTSxtQkFBUyxDQUFDO0FBQ3pCLFFBQVEsQ0FBQyxHQUFHLGdCQUFNLENBQUM7QUFDbkIsUUFBUSxDQUFDLE1BQU0sbUJBQVM7OztBQUFDLEFBS3pCLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRTtBQUMxQixTQUFPLEFBQUMsS0FBSyxJQUFJLEtB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QUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDekQsZUFBTyxLQUFLLENBQUM7T0FDZDtLQUNGLE1BQU0sSUFBSSxBQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsSUFDbEMsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxBQUFDLElBQzNCLEVBQUUsS0FBSyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQUFBQyxJQUMxQixFQUFFLEtBQUssR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEFBQUMsSUFDMUIsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxBQUFDLElBQzFCLEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsQUFBQyxFQUMzQjtBQUNBLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7R0FDRjs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBnZXQgZnJvbSBcIi4vZ2V0XCJcbmltcG9ydCBleHRyYWN0IGZyb20gXCIuL2V4dHJhY3RcIlxuaW1wb3J0IGluc2VydCBmcm9tIFwiLi9pbnNlcnRcIlxuaW1wb3J0IHJlbW92ZSBmcm9tIFwiLi9yZW1vdmVcIlxuaW1wb3J0IGNvbWJpbmUgZnJvbSBcIi4vY29tYmluZVwiXG5pbXBvcnQgY2hlY2sgZnJvbSBcIi4vY2hlY2tcIlxuaW1wb3J0IGZsYXR0ZW4gZnJvbSBcIi4vZmxhdHRlblwiXG5pbXBvcnQgZXhwYW5kIGZyb20gXCIuL2V4cGFuZFwiXG5pbXBvcnQgbWFwIGZyb20gXCIuL21hcFwiXG5pbXBvcnQgcmVkdWNlIGZyb20gXCIuL3JlZHVjZVwiXG5cbmNvbnN0IFZFUlNJT04gPSBcIjAuMC4xXCI7XG5cblxuLy8gQ29yZVxuZnVuY3Rpb24gQ2FrZUhhc2goKSB7fVxuQ2FrZUhhc2guVkVSU0lPTiA9IFZFUlNJT047XG5DYWtlSGFzaC5nZXQgPSBnZXQ7XG5DYWtlSGFzaC5leHRyYWN0ID0gZXh0cmFjdDtcbkNha2VIYXNoLmluc2VydCA9IGluc2VydDtcbkNha2VIYXNoLnJlbW92ZSA9IHJlbW92ZTtcbkNha2VIYXNoLmNvbWJpbmUgPSBjb21iaW5lO1xuQ2FrZUhhc2guY2hlY2sgPSBjaGVjaztcbkNha2VIYXNoLmZsYXR0ZW4gPSBmbGF0dGVuO1xuQ2FrZUhhc2guZXhwYW5kID0gZXhwYW5kO1xuQ2FrZUhhc2gubWFwID0gbWFwO1xuQ2FrZUhhc2gucmVkdWNlID0gcmVkdWNlO1xuXG5cblxuLy8gRXhwb3J0IENha2VIYXNoIG1vZHVsZVxuZnVuY3Rpb24gY2hlY2tHbG9iYWwodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZS5PYmplY3QgPT09IE9iamVjdCkgPyB2YWx1ZSA6IG51bGw7XG59XG5cbmNvbnN0IG9iamVjdFR5cGVzID0ge1xuICBcImZ1bmN0aW9uXCI6IHRydWUsXG4gIFwib2JqZWN0XCI6IHRydWVcbn07XG5cbmNvbnN0IF9leHBvcnRzID0gKG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlKSA/IGV4cG9ydHMgOiBudWxsO1xuY29uc3QgX21vZHVsZSA9IChvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSkgPyBtb2R1bGUgOiBudWxsO1xuY29uc3QgX2dsb2JhbCA9IGNoZWNrR2xvYmFsKF9leHBvcnRzICYmIF9tb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSBcIm9iamVjdFwiICYmIGdsb2JhbCk7XG5jb25zdCBfc2VsZiA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiBzZWxmXSAmJiBzZWxmKTtcbmNvbnN0IF93aW5kb3cgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpO1xuY29uc3QgX21vZHVsZUV4cG9ydHMgPSAoX21vZHVsZSAmJiBfbW9kdWxlLmV4cG9ydHMgPT09IF9leHBvcnRzKSA/IF9leHBvcnRzIDogbnVsbDtcbmNvbnN0IF90aGlzID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHRoaXNdICYmIHRoaXMpO1xuY29uc3Qgcm9vdCA9IF9nbG9iYWwgfHwgKChfd2luZG93ICE9PSAoX3RoaXMgJiYgX3RoaXMud2luZG93KSkgJiYgX3dpbmRvdykgfHwgX3NlbGYgfHwgX3RoaXMgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xuXG5cbihfd2luZG93IHx8IF9zZWxmIHx8IHt9KS5DYWtlSGFzaCA9IENha2VIYXNoO1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gXCJvYmplY3RcIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ2FrZUhhc2g7XG4gIH0pO1xufSBlbHNlIGlmIChfZXhwb3J0cyAmJiBfbW9kdWxlKSB7XG4gIGlmIChfbW9kdWxlRXhwb3J0cykge1xuICAgIChfbW9kdWxlLmV4cG9ydHMgPSBDYWtlSGFzaCkuQ2FrZUhhc2ggPSBDYWtlSGFzaDtcbiAgfSBlbHNlIHtcbiAgICBfZXhwb3J0cy5DYWtlSGFzaCA9IENha2VIYXNoO1xuICB9XG59IGVsc2Uge1xuICByb290LkNha2VIYXNoID0gQ2FrZUhhc2g7XG59IiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiLi91dGlscy9jb3JlXCJcbmltcG9ydCBleHRyYWN0IGZyb20gXCIuL2V4dHJhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjaGVjayhkYXRhLCBwYXRoKSB7XG4gIGNvbnN0IHJlc3VsdHMgPSBleHRyYWN0KGRhdGEsIHBhdGgpO1xuXG4gIGlmIChDb3JlLmlzQ29sbGVjdGlvbihyZXN1bHRzKSkge1xuICAgIHJldHVybiAhQ29yZS5lbXB0eShyZXN1bHRzKTtcbiAgfVxuICBcbiAgcmV0dXJuIHJlc3VsdHMgIT0gbnVsbDtcbn0iLCJpbXBvcnQgKiBhcyBDb3JlIGZyb20gXCIuL3V0aWxzL2NvcmVcIlxuaW1wb3J0ICogYXMgQ29sbGVjdGlvbiBmcm9tIFwiLi91dGlscy9jb2xsZWN0aW9uXCJcbmltcG9ydCBleHRyYWN0IGZyb20gXCIuL2V4dHJhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21iaW5lKGRhdGEsIGtleVBhdGgsIHZhbHVlUGF0aCA9IG51bGwsIGdyb3VwUGF0aCA9IG51bGwpIHtcbiAgaWYgKENvcmUuZW1wdHkoZGF0YSkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBsZXQga2V5cyA9IGV4dHJhY3QoZGF0YSwga2V5UGF0aCk7XG4gIGxldCB2YWxzO1xuXG4gIGlmIChDb3JlLmVtcHR5KGtleXMpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaWYgKCFDb3JlLmVtcHR5KHZhbHVlUGF0aCkpIHtcbiAgICB2YWxzID0gZXh0cmFjdChkYXRhLCB2YWx1ZVBhdGgpO1xuICB9XG4gIGlmIChDb3JlLmVtcHR5KHZhbHMpKSB7XG4gICAgdmFscyA9IENvbGxlY3Rpb24uYXJyYXlGaWxsKDAsIGtleXMubGVuZ3RoLCBudWxsKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCAhPT0gdmFscy5sZW5ndGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoZ3JvdXBQYXRoICE9IG51bGwpIHtcbiAgICBsZXQgZ3JvdXAgPSBleHRyYWN0KGRhdGEsIGdyb3VwUGF0aCk7XG4gICAgaWYgKCFDb3JlLmVtcHR5KGdyb3VwKSkge1xuICAgICAgbGV0IGMgPSBrZXlzLmxlbmd0aDtcbiAgICAgIGxldCBvdXQgPSB7fTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYzsgaSsrKSB7XG4gICAgICAgIGlmIChncm91cFtpXSA9PSBudWxsIHx8ICFDb2xsZWN0aW9uLmhhc1Byb3AoZ3JvdXAsIGkpKSB7XG4gICAgICAgICAgZ3JvdXBbaV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvdXRbZ3JvdXBbaV1dID09IG51bGwgfHwgIUNvbGxlY3Rpb24uaGFzUHJvcChvdXQsIGdyb3VwW2ldKSkge1xuICAgICAgICAgIG91dFtncm91cFtpXV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBvdXRbZ3JvdXBbaV1dW2tleXNbaV1dID0gdmFsc1tpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBDb2xsZWN0aW9uLm9ialRvQXJyYXkob3V0KTtcbiAgICB9XG4gIH1cblxuICBpZiAoQ29yZS5lbXB0eSh2YWxzKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBDb2xsZWN0aW9uLmFycmF5Q29tYmluZShrZXlzLCB2YWxzKTtcbn0iLCJpbXBvcnQgKiBhcyBDb2xsZWN0aW9uIGZyb20gXCIuL3V0aWxzL2NvbGxlY3Rpb25cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmQoZGF0YSwgc2VwYXJhdG9yID0gXCIuXCIpIHtcbiAgbGV0IHJlc3VsdHMgPSB7fTtcblxuICBDb2xsZWN0aW9uLmVhY2goZGF0YSwgKHZhbHVlLCBmbGF0KSA9PiB7XG4gICAgbGV0IGtleXMgPSAoZmxhdCArIFwiXCIpLnNwbGl0KHNlcGFyYXRvcikucmV2ZXJzZSgpO1xuICAgIGxldCBjaGlsZCA9IHt9O1xuICAgIGNoaWxkW2tleXMuc2hpZnQoKV0gPSB2YWx1ZTtcbiAgICBDb2xsZWN0aW9uLmVhY2goa2V5cywgKGspID0+IHtcbiAgICAgIGNoaWxkID0ge1trXTogY2hpbGR9O1xuICAgIH0pO1xuICAgIHJlc3VsdHMgPSBDb2xsZWN0aW9uLm1lcmdlKHJlc3VsdHMsIGNoaWxkLCB0cnVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIENvbGxlY3Rpb24ub2JqVG9BcnJheShyZXN1bHRzKTtcbn0iLCJpbXBvcnQgKiBhcyBDb3JlIGZyb20gXCIuL3V0aWxzL0NvcmVcIlxuaW1wb3J0ICogYXMgQ29sbGVjdGlvbiBmcm9tIFwiLi91dGlscy9jb2xsZWN0aW9uXCJcbmltcG9ydCAqIGFzIFRleHQgZnJvbSBcIi4vdXRpbHMvdGV4dFwiXG5pbXBvcnQgZ2V0IGZyb20gXCIuL2dldFwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4dHJhY3QoZGF0YSwgcGF0aCkge1xuICBpZiAoIUNvcmUuaXNDb2xsZWN0aW9uKGRhdGEpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoQ29yZS5lbXB0eShwYXRoKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgaWYgKCEvW3tcXFtdLy50ZXN0KHBhdGgpKSB7XG4gICAgcmV0dXJuIGdldChkYXRhLCBwYXRoLCBudWxsKTtcbiAgfVxuXG4gIGNvbnN0IGtleSA9IFwiX19zZXRfaXRlbV9fXCI7XG4gIGxldCB0b2tlbnM7XG4gIGxldCBjb250ZXh0ID0ge1trZXldOiBbZGF0YV19O1xuXG4gIGlmIChwYXRoLmluZGV4T2YoXCJbXCIpIDwgMCkge1xuICAgIHRva2VucyA9IHBhdGguc3BsaXQoXCIuXCIpO1xuICB9IGVsc2Uge1xuICAgIHRva2VucyA9IFRleHQudG9rZW5pemUocGF0aCwgXCIuXCIsIFwiW1wiLCBcIl1cIik7XG4gIH1cblxuICBDb2xsZWN0aW9uLmVhY2godG9rZW5zLCAodG9rZW4pID0+IHtcbiAgICBsZXQgbmV4dCA9IFtdO1xuICAgIGxldCBbX3Rva2VuLCBjb25kaXRpb25zXSA9IFRleHQuc3BsaXRDb25kaXRpb25zKHRva2VuKTtcblxuICAgIENvbGxlY3Rpb24uZWFjaChjb250ZXh0W2tleV0sIChpdGVtKSA9PiB7XG4gICAgICBDb2xsZWN0aW9uLmVhY2goaXRlbSwgKHYsIGspID0+IHtcbiAgICAgICAgaWYgKFRleHQubWF0Y2hUb2tlbihrLCBfdG9rZW4pKSB7XG4gICAgICAgICAgbmV4dC5wdXNoKHYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmIChjb25kaXRpb25zKSB7XG4gICAgICBsZXQgZmlsdGVyID0gW107XG4gICAgICBDb2xsZWN0aW9uLmVhY2gobmV4dCwgKGl0ZW0pID0+IHtcbiAgICAgICAgaWYgKENvcmUuaXNDb2xsZWN0aW9uKGl0ZW0pICYmIFRleHQubWF0Y2hlcyhpdGVtLCBjb25kaXRpb25zKSkge1xuICAgICAgICAgIGZpbHRlci5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG5leHQgPSBmaWx0ZXI7XG4gICAgfVxuICAgIGNvbnRleHQgPSB7W2tleV06IG5leHR9O1xuICB9KTtcblxuICByZXR1cm4gY29udGV4dFtrZXldO1xufSIsImltcG9ydCAqIGFzIENvcmUgZnJvbSBcIi4vdXRpbHMvY29yZVwiXG5pbXBvcnQgKiBhcyBDb2xsZWN0aW9uIGZyb20gXCIuL3V0aWxzL2NvbGxlY3Rpb25cIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmbGF0dGVuKGRhdGEsIHNlcGFyYXRvciA9IFwiLlwiKSB7XG4gIHJldHVybiBfZmxhdHRlbihkYXRhLCBzZXBhcmF0b3IpO1xufVxuXG5cbmZ1bmN0aW9uIF9mbGF0dGVuKGlucHV0LCBzZXBhcmF0b3IsIGN1cnJlbnRQYXRoID0gbnVsbCkge1xuICBsZXQgcmVzdWx0cyA9IHt9O1xuICBsZXQgcGF0aCA9IG51bGw7XG4gIFxuICBpZiAoQ29yZS5pc0FycmF5KGlucHV0KSAmJiBpbnB1dC5sZW5ndGggPT09IDApIHtcbiAgICBwYXRoID0gY3VycmVudFBhdGggPT0gbnVsbCA/IDAgOiBjdXJyZW50UGF0aDtcbiAgICByZXN1bHRzW3BhdGhdID0gaW5wdXQ7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBDb2xsZWN0aW9uLmVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcGF0aCA9IGN1cnJlbnRQYXRoID09IG51bGwgPyBrZXkgOiBgJHtjdXJyZW50UGF0aH0ke3NlcGFyYXRvcn0ke2tleX1gO1xuICAgIGlmIChDb3JlLmlzQ29sbGVjdGlvbih2YWwpKSB7XG4gICAgICBsZXQgY2hpbGRyZW4gPSBfZmxhdHRlbih2YWwsIHNlcGFyYXRvciwgcGF0aCk7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoY2hpbGRyZW4pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0cyA9IENvbGxlY3Rpb24ubWVyZ2UocmVzdWx0cywgY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZih2YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0c1twYXRoXSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBDb2xsZWN0aW9uLm9ialRvQXJyYXkocmVzdWx0cyk7XG59IiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiLi91dGlscy9jb3JlXCJcbmltcG9ydCAqIGFzIENvbGxlY3Rpb24gZnJvbSBcIi4vdXRpbHMvY29sbGVjdGlvblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldChkYXRhLCBwYXRoLCBkZWZhdWx0VmFsdWUgPSBudWxsKSB7XG4gIGxldCBwYXJ0cywgdmFsO1xuXG4gIGlmICghQ29yZS5pc0NvbGxlY3Rpb24oZGF0YSkpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgaWYgKENvcmUuZW1wdHkoZGF0YSkgfHwgcGF0aCA9PSBudWxsIHx8IHBhdGggPT09IFwiXCIgKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIGlmIChDb3JlLmlzU3RyaW5nKHBhdGgpIHx8IENvcmUuaXNOdW1lcmljKHBhdGgpKSB7XG4gICAgcGFydHMgPSAocGF0aCArIFwiXCIpLnNwbGl0KFwiLlwiKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIUNvcmUuaXNBcnJheShwYXRoKSkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcGFydHMgPSBwYXRoO1xuICB9XG5cbiAgdmFsID0gQ29yZS5pc0NvbGxlY3Rpb24oZGF0YSkgPyBDb2xsZWN0aW9uLmNsb25lKGRhdGEpIDogZGF0YTtcbiAgQ29sbGVjdGlvbi5lYWNoKHBhcnRzLCAodikgPT4ge1xuICAgIGlmIChDb3JlLmlzQ29sbGVjdGlvbih2YWwpICYmIENvbGxlY3Rpb24uaGFzUHJvcCh2YWwsIHYpKSB7XG4gICAgICB2YWwgPSB2YWxbdl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbCA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB2YWw7XG59IiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiLi91dGlscy9jb3JlXCJcbmltcG9ydCAqIGFzIENvbGxlY3Rpb24gZnJvbSBcIi4vdXRpbHMvY29sbGVjdGlvblwiXG5pbXBvcnQgKiBhcyBUZXh0IGZyb20gXCIuL3V0aWxzL3RleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnNlcnQoZGF0YSwgcGF0aCwgdmFsdWVzKSB7XG4gIGNvbnN0IG5vVG9rZW5zID0gcGF0aC5pbmRleE9mKFwiW1wiKSA8IDA7XG4gIGlmIChub1Rva2VucyAmJiBwYXRoLmluZGV4T2YoXCIuXCIpIDwgMCkge1xuICAgIGRhdGFbcGF0aF0gPSB2YWx1ZXM7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBsZXQgdG9rZW5zO1xuICBpZiAobm9Ub2tlbnMpIHtcbiAgICB0b2tlbnMgPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgfSBlbHNlIHtcbiAgICB0b2tlbnMgPSBUZXh0LnRva2VuaXplKHBhdGgsIFwiLlwiLCBcIltcIiwgXCJdXCIpO1xuICB9XG5cbiAgaWYgKG5vVG9rZW5zICYmIHBhdGguaW5kZXhPZihcIntcIikgPCAwKSB7XG4gICAgcmV0dXJuIENvbGxlY3Rpb24uc2ltcGxlT3AoXCJpbnNlcnRcIiwgZGF0YSwgdG9rZW5zLCB2YWx1ZXMpO1xuICB9XG5cbiAgbGV0IHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG4gIGxldCBuZXh0UGF0aCA9IHRva2Vucy5qb2luKFwiLlwiKTtcbiAgbGV0IFtfdG9rZW4sIGNvbmRpdGlvbnNdID0gVGV4dC5zcGxpdENvbmRpdGlvbnModG9rZW4pO1xuXG4gIENvbGxlY3Rpb24uZWFjaChkYXRhLCAodiwgaykgPT4ge1xuICAgIGlmIChUZXh0Lm1hdGNoVG9rZW4oaywgX3Rva2VuKSkge1xuICAgICAgaWYgKCFjb25kaXRpb25zIHx8IFRleHQubWF0Y2hlcyh2LCBjb25kaXRpb25zKSkge1xuICAgICAgICBkYXRhW2tdID0gbmV4dFBhdGggPyBpbnNlcnQodiwgbmV4dFBhdGgsIHZhbHVlcykgOiBDb2xsZWN0aW9uLm1lcmdlKHYsIHZhbHVlcyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn0iLCJpbXBvcnQgKiBhcyBDb3JlIGZyb20gXCIuL3V0aWxzL2NvcmVcIlxuaW1wb3J0ICogYXMgQ29sbGVjdGlvbiBmcm9tIFwiLi91dGlscy9jb2xsZWN0aW9uXCJcbmltcG9ydCBleHRyYWN0IGZyb20gXCIuL2V4dHJhY3RcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXAoZGF0YSwgcGF0aCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdmFsdWVzID0gQ29sbGVjdGlvbi5vYmpUb0FycmF5KGV4dHJhY3QoZGF0YSwgcGF0aCkpO1xuICByZXR1cm4gIUNvcmUuaXNBcnJheSh2YWx1ZXMpID8gbnVsbCA6IHZhbHVlcy5tYXAoY2FsbGJhY2spO1xufSIsImltcG9ydCAqIGFzIENvcmUgZnJvbSBcIi4vdXRpbHMvY29yZVwiXG5pbXBvcnQgKiBhcyBDb2xsZWN0aW9uIGZyb20gXCIuL3V0aWxzL2NvbGxlY3Rpb25cIlxuaW1wb3J0IGV4dHJhY3QgZnJvbSBcIi4vZXh0cmFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlZHVjZShkYXRhLCBwYXRoLCBjYWxsYmFjaykge1xuICBjb25zdCB2YWx1ZXMgPSBDb2xsZWN0aW9uLm9ialRvQXJyYXkoZXh0cmFjdChkYXRhLCBwYXRoKSk7XG4gIHJldHVybiAhQ29yZS5pc0FycmF5KHZhbHVlcykgPyBudWxsIDogdmFsdWVzLnJlZHVjZShjYWxsYmFjayk7XG59IiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiLi91dGlscy9jb3JlXCJcbmltcG9ydCAqIGFzIENvbGxlY3Rpb24gZnJvbSBcIi4vdXRpbHMvY29sbGVjdGlvblwiXG5pbXBvcnQgKiBhcyBUZXh0IGZyb20gXCIuL3V0aWxzL3RleHRcIlxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmUoZGF0YSwgcGF0aCkge1xuICBjb25zdCBub1Rva2VucyA9IHBhdGguaW5kZXhPZihcIltcIikgPCAwO1xuICBjb25zdCBub0V4cGFuc2lvbiA9IHBhdGguaW5kZXhPZihcIntcIikgPCAwO1xuXG4gIGlmIChub0V4cGFuc2lvbiAmJiBub1Rva2VucyAmJiBwYXRoLmluZGV4T2YoXCIuXCIpIDwgMCkge1xuICAgIGRlbGV0ZSBkYXRhW3BhdGhdO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgY29uc3QgdG9rZW5zID0gbm9Ub2tlbnMgPyBwYXRoLnNwbGl0KFwiLlwiKSA6IFRleHQudG9rZW5pemUocGF0aCwgXCIuXCIsIFwiW1wiLCBcIl1cIik7XG5cbiAgaWYgKG5vRXhwYW5zaW9uICYmIG5vVG9rZW5zKSB7XG4gICAgcmV0dXJuIENvbGxlY3Rpb24uc2ltcGxlT3AoXCJyZW1vdmVcIiwgZGF0YSwgdG9rZW5zKTtcbiAgfVxuXG4gIGxldCB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xuICBsZXQgbmV4dFBhdGggPSB0b2tlbnMuam9pbihcIi5cIik7XG4gIGxldCBbX3Rva2VuLCBjb25kaXRpb25zXSA9IFRleHQuc3BsaXRDb25kaXRpb25zKHRva2VuKTtcblxuICBDb2xsZWN0aW9uLmVhY2goZGF0YSwgKHYsIGspID0+IHtcbiAgICBsZXQgbWF0Y2ggPSBUZXh0Lm1hdGNoVG9rZW4oaywgX3Rva2VuKTtcbiAgICBpZiAobWF0Y2ggJiYgQ29yZS5pc0NvbGxlY3Rpb24odikpIHtcbiAgICAgIGlmIChjb25kaXRpb25zKSB7XG4gICAgICAgIGlmIChUZXh0Lm1hdGNoZXModiwgY29uZGl0aW9ucykpIHtcbiAgICAgICAgICBpZiAobmV4dFBhdGgpIHtcbiAgICAgICAgICAgIGRhdGFba10gPSByZW1vdmUodiwgbmV4dFBhdGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtrXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGFba10gPSByZW1vdmUodiwgbmV4dFBhdGgpO1xuICAgICAgfVxuICAgICAgaWYgKENvcmUuZW1wdHkoZGF0YVtrXSkpIHtcbiAgICAgICAgZGVsZXRlIGRhdGFba107XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtYXRjaCAmJiBDb3JlLmVtcHR5KG5leHRQYXRoKSkge1xuICAgICAgZGVsZXRlIGRhdGFba107XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn0iLCJjb25zdCBjbGFzc1R5cGVMaXN0ID0gW1wiQm9vbGVhblwiLCBcIk51bWJlclwiLCBcIlN0cmluZ1wiLCBcIkZ1bmN0aW9uXCIsIFwiQXJyYXlcIiwgXCJEYXRlXCIsIFwiUmVnRXhwXCIsIFwiT2JqZWN0XCIsIFwiRXJyb3JcIiwgXCJTeW1ib2xcIl07XG5jb25zdCBjbGFzc1R5cGVzID0ge307XG5cbmNsYXNzVHlwZUxpc3QuZm9yRWFjaCgobmFtZSkgPT4ge1xuICBjbGFzc1R5cGVzW2Bbb2JqZWN0ICR7bmFtZX1dYF0gPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG59KTtcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZShvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG9iaiArIFwiXCI7XG4gIH1cbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiID8gXG4gICAgY2xhc3NUeXBlc1tPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKV0gfHwgXCJvYmplY3RcIiA6XG4gICAgdHlwZW9mIG9iajtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuICFpc0FycmF5KG9iaikgJiYgZ2V0VHlwZShvYmopID09PSBcIm9iamVjdFwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gIHJldHVybiBnZXRUeXBlKG9iaikgPT09IFwibnVtYmVyXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgcmV0dXJuIGdldFR5cGUob2JqKSA9PT0gXCJzdHJpbmdcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm9vbGVhbihvYmopIHtcbiAgcmV0dXJuIGdldFR5cGUob2JqKSA9PT0gXCJib29sZWFuXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0NvbGxlY3Rpb24ob2JqKSB7XG4gIHJldHVybiBpc0FycmF5KG9iaikgfHwgaXNPYmplY3Qob2JqKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyhvYmopIHtcbiAgY29uc3QgdHlwZSA9IGdldFR5cGUob2JqKTtcbiAgcmV0dXJuICh0eXBlID09PSBcIm51bWJlclwiIHx8IHR5cGUgPT09IFwic3RyaW5nXCIpICYmIChvYmogLSBwYXJzZUZsb2F0KG9iaikgKyAxKSA+PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKG9iaikge1xuICBjb25zdCB0eXBlID0gZ2V0VHlwZShvYmopO1xuICByZXR1cm4gKHR5cGUgPT09IFwibnVtYmVyXCIgfHwgdHlwZSA9PT0gXCJzdHJpbmdcIikgJiYgL14oWzEtOV1cXGQqfDApJC8udGVzdChvYmopO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBlbXB0eShvYmopIHtcbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYoaXNPYmplY3Qob2JqKSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmKGlzTnVtZXJpYyhvYmopKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQob2JqKSA9PT0gMDtcbiAgfVxuICByZXR1cm4gIW9iajtcbn0iLCJpbXBvcnQgKiBhcyBDb3JlIGZyb20gXCIuL2NvcmVcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQcm9wKG9iaiwga2V5KSB7XG4gIHJldHVybiBvYmogJiYgb2JqLmhhc093blByb3BlcnR5KGtleSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lKG9iail7XG4gIGxldCBfaXNBcnJheSA9IENvcmUuaXNBcnJheShvYmopO1xuICBsZXQgX2lzT2JqZWN0ID0gQ29yZS5pc09iamVjdChvYmopO1xuXG4gIGlmICghX2lzQXJyYXkgJiYgIV9pc09iamVjdCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICBsZXQgcmVzdWx0ID0gX2lzQXJyYXkgPyBbXSA6IHt9LCBrZXksIHZhbDtcblxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIWhhc1Byb3Aob2JqLCBrZXkpKSBjb250aW51ZTtcbiAgICB2YWwgPSBvYmpba2V5XTtcbiAgICBpZihDb3JlLmlzQ29sbGVjdGlvbih2YWwpKSB2YWwgPSBjbG9uZSh2YWwpO1xuICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2Uob2JqLCBzb3VyY2UsIGRlZXAgPSBmYWxzZSkge1xuICBlYWNoKHNvdXJjZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICBpZiAoZGVlcCAmJiBoYXNQcm9wKG9iaiwga2V5KSAmJiBDb3JlLmlzQ29sbGVjdGlvbih2YWx1ZSkpIHtcbiAgICAgIG1lcmdlKG9ialtrZXldLCB2YWx1ZSwgZGVlcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdGUsIGNvbnRleHQpe1xuICBpZiAob2JqID09IG51bGwpIHJldHVybiBvYmo7XG5cbiAgY29udGV4dCA9IGNvbnRleHQgfHwgb2JqO1xuXG4gIGlmIChDb3JlLmlzT2JqZWN0KG9iaikpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIWhhc1Byb3Aob2JqLCBrZXkpKSBjb250aW51ZTtcbiAgICAgIGlmIChpdGVyYXRlLmNhbGwoY29udGV4dCwgb2JqW2tleV0sIGtleSkgPT09IGZhbHNlKSBicmVhaztcbiAgICB9XG5cbiAgfSBlbHNlIGlmIChDb3JlLmlzQXJyYXkob2JqKSkge1xuICAgIGxldCBpLCBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGl0ZXJhdGUuY2FsbChjb250ZXh0LCBvYmpbaV0sIGkpID09PSBmYWxzZSkgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb21iaW5lKGtleXMsIHZhbHVlcykge1xuICBsZXQgZGF0YSA9IHt9O1xuICBsZXQga2V5Q291bnQgPSBrZXlzICYmIGtleXMubGVuZ3RoO1xuICBsZXQgaSA9IDAsIGtleTtcblxuICBpZiAoXG4gICAgIUNvcmUuaXNDb2xsZWN0aW9uKGtleXMpIHx8ICFDb3JlLmlzQ29sbGVjdGlvbih2YWx1ZXMpIHx8XG4gICAgIUNvcmUuaXNOdW1iZXIoa2V5Q291bnQpIHx8ICFDb3JlLmlzTnVtYmVyKHZhbHVlcy5sZW5ndGgpIHx8XG4gICAgIWtleUNvdW50XG4gICkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGtleUNvdW50ICE9PSB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwga2V5Q291bnQ7IGkrKykge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgaWYgKENvcmUuaXNJbnRlZ2VyKGtleSkpIHtcbiAgICAgIGtleSA9IHBhcnNlSW50KGtleSwgMTApO1xuICAgIH1cbiAgICBkYXRhW2tleV0gPSB2YWx1ZXNbaV07XG4gIH1cblxuICByZXR1cm4gb2JqVG9BcnJheShkYXRhKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlGaWxsKHN0YXJ0SW5kZXgsIG51bSwgbWl4ZWRWYWwpIHtcbiAgbGV0IGtleSwgYXJyID0gW107XG4gIGlmICghaXNOYU4oc3RhcnRJbmRleCkgJiYgIWlzTmFOKG51bSkpIHtcbiAgICBmb3IgKGtleSA9IDA7IGtleSA8IG51bTsga2V5KyspIHtcbiAgICAgIGFyclsoa2V5ICsgc3RhcnRJbmRleCldID0gbWl4ZWRWYWw7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIG9ialRvQXJyYXkob2JqKSB7XG4gIGlmICghQ29yZS5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICBpZiAoIU9iamVjdC5rZXlzKG9iaikuZXZlcnkoKGtleSkgPT4gQ29yZS5pc0ludGVnZXIoa2V5KSkpIHJldHVybiBvYmo7XG5cbiAgbGV0IGFycmF5ID0gW107XG4gIGVhY2gob2JqLCAodmFsdWUsIGkpID0+IHtcbiAgICBhcnJheVtpXSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIGFycmF5O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaW1wbGVPcChvcCwgZGF0YSwgcGF0aCwgdmFsdWVzID0gbnVsbCkge1xuICBjb25zdCBsZW5ndGggPSBwYXRoLmxlbmd0aDtcbiAgY29uc3QgbGFzdCA9IGxlbmd0aCAtIDE7XG4gIGxldCBsaXN0ID0gZGF0YTtcblxuICBlYWNoKHBhdGgsIChrZXksIGkpID0+IHtcbiAgICBpZiAoKENvcmUuaXNOdW1lcmljKGtleSkgJiYgcGFyc2VJbnQoa2V5LCAxMCkgPiAwIHx8IGtleSA9PT0gXCIwXCIpICYmIGtleS5pbmRleE9mKFwiMFwiKSAhPT0gMCkge1xuICAgICAga2V5ID0gcGFyc2VJbnQoa2V5LCAxMCk7XG4gICAgfVxuICAgIHN3aXRjaCAob3ApIHtcbiAgICBjYXNlIFwiaW5zZXJ0XCI6XG4gICAgICBpZiAoaSA9PT0gbGFzdCkge1xuICAgICAgICBsaXN0W2tleV0gPSB2YWx1ZXM7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChsaXN0W2tleV0gPT0gbnVsbCB8fCAhaGFzUHJvcChsaXN0LCBrZXkpKSB7XG4gICAgICAgIGxpc3Rba2V5XSA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKCFDb3JlLmlzQ29sbGVjdGlvbihsaXN0W2tleV0pKSB7XG4gICAgICAgIGxpc3Rba2V5XSA9IHt9O1xuICAgICAgfVxuICAgICAgbGlzdCA9IGxpc3Rba2V5XTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBcInJlbW92ZVwiOlxuICAgICAgaWYgKGkgPT09IGxhc3QpIHtcbiAgICAgICAgZGVsZXRlIGxpc3Rba2V5XTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGxpc3Rba2V5XSA9PSBudWxsIHx8ICFoYXNQcm9wKGxpc3QsIGtleSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbGlzdCA9IGxpc3Rba2V5XTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59IiwiY29uc3QgY2xhc3NUeXBlTGlzdCA9IFtcIkJvb2xlYW5cIiwgXCJOdW1iZXJcIiwgXCJTdHJpbmdcIiwgXCJGdW5jdGlvblwiLCBcIkFycmF5XCIsIFwiRGF0ZVwiLCBcIlJlZ0V4cFwiLCBcIk9iamVjdFwiLCBcIkVycm9yXCIsIFwiU3ltYm9sXCJdO1xuY29uc3QgY2xhc3NUeXBlcyA9IHt9O1xuXG5jbGFzc1R5cGVMaXN0LmZvckVhY2goKG5hbWUpID0+IHtcbiAgY2xhc3NUeXBlc1tgW29iamVjdCAke25hbWV9XWBdID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xufSk7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGUob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHJldHVybiBvYmogKyBcIlwiO1xuICB9XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/IFxuICAgIGNsYXNzVHlwZXNbT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaildIHx8IFwib2JqZWN0XCIgOlxuICAgIHR5cGVvZiBvYmo7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiAhaXNBcnJheShvYmopICYmIGdldFR5cGUob2JqKSA9PT0gXCJvYmplY3RcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICByZXR1cm4gZ2V0VHlwZShvYmopID09PSBcIm51bWJlclwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gIHJldHVybiBnZXRUeXBlKG9iaikgPT09IFwic3RyaW5nXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKSB7XG4gIHJldHVybiBnZXRUeXBlKG9iaikgPT09IFwiYm9vbGVhblwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb2xsZWN0aW9uKG9iaikge1xuICByZXR1cm4gaXNBcnJheShvYmopIHx8IGlzT2JqZWN0KG9iaik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMob2JqKSB7XG4gIGNvbnN0IHR5cGUgPSBnZXRUeXBlKG9iaik7XG4gIHJldHVybiAodHlwZSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlID09PSBcInN0cmluZ1wiKSAmJiAob2JqIC0gcGFyc2VGbG9hdChvYmopICsgMSkgPj0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZWdlcihvYmopIHtcbiAgY29uc3QgdHlwZSA9IGdldFR5cGUob2JqKTtcbiAgcmV0dXJuICh0eXBlID09PSBcIm51bWJlclwiIHx8IHR5cGUgPT09IFwic3RyaW5nXCIpICYmIC9eKFsxLTldXFxkKnwwKSQvLnRlc3Qob2JqKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkob2JqKSB7XG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmKGlzT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH0gZWxzZSBpZihpc051bWVyaWMob2JqKSkge1xuICAgIHJldHVybiBwYXJzZUZsb2F0KG9iaikgPT09IDA7XG4gIH1cbiAgcmV0dXJuICFvYmo7XG59IiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiLi9jb3JlXCJcbmltcG9ydCAqIGFzIENvbGxlY3Rpb24gZnJvbSBcIi4vY29sbGVjdGlvblwiXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW0oaW5wdXQpe1xuICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRva2VuaXplKHN0ciwgc2VwYXJhdG9yID0gXCIsXCIsIGxlZnQgPSBcIihcIiwgcmlnaHQgPSBcIilcIikge1xuICBpZiggQ29yZS5lbXB0eShzdHIpICl7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgbGV0IGRlcHRoID0gMDtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGxldCBidWZmZXIgPSBcIlwiO1xuICBsZXQgcmVzdWx0cyA9IFtdO1xuICBsZXQgbGVuZ3RoID0gc3RyLmxlbmd0aDtcbiAgbGV0IG9wZW4gPSBmYWxzZTtcblxuICB3aGlsZSAob2Zmc2V0IDw9IGxlbmd0aCkge1xuICAgIGxldCB0bXBPZmZzZXQgPSAtMTtcbiAgICBsZXQgb2Zmc2V0cyA9IFtcbiAgICAgIHN0ci5pbmRleE9mKHNlcGFyYXRvciwgb2Zmc2V0KSxcbiAgICAgIHN0ci5pbmRleE9mKGxlZnQsIG9mZnNldCksXG4gICAgICBzdHIuaW5kZXhPZihyaWdodCwgb2Zmc2V0KVxuICAgIF07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGlmIChvZmZzZXRzW2ldICE9PSAtMSAmJiAob2Zmc2V0c1tpXSA8IHRtcE9mZnNldCB8fCB0bXBPZmZzZXQgPT09IC0xKSkge1xuICAgICAgICB0bXBPZmZzZXQgPSBvZmZzZXRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodG1wT2Zmc2V0ICE9PSAtMSkge1xuICAgICAgYnVmZmVyICs9IHN0ci5zdWJzdHIob2Zmc2V0LCAodG1wT2Zmc2V0IC0gb2Zmc2V0KSk7XG4gICAgICBsZXQgY2hhciA9IHN0ci5zdWJzdHIodG1wT2Zmc2V0LCAxKTtcbiAgICAgIGlmICghZGVwdGggJiYgY2hhciA9PT0gc2VwYXJhdG9yKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChidWZmZXIpO1xuICAgICAgICBidWZmZXIgPSBcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyICs9IGNoYXI7XG4gICAgICB9XG4gICAgICBpZiAobGVmdCAhPT0gcmlnaHQpIHtcbiAgICAgICAgaWYgKGNoYXIgPT09IGxlZnQpIHtcbiAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGFyID09PSByaWdodCkge1xuICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjaGFyID09PSBsZWZ0KSB7XG4gICAgICAgICAgaWYgKCFvcGVuKSB7XG4gICAgICAgICAgICBkZXB0aCsrO1xuICAgICAgICAgICAgb3BlbiA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvZmZzZXQgPSArK3RtcE9mZnNldDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0cy5wdXNoKGJ1ZmZlciArIHN0ci5zdWJzdHIob2Zmc2V0KSk7XG4gICAgICBvZmZzZXQgPSBsZW5ndGggKyAxO1xuICAgIH1cbiAgfVxuXG4gIGlmIChDb3JlLmVtcHR5KHJlc3VsdHMpICYmICFDb3JlLmVtcHR5KGJ1ZmZlcikpIHtcbiAgICByZXN1bHRzLnB1c2goYnVmZmVyKTtcbiAgfVxuXG4gIGlmICghQ29yZS5lbXB0eShyZXN1bHRzKSkge1xuICAgIHJldHVybiByZXN1bHRzLm1hcCh2YWwgPT4gdHJpbSh2YWwpKTtcbiAgfVxuXG4gIHJldHVybiBbXTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRDb25kaXRpb25zKHRva2VuKSB7XG4gIGxldCBjb25kaXRpb25zID0gZmFsc2U7XG4gIGxldCBwb3NpdGlvbiA9IHRva2VuLmluZGV4T2YoXCJbXCIpO1xuICBpZiAocG9zaXRpb24gPiAtMSkge1xuICAgIGNvbmRpdGlvbnMgPSB0b2tlbi5zdWJzdHIocG9zaXRpb24pO1xuICAgIHRva2VuID0gdG9rZW4uc3Vic3RyKDAsIHBvc2l0aW9uKTtcbiAgfVxuICByZXR1cm4gW3Rva2VuLCBjb25kaXRpb25zXTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hUb2tlbihrZXksIHRva2VuKSB7XG4gIHN3aXRjaCAodG9rZW4pIHtcbiAgY2FzZSBcIntufVwiOlxuICAgIHJldHVybiBDb3JlLmlzTnVtZXJpYyhrZXkpO1xuICBjYXNlIFwie3N9XCI6XG4gICAgcmV0dXJuIENvcmUuaXNTdHJpbmcoa2V5KTtcbiAgY2FzZSBcInsqfVwiOlxuICAgIHJldHVybiB0cnVlO1xuICBkZWZhdWx0OlxuICAgIHJldHVybiBDb3JlLmlzTnVtZXJpYyh0b2tlbikgPyAoa2V5ID09IHRva2VuKSA6IGtleSA9PT0gdG9rZW47XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hlcyhkYXRhLCBzZWxlY3Rvcikge1xuICBjb25zdCBpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXC58W1xcXFx3LV9cXC5dfFteXFxcXHgwMC1cXFxceGEwXSkrXCI7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBuZXcgUmVnRXhwKGBcXFxccyooJHtpZGVudGlmaWVyfSkoPzpcXFxccyooWz48IV0/Wz1dfFs+PF0pXFxcXHMqKFxcXFwvLio/XFxcXC98JHtpZGVudGlmaWVyfSl8KVxcXFxzKlxcXWAsIFwiZ1wiKTtcbiAgbGV0IGNvbmQ7XG5cbiAgd2hpbGUgKGNvbmQgPSBhdHRyaWJ1dGVzLmV4ZWMoc2VsZWN0b3IpKSB7XG4gICAgY29uc3QgYXR0ciA9IGNvbmRbMV07XG4gICAgY29uc3Qgb3AgPSBjb25kWzJdIHx8IG51bGw7XG4gICAgY29uc3QgdmFsID0gY29uZFszXSB8fCBudWxsO1xuICAgIGNvbnN0IGhhc1Byb3BlcnR5ID0gQ29sbGVjdGlvbi5oYXNQcm9wKGRhdGEsIGF0dHIpO1xuXG4gICAgaWYgKENvcmUuZW1wdHkob3ApICYmIENvcmUuZW1wdHkodmFsKSAmJiAhaGFzUHJvcGVydHkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIShoYXNQcm9wZXJ0eSB8fCBkYXRhW2F0dHJdICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHByb3AgPSBoYXNQcm9wZXJ0eSA/IHByb3AgPSBkYXRhW2F0dHJdIDogdW5kZWZpbmVkO1xuICAgIGxldCBfaXNCb29sZWFuID0gQ29yZS5pc0Jvb2xlYW4ocHJvcCkgfHwgKHByb3AgPT09IFwidHJ1ZVwiIHx8IHByb3AgPT09IFwiZmFsc2VcIik7XG5cbiAgICBpZiAoX2lzQm9vbGVhbiAmJiBDb3JlLmlzTnVtZXJpYyh2YWwpKSB7XG4gICAgICBwcm9wID0gcHJvcCA/IFwiMVwiOiBcIjBcIjtcbiAgICB9IGVsc2UgaWYoX2lzQm9vbGVhbikge1xuICAgICAgcHJvcCA9IHByb3AgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcbiAgICB9XG5cbiAgICBpZiAob3AgPT09IFwiPVwiICYmIHZhbCAmJiB2YWxbMF0gPT09IFwiL1wiICYmIHZhbFt2YWwubGVuZ3RoIC0gMV0gPT09IFwiL1wiKSB7XG4gICAgICBwcm9wID0gQ29yZS5pc1N0cmluZyhwcm9wKSB8fCBDb3JlLmlzTnVtZXJpYyhwcm9wKSA/IHByb3AgOiBcIlwiO1xuICAgICAgaWYgKCFuZXcgUmVnRXhwKHZhbC5zdWJzdHIoMSwgdmFsLmxlbmd0aCAtIDIpKS50ZXN0KHByb3ApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKChvcCA9PT0gXCI9XCIgJiYgcHJvcCAhPSB2YWwpIHx8XG4gICAgICAob3AgPT09IFwiIT1cIiAmJiBwcm9wID09IHZhbCkgfHxcbiAgICAgIChvcCA9PT0gXCI+XCIgJiYgcHJvcCA8PSB2YWwpIHx8XG4gICAgICAob3AgPT09IFwiPFwiICYmIHByb3AgPj0gdmFsKSB8fFxuICAgICAgKG9wID09PSBcIj49XCIgJiYgcHJvcCA8IHZhbCkgfHxcbiAgICAgIChvcCA9PT0gXCI8PVwiICYmIHByb3AgPiB2YWwpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59Il19
