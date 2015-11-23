const classTypeList = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"];
const classTypes = {};

classTypeList.forEach((name) => {
  classTypes[`[object ${name}]`] = name.toLowerCase();
});


export function getType(obj) {
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
    classTypes[Object.prototype.toString.call(obj)] || "object" :
    typeof obj;
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isObject(obj) {
  return !isArray(obj) && getType(obj) === "object";
}

export function isNumber(obj) {
  return getType(obj) === "number";
}

export function isString(obj) {
  return getType(obj) === "string";
}

export function isBoolean(obj) {
  return getType(obj) === "boolean";
}

export function isCollection(obj) {
  return isArray(obj) || isObject(obj);
}

export function isNumeric(obj) {
  const type = getType(obj);
  return (type === "number" || type === "string") && (obj - parseFloat(obj) + 1) >= 0;
}

export function isInteger(obj) {
  const type = getType(obj);
  return (type === "number" || type === "string") && /^([1-9]\d*|0)$/.test(obj);
}


export function empty(obj) {
  if (isArray(obj)) {
    return obj.length === 0;
  } else if(isObject(obj)) {
    return Object.keys(obj).length === 0;
  } else if(isNumeric(obj)) {
    return parseFloat(obj) === 0;
  }
  return !obj;
}