import * as Core from "./utils/core"
import * as Collection from "./utils/collection"
import * as Text from "./utils/text"

export default function remove(data, path) {
  const noTokens = path.indexOf("[") < 0;
  const noExpansion = path.indexOf("{") < 0;

  if (noExpansion && noTokens && path.indexOf(".") < 0) {
    delete data[path];
    return data;
  }

  const tokens = noTokens ? path.split(".") : Text.tokenize(path, ".", "[", "]");

  if (noExpansion && noTokens) {
    return Collection.simpleOp("remove", data, tokens);
  }

  let token = tokens.shift();
  let nextPath = tokens.join(".");
  let [_token, conditions] = Text.splitConditions(token);

  Collection.each(data, (v, k) => {
    let match = Text.matchToken(k, _token);
    if (match && Core.isCollection(v)) {
      if (conditions) {
        if (Text.matches(v, conditions)) {
          if (nextPath) {
            data[k] = remove(v, nextPath);
          } else {
            delete data[k];
          }
        }
      } else {
        data[k] = remove(v, nextPath);
      }
      if (Core.empty(data[k])) {
        delete data[k];
      }
    } else if (match && Core.empty(nextPath)) {
      delete data[k];
    }
  });

  return data;
}