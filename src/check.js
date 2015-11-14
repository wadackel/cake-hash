import * as Core from "./utils/core"
import extract from "./extract"

export default function check(data, path) {
  const results = extract(data, path);

  if (Core.isCollection(results)) {
    return !Core.empty(results);
  }
  
  return results != null;
}