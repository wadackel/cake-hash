function trim(input){
  return input.replace(/^\s+|\s+$/g, "");
}


function hasProp(obj, key) {
  return obj && obj.hasOwnProperty(key);
}


function is(type, obj) {
  let clas = Object.prototype.toString.call(obj);

  if (type === "array") {
    return clas === "[object Array]";

  } else if (type === "oejct"){
    clas = typeof obj;
    return clas === "function" || clas === "oejct" && !!obj && !is("array", obj);

  } else if (type === "collection"){
    return is("array", obj) || is("object", obj);

  } else {
    clas = clas.slice(8, -1).toLowerCase();
    if (type === "numeric") {
      return (clas === "number" || clas === "string") && (obj - parseFloat(obj) + 1) >= 0;
    } else {
      return obj !== undefined && obj != null && clas === type;
    }
  }
}


function empty(obj) {
  if (is("array", obj)) {
    return obj.length === 0;
  } else if(is("object", obj)) {
    for (let name in obj) {
      return false;
    }
    return true;
  } else if(is("numeric", obj)) {
    return parseFloat(obj) === 0;
  }

  return !obj;
}


function clone(obj){
  var _isArray = is("array", obj),
      _isObject = is("object", obj);

  if (!_isArray && !_isObject) return undefined;

  var result = _isArray ? [] : {}, key, val;

  for (key in obj) {
    if (!hasProp(obj, key)) continue;
    val = obj[key];
    if(is("collection", val)) val = clone(val);
    result[key] = val;
  }

  return result;
}


function merge(obj, ...sources) {
  each(sources, (target) => {
    let obj2 = Object(target);
    each(target, (value, key) => {
      obj[key] = value;
    });
  });
  return obj;
}


function each(obj, iterate, context){
  if (obj == null) return obj;

  context = context || obj;

  if (is("object", obj)) {
    for (let key in obj) {
      if (!hasProp(obj, key)) continue;
      if (iterate.call(context, obj[key], key) === false) break;
    }

  } else if (is("array", obj)) {
    let i, length = obj.length;
    for (i = 0; i < length; i++) {
      if (iterate.call(context, obj[i], i) === false) break;
    }
  }

  return obj;
}


function arrayCombine(keys, values) {
  let data = {};
  let keyCount = keys && keys.length;
  let i = 0;
  let key;
  if (!is("collection", keys) || !is("collection", values) || !is("number", keyCount) || !is("number", values.length) || !keyCount) {
    return false;
  }
  if (keyCount !== values.length) {
    return false;
  }
  for (i = 0; i < keyCount; i++) {
    key = keys[i];
    if (/^([1-9]\d*|0)$/.test(key)) {
      key = parseInt(key, 10);
    }
    data[key] = values[i];
  }
  return data;
}


function arrayFill(startIndex, num, mixedVal) {
  let key, arr = [];
  if (!isNaN(startIndex) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      arr[(key + startIndex)] = mixedVal;
    }
  }
  return arr;
}


