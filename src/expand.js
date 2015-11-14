import * as Collection from "./utils/collection"

export default function expand(data, separator = ".") {
  let results = {};

  Collection.each(data, (value, flat) => {
    let keys = (flat + "").split(separator).reverse();
    let child = {};
    child[keys.shift()] = value;
    Collection.each(keys, (k) => {
      child = {[k]: child};
    });
    results = Collection.merge(results, child, true);
  });

  return Collection.objToArray(results);
}