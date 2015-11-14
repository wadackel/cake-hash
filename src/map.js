import * as Core from "./utils/core"
import * as Collection from "./utils/collection"
import extract from "./extract"

export default function map(data, path, callback) {
  const values = Collection.objToArray(extract(data, path));
  return !Core.isArray(values) ? null : values.map(callback);
}