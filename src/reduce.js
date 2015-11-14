import * as Core from "./utils/core"
import * as Collection from "./utils/collection"
import extract from "./extract"

export default function reduce(data, path, callback) {
  const values = Collection.objToArray(extract(data, path));
  return !Core.isArray(values) ? null : values.reduce(callback);
}