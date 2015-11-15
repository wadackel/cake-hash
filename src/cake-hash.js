import get from "./get"
import extract from "./extract"
import insert from "./insert"
import remove from "./remove"
import combine from "./combine"
import check from "./check"
import flatten from "./flatten"
import expand from "./expand"
import map from "./map"
import reduce from "./reduce"

const VERSION = "0.0.3";


// Core
function CakeHash() {}
CakeHash.VERSION = VERSION;
CakeHash.get = get;
CakeHash.extract = extract;
CakeHash.insert = insert;
CakeHash.remove = remove;
CakeHash.combine = combine;
CakeHash.check = check;
CakeHash.flatten = flatten;
CakeHash.expand = expand;
CakeHash.map = map;
CakeHash.reduce = reduce;

export default CakeHash;