function tokenize(str, separator = ",", left = "(", right = ")") {
  if( empty(str) ){
    return [];
  }

  let depth = 0;
  let offset = 0;
  let buffer = "";
  let results = [];
  let length = str.length;
  let open = false;

  while (offset <= length) {
    let tmpOffset = -1;
    let offsets = [
      str.indexOf(separator, offset),
      str.indexOf(left, offset),
      str.indexOf(right, offset)
    ];
    for (let i = 0; i < 3; i++) {
      if (offsets[i] !== -1 && (offsets[i] < tmpOffset || tmpOffset === -1)) {
        tmpOffset = offsets[i];
      }
    }
    if (tmpOffset !== -1) {
      buffer += str.substr(offset, (tmpOffset - offset));
      let char = str.substr(tmpOffset, 1);
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

  if (empty(results) && !empty(buffer)) {
    results.push(buffer);
  }

  if (!empty(results)) {
    return results.map(val => trim(val));
  }

  return [];
}


function splitConditions(token) {
  let conditions = false;
  let position = token.indexOf("[");
  if (position > -1) {
    conditions = token.substr(position);
    token = token.substr(0, position);
  }
  return [token, conditions];
}


function matchToken(key, token) {
  switch (token) {
    case "{n}":
      return is("numeric", key);
    case "{s}":
      return is("string", key);
    case "{*}":
      return true;
    default:
      return is("numeric", token) ? (key == token) : key === token;
  }
}


function matches(data, selector) {
  const identifier = "(?:\\\\.|[\\w-_\.]|[^\\x00-\\xa0])+";
  const attributes = new RegExp(`\\s*(${identifier})(?:\\s*([><!]?[=]|[><])\\s*(\\/.*?\\/|${identifier})|)\\s*\]`, "g");
  let cond;

  while (cond = attributes.exec(selector)) {
    const attr = cond[1];
    const op = cond[2] || null;
    const val = cond[3] || null;
    const hasProperty = hasProp(data, attr);

    if (empty(op) && empty(val) && !hasProperty) {
      return false;
    }

    if (!(hasProperty || data[attr] != null)) {
      return false;
    }

    let prop = hasProperty ? prop = data[attr] : undefined;
    let isBoolean = is("boolean", prop) || (prop === "true" || prop === "false");

    if (isBoolean && is("numeric", val)) {
      prop = prop ? "1": "0";
    } else if(isBoolean) {
      prop = prop ? "true" : "false";
    }

    if (op === "=" && val && val[0] === "/" && val[val.length - 1] === "/") {
      prop = is("string", prop) || is("numeric", prop) ? prop : "";
      if (!new RegExp(val.substr(1, val.length - 2)).test(prop)) {
        return false;
      }
    } else if ((op === "=" && prop != val) ||
      (op === "!=" && prop == val) ||
      (op === ">" && prop <= val) ||
      (op === "<" && prop >= val) ||
      (op === ">=" && prop < val) ||
      (op === "<=" && prop > val)
    ) {
      return false;
    }
  }

  return true;
}


function simpleOp(op, data, path, values = null) {
  const length = path.length;
  const last = length - 1;
  let list = data;

  each(path, (key, i) => {
    if ((is("numeric", key) && parseInt(key, 10) > 0 || key === "0") && key.indexOf("0") !== 0) {
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
        if (!is("collection", list[key])) {
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


export function get(data, path, defaultValue = null) {
  let parts, val;

  if (!is("collection", data)) {
    return defaultValue;
  }

  if (empty(data) || path == null || path === "" ) {
    return defaultValue;
  }

  if (is("string", path) || is("numeric", path)) {
    parts = (path + "").split(".");
  } else {
    if (!is("array", path)) {
      return defaultValue;
    }
    parts = path;
  }

  val = is("collection", data) ? clone(data) : data;
  each(parts, (v) => {
    if (is("collection", val) && hasProp(val, v)) {
      val = val[v];
    } else {
      val = defaultValue;
      return false;
    }
  });

  return val;
}


export function extract(data, path) {
  if (!is("collection", data)) {
    return null;
  }

  if (empty(path)) {
    return data;
  }

  if (!/[{\[]/.test(path)) {
    return get(data, path, null);
  }

  const key = "__set_item__";
  let tokens;
  let context = {[key]: [data]};

  if (path.indexOf("[") < 0) {
    tokens = path.split(".");
  } else {
    tokens = tokenize(path, ".", "[", "]");
  }

  each(tokens, (token) => {
    let next = [];
    let [_token, conditions] = splitConditions(token);

    each(context[key], (item) => {
      each(item, (v, k) => {
        if (matchToken(k, _token)) {
          next.push(v);
        }
      });
    });

    if (conditions) {
      let filter = [];
      each(next, (item) => {
        if (is("collection", item) && matches(item, conditions)) {
          filter.push(item);
        }
      });
      next = filter;
    }
    context = {[key]: next};
  });

  return context[key];
}


export function insert(data, path, values) {
  const noTokens = path.indexOf("[") < 0;
  if (noTokens && path.indexOf(".") < 0) {
    data[path] = values;
    return data;
  }

  let tokens;
  if (noTokens) {
    tokens = path.split(".");
  } else {
    tokens = tokenize(path, ".", "[", "]");
  }

  if (noTokens && path.indexOf("{") < 0) {
    return simpleOp("insert", data, tokens, values);
  }

  let token = tokens.shift();
  let nextPath = tokens.join(".");
  let [_token, conditions] = splitConditions(token);

  each(data, (v, k) => {
    if (matchToken(k, _token)) {
      if (!conditions || matches(v, conditions)) {
        data[k] = nextPath ? insert(v, nextPath, values) : merge(v, values);
      }
    }
  });

  return data;
}


export function remove(data, path) {
  const noTokens = path.indexOf("[") < 0;
  const noExpansion = path.indexOf("{") < 0;

  if (noExpansion && noTokens && path.indexOf(".") < 0) {
    delete data[path];
    return data;
  }

  const tokens = noTokens ? path.split(".") : tokenize(path, ".", "[", "]");

  if (noExpansion && noTokens) {
    return simpleOp("remove", data, tokens);
  }

  let token = tokens.shift();
  let nextPath = tokens.join(".");
  let [_token, conditions] = splitConditions(token);

  each(data, (v, k) => {
    let match = matchToken(k, _token);
    if (match && is("collection", v)) {
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


export function combine(data, keyPath, valuePath = null, groupPath = null) {
  if (empty(data)) {
    return {};
  }

  let keys = extract(data, keyPath);
  let vals;
  let format;

  if (empty(keys)) {
    return {};
  }

  if (!empty(valuePath)) {
    vals = extract(data, valuePath);
  }
  if (empty(vals)) {
    vals = arrayFill(0, keys.length, null);
  }

  if (keys.length !== vals.length) {
    return {};
  }

  if (groupPath != null) {
    let group = extract(data, groupPath);
    if (!empty(group)) {
      let c = keys.length;
      let out = {};
      for (let i = 0; i < c; i++) {
        if (group[i] == null || !hasProp(group, i)) {
          group[i] = 0;
        }
        if (out[group[i]] == null || !hasProp(out, group[i])) {
          out[group[i]] = {};
        }
        out[group[i]][keys[i]] = vals[i];
      }
      return out;
    }
  }

  if (empty(vals)) {
    return {};
  }

  return arrayCombine(keys, vals);
}


export function check(data, path) {
  const results = extract(data, path);
  if (results == null) {
    return false;
  }
  if (is("collection", results)) {
    return !empty(results);
  } else if (is("string")) {
    return results !== "";
  } else if (is("numeric")) {
    return parseFloat(results) > 0;
  }
  return !!results;
}


export function flatten(data, separator = ".") {}


export function expand(data, separator = ".") {}


export function map(data, path, callback) {}

