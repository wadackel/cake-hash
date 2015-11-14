import * as Core from "./utils/core"
import * as Collection from "./utils/collection"
import extract from "./extract"

export default function combine(data, keyPath, valuePath = null, groupPath = null) {
  if (Core.empty(data)) {
    return [];
  }

  let keys = extract(data, keyPath);
  let vals;

  if (Core.empty(keys)) {
    return [];
  }

  if (!Core.empty(valuePath)) {
    vals = extract(data, valuePath);
  }
  if (Core.empty(vals)) {
    vals = Collection.arrayFill(0, keys.length, null);
  }

  if (keys.length !== vals.length) {
    return [];
  }

  if (groupPath != null) {
    let group = extract(data, groupPath);
    if (!Core.empty(group)) {
      let c = keys.length;
      let out = {};
      for (let i = 0; i < c; i++) {
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