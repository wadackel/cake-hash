import * as Core from "./utils/core"
import * as Collection from "./utils/collection"

export default function flatten(data, separator = ".") {
  return _flatten(data, separator);
}


function _flatten(input, separator, currentPath = null) {
  let results = {};
  let path = null;
  
  if (Core.isArray(input) && input.length === 0) {
    path = currentPath == null ? 0 : currentPath;
    results[path] = input;
    return results;
  }

  Collection.each(input, function(val, key) {
    key = (key + "").split(separator).join(`\\${separator}`);
    path = currentPath == null ? key : `${currentPath}${separator}${key}`;
    if (Core.isCollection(val)) {
      let children = _flatten(val, separator, path);
      if (Object.keys(children).length > 0) {
        results = Collection.merge(results, children);
      }
    } else if(val !== undefined) {
      results[path] = val;
    }
  });

  return Collection.objToArray(results);
}