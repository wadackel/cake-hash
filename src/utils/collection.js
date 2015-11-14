import * as Core from "./core"


export function hasProp(obj, key) {
  return obj && obj.hasOwnProperty(key);
}


export function clone(obj){
  let _isArray = Core.isArray(obj);
  let _isObject = Core.isObject(obj);

  if (!_isArray && !_isObject) return undefined;

  let result = _isArray ? [] : {}, key, val;

  for (key in obj) {
    if (!hasProp(obj, key)) continue;
    val = obj[key];
    if(Core.isCollection(val)) val = clone(val);
    result[key] = val;
  }

  return result;
}


export function merge(obj, source, deep = false) {
  each(source, (value, key) => {
    if (deep && hasProp(obj, key) && Core.isCollection(value)) {
      merge(obj[key], value, deep);
    } else {
      obj[key] = value;
    }
  });
  return obj;
}


export function each(obj, iterate, context){
  if (obj == null) return obj;

  context = context || obj;

  if (Core.isObject(obj)) {
    for (let key in obj) {
      if (!hasProp(obj, key)) continue;
      if (iterate.call(context, obj[key], key) === false) break;
    }

  } else if (Core.isArray(obj)) {
    let i, length = obj.length;
    for (i = 0; i < length; i++) {
      if (iterate.call(context, obj[i], i) === false) break;
    }
  }

  return obj;
}


export function arrayCombine(keys, values) {
  let data = {};
  let keyCount = keys && keys.length;
  let i = 0, key;

  if (
    !Core.isCollection(keys) || !Core.isCollection(values) ||
    !Core.isNumber(keyCount) || !Core.isNumber(values.length) ||
    !keyCount
  ) {
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


export function arrayFill(startIndex, num, mixedVal) {
  let key, arr = [];
  if (!isNaN(startIndex) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      arr[(key + startIndex)] = mixedVal;
    }
  }
  return arr;
}


export function objToArray(obj) {
  if (!Core.isObject(obj)) return obj;
  if (!Object.keys(obj).every((key) => Core.isInteger(key))) return obj;

  let array = [];
  each(obj, (value, i) => {
    array[i] = value;
  });
  return array;
}


export function simpleOp(op, data, path, values = null) {
  const length = path.length;
  const last = length - 1;
  let list = data;

  each(path, (key, i) => {
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