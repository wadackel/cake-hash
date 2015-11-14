import * as Core from "./utils/Core"
import * as Collection from "./utils/collection"
import * as Text from "./utils/text"
import get from "./get"

export default function extract(data, path) {
  if (!Core.isCollection(data)) {
    return null;
  }

  if (Core.empty(path)) {
    return data;
  }

  if (!/[{\[]/.test(path)) {
    return get(data, path, null);
  }

  const key = "__set_item__";
  let tokens;
  let context = {[key]: [data]};

  if (path.indexOf("[") < 0) {
    tokens = path.split(".");
  } else {
    tokens = Text.tokenize(path, ".", "[", "]");
  }

  Collection.each(tokens, (token) => {
    let next = [];
    let [_token, conditions] = Text.splitConditions(token);

    Collection.each(context[key], (item) => {
      Collection.each(item, (v, k) => {
        if (Text.matchToken(k, _token)) {
          next.push(v);
        }
      });
    });

    if (conditions) {
      let filter = [];
      Collection.each(next, (item) => {
        if (Core.isCollection(item) && Text.matches(item, conditions)) {
          filter.push(item);
        }
      });
      next = filter;
    }
    context = {[key]: next};
  });

  return context[key];
}