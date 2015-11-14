import * as Core from "./utils/core"
import * as Collection from "./utils/collection"
import * as Text from "./utils/text"

export default function insert(data, path, values) {
  const noTokens = path.indexOf("[") < 0;
  if (noTokens && path.indexOf(".") < 0) {
    data[path] = values;
    return data;
  }

  let tokens;
  if (noTokens) {
    tokens = path.split(".");
  } else {
    tokens = Text.tokenize(path, ".", "[", "]");
  }

  if (noTokens && path.indexOf("{") < 0) {
    return Collection.simpleOp("insert", data, tokens, values);
  }

  let token = tokens.shift();
  let nextPath = tokens.join(".");
  let [_token, conditions] = Text.splitConditions(token);

  Collection.each(data, (v, k) => {
    if (Text.matchToken(k, _token)) {
      if (!conditions || Text.matches(v, conditions)) {
        data[k] = nextPath ? insert(v, nextPath, values) : Collection.merge(v, values);
      }
    }
  });

  return data;
}