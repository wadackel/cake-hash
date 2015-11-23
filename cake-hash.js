/*!
 * cake-hash
 * CakePHP in Utility.Hash class like a collection manipulation. In JavaScript.
 * 
 * @author tsuyoshiwada
 * @homepage https://github.com/tsuyoshiwada/cake-hash
 * @license MIT
 * @version 0.0.5
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.CakeHash = factory();
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.typeof = function (obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  babelHelpers.slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

  babelHelpers;
  var classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
  var classTypes = {};

  classTypeList.forEach(function (name) {
    classTypes["[object " + name + "]"] = name.toLowerCase();
  });

  function getType(obj) {
    if (obj == null) {
      return obj + "";
    }
    return (typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj)) === "object" || typeof obj === "function" ? classTypes[Object.prototype.toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);
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

  function hasProp(obj, key) {
    return obj && obj.hasOwnProperty(key);
  }

  function clone(obj) {
    var _isArray = isArray(obj);
    var _isObject = isObject(obj);

    if (!_isArray && !_isObject) return undefined;

    var result = _isArray ? [] : {},
        key = undefined,
        val = undefined;

    for (key in obj) {
      if (!hasProp(obj, key)) continue;
      val = obj[key];
      if (isCollection(val)) val = clone(val);
      result[key] = val;
    }

    return result;
  }

  function merge(obj, source) {
    var deep = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    each(source, function (value, key) {
      if (deep && hasProp(obj, key) && isCollection(value)) {
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

    if (isObject(obj)) {
      for (var key in obj) {
        if (!hasProp(obj, key)) continue;
        if (iterate.call(context, obj[key], key) === false) break;
      }
    } else if (isArray(obj)) {
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

    if (!isCollection(keys) || !isCollection(values) || !isNumber(keyCount) || !isNumber(values.length) || !keyCount) {
      return null;
    }

    if (keyCount !== values.length) {
      return null;
    }

    for (i = 0; i < keyCount; i++) {
      key = keys[i];
      if (isInteger(key)) {
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
    if (!isObject(obj)) return obj;
    if (!Object.keys(obj).every(function (key) {
      return isInteger(key);
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
      if ((isNumeric(key) && parseInt(key, 10) > 0 || key === "0") && key.indexOf("0") !== 0) {
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
          if (!isCollection(list[key])) {
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

  function trim(input) {
    return input.replace(/^\s+|\s+$/g, "");
  }

  function split(input, separator) {
    var tokens = (input + "").split(separator);
    var results = [];
    var previousValue = null;

    each(tokens, function (token, i) {
      if (/^.*\\$/.test(token)) {
        previousValue = token;
      } else {
        if (previousValue != null) {
          token = previousValue.slice(0, previousValue.length - 1) + separator + token;
          previousValue = null;
        }
        results.push(token);
      }
    });

    return results;
  }

  function tokenize(str) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? "," : arguments[1];
    var left = arguments.length <= 2 || arguments[2] === undefined ? "(" : arguments[2];
    var right = arguments.length <= 3 || arguments[3] === undefined ? ")" : arguments[3];

    if (empty(str)) {
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
      // console.log(depth, buffer);
      if (tmpOffset !== -1) {
        buffer += str.substr(offset, tmpOffset - offset);
        var char = str.substr(tmpOffset, 1);
        if (!depth && char === separator && str.substr(tmpOffset - 1, 1) !== "\\") {
          results.push(buffer);
          buffer = "";
        } else {
          if (depth === 0 && /^.*\\$/.test(buffer)) {
            buffer = buffer.slice(0, buffer.length - 1) + char;
          } else {
            buffer += char;
          }
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

    if (empty(results) && !empty(buffer)) {
      results.push(buffer);
    }

    if (!empty(results)) {
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
        return isNumeric(key);
      case "{s}":
        return isString(key);
      case "{*}":
        return true;
      default:
        return isNumeric(token) ? key == token : key === token;
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
      var hasProperty = hasProp(data, attr);

      if (empty(op) && empty(val) && !hasProperty) {
        return false;
      }

      if (!(hasProperty || data[attr] != null)) {
        return false;
      }

      var prop = hasProperty ? prop = data[attr] : undefined;
      var _isBoolean = isBoolean(prop) || prop === "true" || prop === "false";

      if (_isBoolean && isNumeric(val)) {
        prop = prop ? "1" : "0";
      } else if (_isBoolean) {
        prop = prop ? "true" : "false";
      }

      if (op === "=" && val && val[0] === "/" && val[val.length - 1] === "/") {
        prop = isString(prop) || isNumeric(prop) ? prop : "";
        if (!new RegExp(val.substr(1, val.length - 2)).test(prop)) {
          return false;
        }
      } else if (op === "=" && prop != val || op === "!=" && prop == val || op === ">" && prop <= val || op === "<" && prop >= val || op === ">=" && prop < val || op === "<=" && prop > val) {
        return false;
      }
    }

    return true;
  }

  function get(data, path) {
    var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var parts = undefined,
        val = undefined;

    if (!isCollection(data)) {
      return defaultValue;
    }

    if (empty(data) || path == null || path === "") {
      return defaultValue;
    }

    if (isString(path) || isNumeric(path)) {
      parts = split(path, ".");
    } else {
      if (!isArray(path)) {
        return defaultValue;
      }
      parts = path;
    }

    val = isCollection(data) ? clone(data) : data;
    each(parts, function (v) {
      if (isCollection(val) && hasProp(val, v)) {
        val = val[v];
      } else {
        val = defaultValue;
        return false;
      }
    });

    return val;
  }

  function extract(data, path) {
    if (!isCollection(data)) {
      return null;
    }

    if (empty(path)) {
      return data;
    }

    if (!/[{\[]/.test(path)) {
      return get(data, path, null);
    }

    var key = "__set_item__";
    var tokens = undefined;
    var context = babelHelpers.defineProperty({}, key, [data]);

    if (path.indexOf("[") < 0) {
      tokens = split(path, ".");
    } else {
      tokens = tokenize(path, ".", "[", "]");
    }

    each(tokens, function (token) {
      var next = [];

      var _Text$splitConditions = splitConditions(token);

      var _Text$splitConditions2 = babelHelpers.slicedToArray(_Text$splitConditions, 2);

      var _token = _Text$splitConditions2[0];
      var conditions = _Text$splitConditions2[1];

      each(context[key], function (item) {
        each(item, function (v, k) {
          if (matchToken(k, _token)) {
            next.push(v);
          }
        });
      });

      if (conditions) {
        (function () {
          var filter = [];
          each(next, function (item) {
            if (isCollection(item) && matches(item, conditions)) {
              filter.push(item);
            }
          });
          next = filter;
        })();
      }
      context = babelHelpers.defineProperty({}, key, next);
    });

    return context[key];
  }

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
      tokens = tokenize(path, ".", "[", "]");
    }

    if (noTokens && path.indexOf("{") < 0) {
      return simpleOp("insert", data, tokens, value);
    }

    var token = tokens.shift();
    var nextPath = tokens.join(".");

    var _Text$splitConditions = splitConditions(token);

    var _Text$splitConditions2 = babelHelpers.slicedToArray(_Text$splitConditions, 2);

    var _token = _Text$splitConditions2[0];
    var conditions = _Text$splitConditions2[1];

    each(data, function (v, k) {
      if (matchToken(k, _token)) {
        if (!conditions || matches(v, conditions)) {
          data[k] = nextPath ? insert(v, nextPath, value) : merge(v, value);
        }
      }
    });

    return data;
  }

  function remove(data, path) {
    var noTokens = path.indexOf("[") < 0;
    var noExpansion = path.indexOf("{") < 0;

    if (noExpansion && noTokens && path.indexOf(".") < 0) {
      delete data[path];
      return data;
    }

    var tokens = noTokens ? path.split(".") : tokenize(path, ".", "[", "]");

    if (noExpansion && noTokens) {
      return simpleOp("remove", data, tokens);
    }

    var token = tokens.shift();
    var nextPath = tokens.join(".");

    var _Text$splitConditions = splitConditions(token);

    var _Text$splitConditions2 = babelHelpers.slicedToArray(_Text$splitConditions, 2);

    var _token = _Text$splitConditions2[0];
    var conditions = _Text$splitConditions2[1];

    each(data, function (v, k) {
      var match = matchToken(k, _token);
      if (match && isCollection(v)) {
        if (conditions) {
          if (matches(v, conditions)) {
            if (nextPath) {
              data[k] = remove(v, nextPath);
            } else {
              delete data[k];
            }
          }
        } else {
          data[k] = remove(v, nextPath);
        }
        if (empty(data[k])) {
          delete data[k];
        }
      } else if (match && empty(nextPath)) {
        delete data[k];
      }
    });

    return data;
  }

  function combine(data, keyPath) {
    var valuePath = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var groupPath = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    if (empty(data)) {
      return [];
    }

    var keys = extract(data, keyPath);
    var vals = undefined;

    if (empty(keys)) {
      return [];
    }

    if (!empty(valuePath)) {
      vals = extract(data, valuePath);
    }
    if (empty(vals)) {
      vals = arrayFill(0, keys.length, null);
    }

    if (keys.length !== vals.length) {
      return [];
    }

    if (groupPath != null) {
      var group = extract(data, groupPath);
      if (!empty(group)) {
        var c = keys.length;
        var out = {};
        for (var i = 0; i < c; i++) {
          if (group[i] == null || !hasProp(group, i)) {
            group[i] = 0;
          }
          if (out[group[i]] == null || !hasProp(out, group[i])) {
            out[group[i]] = {};
          }
          out[group[i]][keys[i]] = vals[i];
        }
        return objToArray(out);
      }
    }

    if (empty(vals)) {
      return [];
    }

    return arrayCombine(keys, vals);
  }

  function check(data, path) {
    var results = extract(data, path);

    if (isCollection(results)) {
      return !empty(results);
    }

    return results != null;
  }

  function flatten(data) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? "." : arguments[1];

    return _flatten(data, separator);
  }

  function _flatten(input, separator) {
    var currentPath = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var results = {};
    var path = null;

    if (isArray(input) && input.length === 0) {
      path = currentPath == null ? 0 : currentPath;
      results[path] = input;
      return results;
    }

    each(input, function (val, key) {
      key = (key + "").split(separator).join("\\" + separator);
      path = currentPath == null ? key : "" + currentPath + separator + key;
      if (isCollection(val)) {
        var children = _flatten(val, separator, path);
        if (Object.keys(children).length > 0) {
          results = merge(results, children);
        }
      } else if (val !== undefined) {
        results[path] = val;
      }
    });

    return objToArray(results);
  }

  function expand(data) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? "." : arguments[1];

    var results = {};

    each(data, function (value, flat) {
      var keys = split(flat, separator).reverse();
      var child = {};
      child[keys.shift()] = value;
      each(keys, function (k) {
        child = babelHelpers.defineProperty({}, k, child);
      });
      results = merge(results, child, true);
    });

    return objToArray(results);
  }

  function map(data, path, callback) {
    var values = objToArray(extract(data, path));
    return !isArray(values) ? null : values.map(callback);
  }

  function reduce(data, path, callback) {
    var values = objToArray(extract(data, path));
    return !isArray(values) ? null : values.reduce(callback);
  }

  var VERSION = "0.0.5";

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

  return CakeHash;

}));