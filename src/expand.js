import * as Collection from "./utils/collection"
import * as Text from "./utils/text"

export default function expand(data, separator = ".") {
  let results = {};

  Collection.each(data, (value, flat) => {
    let keys = Text.split(flat, separator).reverse();
    let child = {};
    child[keys.shift()] = value;
    Collection.each(keys, (k) => {
      child = {[k]: child};
    });
    results = Collection.merge(results, child, true);
  });

  return Collection.objToArray(results);
}