import * as Core from "./core"
import * as Collection from "./collection"


export function trim(input){
  return input.replace(/^\s+|\s+$/g, "");
}


export function split(input, separator){
  const tokens = (input + "").split(separator);
  const results = [];
  let previousValue = null;
  
  Collection.each(tokens, (token) => {
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


export function tokenize(str, separator = ",", left = "(", right = ")") {
  if( Core.empty(str) ){
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
    // console.log(depth, buffer);
    if (tmpOffset !== -1) {
      buffer += str.substr(offset, (tmpOffset - offset));
      let char = str.substr(tmpOffset, 1);
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

  if (Core.empty(results) && !Core.empty(buffer)) {
    results.push(buffer);
  }

  if (!Core.empty(results)) {
    return results.map(val => trim(val));
  }

  return [];
}


export function splitConditions(token) {
  let conditions = false;
  let position = token.indexOf("[");
  if (position > -1) {
    conditions = token.substr(position);
    token = token.substr(0, position);
  }
  return [token, conditions];
}


export function matchToken(key, token) {
  switch (token) {
  case "{n}":
    return Core.isNumeric(key);
  case "{s}":
    return Core.isString(key);
  case "{*}":
    return true;
  default:
    return Core.isNumeric(token) ? (key == token) : key === token;
  }
}


export function matches(data, selector) {
  const identifier = "(?:\\\\.|[\\w-_\.]|[^\\x00-\\xa0])+";
  const attributes = new RegExp(`\\s*(${identifier})(?:\\s*([><!]?[=]|[><])\\s*(\\/.*?\\/|${identifier})|)\\s*\]`, "g");
  let cond;

  while (cond = attributes.exec(selector)) {
    const attr = cond[1];
    const op = cond[2] || null;
    const val = cond[3] || null;
    const hasProperty = Collection.hasProp(data, attr);

    if (Core.empty(op) && Core.empty(val) && !hasProperty) {
      return false;
    }

    if (!(hasProperty || data[attr] != null)) {
      return false;
    }

    let prop = hasProperty ? prop = data[attr] : undefined;
    let _isBoolean = Core.isBoolean(prop) || (prop === "true" || prop === "false");

    if (_isBoolean && Core.isNumeric(val)) {
      prop = prop ? "1": "0";
    } else if(_isBoolean) {
      prop = prop ? "true" : "false";
    }

    if (op === "=" && val && val[0] === "/" && val[val.length - 1] === "/") {
      prop = Core.isString(prop) || Core.isNumeric(prop) ? prop : "";
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