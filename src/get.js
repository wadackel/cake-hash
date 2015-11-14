import * as Core from "./utils/core"
import * as Collection from "./utils/collection"

export default function get(data, path, defaultValue = null) {
  let parts, val;

  if (!Core.isCollection(data)) {
    return defaultValue;
  }

  if (Core.empty(data) || path == null || path === "" ) {
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
  Collection.each(parts, (v) => {
    if (Core.isCollection(val) && Collection.hasProp(val, v)) {
      val = val[v];
    } else {
      val = defaultValue;
      return false;
    }
  });

  return val;
}