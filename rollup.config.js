import fs from "fs"
import babel from "rollup-plugin-babel"

var pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
var banner = [
  "/*!",
  " * " + pkg.name,
  " * " + pkg.description,
  " * ",
  " * @author " + pkg.author,
  " * @homepage " + pkg.homepage,
  " * @license " + pkg.license,
  " * @version " + pkg.version,
  " */",
].join("\n");

export default {
  entry: "src/cake-hash.js",
  dest: "cake-hash.js",
  format: "umd",
  moduleName: "CakeHash",
  banner: banner,
  plugins: [babel()]
}