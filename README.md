cake-hash
=========

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/cake-hash.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/cake-hash)
[![npm version](https://img.shields.io/npm/v/cake-hash.svg?style=flat-square)](http://badge.fury.io/js/cake-hash)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tsuyoshiwada/cake-hash/master/LICENSE)

[CakePHP](https://github.com/cakephp/cakephp) in Utility.Hash class like a collection manipulation. In JavaScript.  
Work in `IE9+` and modern browser. And Node.js.


## DESCRIPTION
Array and Object management, if done right, can be a very powerful and useful tool for building smarter, more optimized code.
CakeHash offers a very useful set of static utilities in the Hash class that allow you to do just that.


### SUPPORT METHODS
:o: Supports the following methods.

* `get`
* `extract`
* `insert`
* `remove`
* `combine`
* `check`
* `flatten`
* `expand`
* `map`
* `reduce`


:x: Does not support the following methods.

* `format`
* `contains`
* `filter`
* `merge`
* `numeric`
* `dimensions`
* `maxDimensions`
* `apply`
* `sort`
* `diff`
* `mergeDiff`
* `normalize`
* `nest`

Please use [underscore.js](https://github.com/jashkenas/underscore) and [lodash.js](https://github.com/lodash/lodash) instead.



## INSTALL
### via NPM
```
$ npm install --save-dev cake-hash
```

#### use
```javascript
import CakeHash from `cake-hash`

CakeHash.__METHOD__()
```

### via MANUAL
1. Download the [cake-hash.min.js](https://raw.githubusercontent.com/tsuyoshiwada/cake-hash/master/cake-hash.min.js).
2. Load it in the `script` tag.

```html
<script src="cake-hash.min.js"></script>
```

####  use
```javascript
CakeHash.__METHOD__()
```



## HASH PATH SYNTAX
The path syntax described below is used by all the methods in Hash.
Not all parts of the path syntax are available in all methods. A path expression is made of any number of tokens.
Tokens are composed of two groups. Expressions, are used to traverse the array data, while matchers are used to qualify elements.
You apply matchers to expression elements.


### Expression Types
| Expression | Definition                                                                        |
|------------|-----------------------------------------------------------------------------------|
| `{n}`      | Represents a numeric key. Will match any string or numeric key.                   |
| `{s}`      | Represents a string. Will match any string value including numeric string values. |
| `Foo`      | Matches keys with the exact same value.                                           |

All expression elements are supported by all methods. In addition to expression elements, you can use attribute matching with certain methods.


### Attribute Matching Types
| `[id]`         | Match elements with a given array key.                                        |
|----------------|-------------------------------------------------------------------------------|
| `[id=2]`       | Match elements with id equal to 2.                                            |
| `[id!=2]`      | Match elements with id not equal to 2.                                        |
| `[id>2]`       | Match elements with id greater than 2.                                        |
| `[id>=2]`      | Match elements with id greater than or equal to 2.                            |
| `[id<2]`       | Match elements with id less than 2                                            |
| `[id<=2]`      | Match elements with id less than or equal to 2.                               |
| `[text=/.../]` | Match elements that have values matching the regular expression inside `...`. |

## API

### get(data, path, [defaultValue = null])
**`data` : array | object**  
**`path` : string**  
**`defaultValue` : mixed**  
**`return` : mixed**  

`get()` is a simplified version of `extract()`, it only supports direct path expressions. Paths with `{n}`, `{s}` or matchers are not supported.
Use `get()` when you want exactly one value out of an array.

```javascript
let users = [
  {id: 1, name: "mark"},
  {id: 2, name: "jane"},
  {id: 3, name: "sally"},
  {id: 4, name: "jose"}
];

let result = CakeHash.get(users, "2.name");
console.log(result); // "sally"

result = CakeHash.get(users, "hoge.fuga", "default!!");
console.log(result); // default!!
```


### extract(data, path)
**`data` : array | object**  
**`path` : string**  
**`return`: mixed**  

`CakeHash.extract()` supports all expression, and matcher components of Hash Path Syntax.
You can use extract to retrieve data from arrays, along arbitrary paths quickly without having to loop through the data structures.
Instead you use path expressions to qualify which elements you want returned.

```javascript
let users = [
  {id: 1, name: "mark"},
  {id: 2, name: "jane"},
  {id: 3, name: "sally"},
  {id: 4, name: "jose"}
];

let result = CakeHash.extract(users, "{n}.id");
console.log(result); // [1, 2, 3, 4]
```


### insert(data, path, [value = null])
**`data` : array | object**  
**`path` : string**  
**`value` : mixed**  
**`return`: mixed**  

Inserts `data` into an array or object as defined by `path`.

```javascript
let data = {
  pages: {name: "page"}
};

let result = CakeHash.insert(data, "files", {name: "file"});
console.log(result);
/*
{
  pages: {name: "page"},
  files: {name: "file"}
}
*/
```

You can use paths using `{n}` and `{s}` to insert data into multiple points.

```javascript
users = CakeHash.insert(users, "{n}.new", "value");
```

Attribute matchers work with `insert()` as well.

```javascript
let data = [
  {up: true, item: {id: 1, title: "first"}},
  {item: {id: 2, title: "second"}},
  {item: {id: 3, title: "third"}},
  {up: true, item: {id: 4, title: "fourth"}},
  {item: {id: 5, title: "fifth"}}
];

let result = CakeHash.insert(data, "{n}[up].item[id=4].new", 9);
console.log(result);
/*
[
  {up: true, item: {id: 1, title: "first"}},
  {item: {id: 2, title: "second"}},
  {item: {id: 3, title: "third"}},
  {up: true, item: {id: 4, title: "fourth", new: 9}},
  {item: {id: 5, title: "fifth"}}
]
*/
```


### remove(data, path)
**`data` : array | object**  
**`path` : string**  
**`return`: mixed**  

Removes all elements from an array or object that match `path`.

```javascript
let data = {
  pages: {name: "page"},
  files: {name: "file"}
};

let result = CakeHash.remove(data, "files");
console.log(result);
/*
{
  pages: {name: "page"}
}
*/
```

Using `{n}` and `{s}` will allow you to remove multiple values at once. You can also use attribute matchers with `remove()`.

```javascript
let data = [
  {clear: true, item: {id: 1, title: "first"}},
  {item: {id: 2, title: "second"}},
  {item: {id: 3, title: "third"}},
  {clear: true, item: {id: 4, title: "fourth"}},
  {item: {id: 5, title: "fifth"}}
];

let result = CakeHash.remove(data, "{n}[clear].item[id=4]");
console.log(result);
/*
[
  {clear: true, item: {id: 1, title: "first"}},
  {item: {id: 2, title: "second"}},
  {item: {id: 3, title: "third"}},
  {clear: true},
  {item: {id: 5, title: "fifth"}}
]
*/
```


### combine(data, keyPath, [valuePath = null, groupPath = null])
**`data` : array | object**  
**`keyPath` : string**  
**`valuePath` : string**  
**`groupPath` : string**  
**`return`: array | object**  

Creates an associative array using a `keyPath` as the path to build its keys, and optionally `valuePath` as path to get the values.
If `valuePath` is not specified, or doesn’t match anything, values will be initialized to `null`.
You can optionally group the values by what is obtained when following the path specified in `groupPath`.

```javascript
let data = [
  {
    user: {
      id: 2,
      group_id: 1,
      data: {
        user: "mariano.iglesias",
        name: "Mariano Iglesias"
      }
    }
  },
  {
    user: {
      id: 14,
      group_id: 2,
      data: {
        user: "phpnut",
        name: "Larry E. Masters"
      }
    }
  }
];

let result = CakeHash.combine(data, "{n}.user.id");
console.log(result);
/*
[2: null, 14: null]
*/


result = CakeHash.combine(data, "{n}.user.id", "{n}.user.data");
console.log(result);
/*
[
  2: {
    user: "mariano.iglesias",
    name: "Mariano Iglesias"
  },
  14: {
    user: "phpnut",
    name: "Larry E. Masters"
  }
]
*/


result = CakeHash.combine(data, "{n}.user.id", "{n}.user.data.name");
console.log(result);
/*
[2: "Mariano Iglesias", 14: "Larry E. Masters"]
*/


result = CakeHash.combine(data, "{n}.user.id", "{n}.user.data", "{n}.user.group_id");
console.log(result);
/*
[
  1: {
    2: {
      name: "Mariano Iglesias",
      user: "mariano.iglesias"
    }
  },
  2: {
    14: {
      name: "Larry E. Masters",
      user: "phpnut"
    }
  }
]
*/


result = CakeHash.combine(data, "{n}.user.id", "{n}.user.data.name", "{n}.user.group_id");
console.log(result);
/*
[
  1: {
    2: "Mariano Iglesias"
  },
  2: {
    14: "Larry E. Masters"
  }
]
*/
```


### check(data, path)
**`data` : array | object**  
**`path` : string**  
**`return`: boolean**  

Checks if a particular path is set in an array or object.

```javascript
let data = {
  "My Index 1": {
    first: "The first item"
  }
};

let result = CakeHash.check(data, "My Index 1.first");
console.log(result); // true

result = CakeHash.check(data, "My Index 1");
console.log(result); // true


data = {
  "My Index 1": {
    first: {
      second: {
        third: {
          fourth: "Heavy. Nesting."
        }
      }
    }
  }
};

result = CakeHash.check(data, "My Index 1.first.second");
console.log(result); // true

result = CakeHash.check(data, "My Index 1.first.second.third");
console.log(result); // true

result = CakeHash.check(data, "My Index 1.first.second.third.fourth");
console.log(result); // true

result = CakeHash.check(data, "My Index 1.first.seconds.third.fourth");
console.log(result); // false
```


### flatten(data, separator = ".")
**`data` : array | object**  
**`separator` : string**  
**`return`: array | object**  

Collapses a multi-dimensional array or object into a single dimension.

```javascript
let data = [
  {
    post: {id: 1, title: "First Post"},
    author: {id: 1, user: "Kyle"}
  },
  {
    post: {id: 2, title: "Second Post"},
    author: {id: 3, user: "Crystal"}
  }
];

let result = CakeHash.flatten(data);
console.log(result);
/*
{
  "0.post.id"    : 1,
  "0.post.title" : "First Post",
  "0.author.id"  : 1,
  "0.author.user": "Kyle",
  "1.post.id"    : 2,
  "1.post.title" : "Second Post",
  "1.author.id"  : 3,
  "1.author.user": "Crystal"
}
*/
```


### expand(data, separator = ".")
**`data` : array | object**  
**`separator` : string**  
**`return`: array | object**  

Expands an array or object that was previously flattened with `CakeHash.flatten()`.

```javascript
let data = {
  "0.post.id"    : 1,
  "0.post.title" : "First Post",
  "0.author.id"  : 1,
  "0.author.user": "Kyle",
  "1.post.id"    : 2,
  "1.post.title" : "Second Post",
  "1.author.id"  : 3,
  "1.author.user": "Crystal"
};

let result = CakeHash.expand(data);
console.log(result);
/*
[
  {
    post: {id: 1, title: "First Post"},
    author: {id: 1, user: "Kyle"}
  },
  {
    post: {id: 2, title: "Second Post"},
    author: {id: 3, user: "Crystal"}
  }
]
*/
```


### map(data, path, callback)
**`data` : array | object**  
**`path` : string**  
**`callback` : function**  
**`return`: array | object**  

Creates a new array or object, by extracting `path`, and mapping `callback` across the results.
You can use both expression and matching elements with this method.

```javascript
let data = [
  {user: {id: 1, name: "Adam"}},
  {user: {id: 2, name: "Clyde"}},
  {user: {id: 3, name: "Cyril"}},
  {user: {id: 4, name: "Thomas"}},
  {user: {id: 5, name: "William"}}
];

let result = CakeHash.map(data, "{n}.user.id", (id) => id * 2);
console.log(result); // [2, 4, 6, 8, 10]
```


### map(data, path, callback)
**`data` : array | object**  
**`path` : string**  
**`callback` : function**  
**`return`: array | object**  

Creates a single value, by extracting `path`, and reducing the extracted results with `callback`.
You can use both expression and matching elements with this method.

```javascript
let data = [
  {user: {id: 1, name: "Adam"}},
  {user: {id: 2, name: "Clyde"}},
  {user: {id: 3, name: "Cyril"}},
  {user: {id: 4, name: "Thomas"}},
  {user: {id: 5, name: "William"}}
];

let result = CakeHash.reduce(data, "{n}.user.id", (one, two) => one + two);
console.log(result); // 15
```



## AUTHOR
[tsuyoshiwada](https://github.com/tsuyoshiwada)



## LICENSE
Licensed under the [MIT](https://raw.githubusercontent.com/tsuyoshiwada/cake-hash/master/LICENSE) license.



## DEVELOPMENT
Initialization of the project.
```
$ cd /your/project/dir
$ git clone https://github.com/tsuyoshiwada/cake-hash.git
```

Install some dependencies.
```
$ npm install
```

Start the development.
```
$ npm start
```

Run lint and testing.
```
$ npm test
```

Generates build file.
```
$ npm run build
```