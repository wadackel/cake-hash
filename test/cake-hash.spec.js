import assert from "power-assert"
import * as Hash from "../cake-hash"


function getArticleData() {
  return [
    {
      article: {
        id: "1",
        user_id: "1",
        title: "First Article",
        body: "First Article Body"
      },
      user: {
        id: "1",
        user: "mariano",
        password: "5f4dcc3b5aa765d61d8327deb882cf99"
      },
      comment: [
        {
          id: "1",
          article_id: "1",
          user_id: "2",
          comment: "First Comment for First Article"
        },
        {
          id: "2",
          article_id: "1",
          user_id: "4",
          comment: "Second Comment for Second Article"
        }
      ],
      tag: [
        {
          id: "1",
          tag: "tag1"
        },
        {
          id: "2",
          tag: "tag2"
        }
      ],
      deep: {
        nesting: {
          test: {
            1: "foo",
            2: {
              and: {more: "stuff"}
            }
          }
        }
      }
    },
    {
      article: {
        id: "2",
        user_id: "1",
        title: "Second Article",
        body: "Second Article Body",
        published: "Y"
      },
      user: {
        id: "2",
        user: "mariano",
        password: "5f4dcc3b5aa765d61d8327deb882cf99"
      },
      comment: [],
      tag: []
    },
    {
      article: {
        id: "3",
        user_id: "1",
        title: "Third Article",
        body: "Third Article Body"
      },
      user: {
        id: "3",
        user: "mariano",
        password: "5f4dcc3b5aa765d61d8327deb882cf99"
      },
      comment: [],
      tag: []
    },
    {
      article: {
        id: "4",
        user_id: "1",
        title: "Fourth Article",
        body: "Fourth Article Body"
      },
      user: {
        id: "4",
        user: "mariano",
        password: "5f4dcc3b5aa765d61d8327deb882cf99"
      },
      comment: [],
      tag: []
    },
    {
      article: {
        id: "5",
        user_id: "1",
        title: "Fifth Article",
        body: "Fifth Article Body"
      },
      user: {
        id: "5",
        user: "mariano",
        password: "5f4dcc3b5aa765d61d8327deb882cf99"
      },
      comment: [],
      tag: []
    }
  ];
}


function getUserData() {
  return [
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
    },
    {
      user: {
        id: 25,
        group_id: 1,
        data: {
          user: "gwoo",
          name: "The Gwoo"
        }
      }
    }
  ];
}


describe("cake-hash", () => {
  it("get()", () => {
    let data = ["abc", "def"];

    assert(Hash.get(data, "0") === "abc");
    assert(Hash.get(data, 0) === "abc");
    assert(Hash.get(data, "1") === "def");

    data = getArticleData();

    assert(Hash.get([], "1.article.title") == null);
    assert(Hash.get([], "") == null);
    assert(Hash.get([], null, "-") === "-");
    assert(Hash.get(data, "0.article.title") === "First Article");
    assert(Hash.get(data, "1.article.title") === "Second Article");
    assert(Hash.get(data, "5.article.title") == null);

    let defaultValue = ["empty"];
    assert(defaultValue === Hash.get(data, "5.article.title", defaultValue));
    assert(defaultValue === Hash.get([], "5.article.title", defaultValue));

    assert(Hash.get(data, "1.article.title.not_there") == null);
    assert.deepEqual(Hash.get(data, "1.article"), data[1]["article"]);
    assert.deepEqual(Hash.get(data, ["1", "article"]), data[1]["article"]);

    data = {a: {b: {c: {d: 1}}}};
    assert(Hash.get(data, "a.b.c.d") === 1);
  });

  describe("extract()", () => {
    it("Basic", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, ""), data);
      assert(Hash.extract(data, "0.article.title") === "First Article");
      assert(Hash.extract(data, "1.article.title") === "Second Article");
      assert.deepEqual(Hash.extract([false], "{n}.something.another_thing"), []);
    });

    it("NumericKey", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, "{n}.article.title"), [
        "First Article", "Second Article",
        "Third Article", "Fourth Article",
        "Fifth Article"
      ]);
      assert.deepEqual(Hash.extract(data, "0.comment.{n}.user_id"), ["2", "4"]);
    });

    it("NumericMixedKeys", () => {
      let data = {
        user: {
          0: {
            id: 4,
            name: "Neo"
          },
          1: {
            id: 5,
            name: "Morpheus"
          },
          stringKey: {
            name: "Fail"
          }
        }
      };
      assert.deepEqual(Hash.extract(data, "user.{n}.name"), ["Neo", "Morpheus"]);
    });

    it("NumericNonZero", () => {
      let data = {
        1: {
          user: {
            id: 1,
            name: "John"
          }
        },
        2: {
          user: {
            id: 2,
            name: "Bob"
          }
        },
        3: {
          user: {
            id: 3,
            name: "Tony"
          }
        }
      };
      assert.deepEqual(Hash.extract(data, "{n}.user.name"), ["John", "Bob", "Tony"]);
    });

    it("StringKey", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, "{n}.{s}.user"), [
        "mariano",
        "mariano",
        "mariano",
        "mariano",
        "mariano"
      ]);
      assert.deepEqual(Hash.extract(data, "{n}.{s}.nesting.test.1"), ["foo"]);
    });

    it("Wildcard", () => {
      let data = {
        "02000009C5560001": {name: "Mr. Alphanumeric"},
        "2300000918020101": {name: "Mr. Numeric"},
        "390000096AB30001": {name: "Mrs. Alphanumeric"},
        stuff: {name: "Ms. Word"},
        123: {name: "Mr. Number"}
      };
      assert.deepEqual(Hash.extract(data, [
        "Mr. Alphanumeric",
        "Mr. Numeric",
        "Mrs. Alphanumeric",
        "Mr. Word",
        "Mr. Number"
      ]));
    });

    it("AttributePresence", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, "{n}.article[published]"), [data[1].article]);
      assert.deepEqual(Hash.extract(data, "{n}.article[id][published]"), [data[1].article]);
    });

    it("AttributeEquality", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, "{n}.article[id=3]"), [data[2].article]);
      assert.deepEqual(Hash.extract(data, "{n}.article[id = 3]"), [data[2].article]);

      let result = Hash.extract(data, "{n}.article[id!=3]");
      assert(result[0]["id"] === "1");
      assert(result[1]["id"] === "2");
      assert(result[2]["id"] === "4");
      assert(result[3]["id"] === "5");
    });

    it("AttributeBoolean", () => {
      let users = [
        {
          id: 2,
          username: "johndoe",
          active: true
        },
        {
          id: 5,
          username: "kevin",
          active: true
        },
        {
          id: 9,
          username: "samantha",
          active: false
        }
      ];

      let result;
      result = Hash.extract(users, "{n}[active=0]");
      assert(result.length === 1);
      assert.deepEqual(result[0], users[2]);

      result = Hash.extract(users, "{n}[active=false]");
      assert(result.length === 1);
      assert.deepEqual(result[0], users[2]);

      result = Hash.extract(users, "{n}[active=1]");
      assert(result.length === 2);
      assert.deepEqual(result[0], users[0]);
      assert.deepEqual(result[1], users[1]);

      result = Hash.extract(users, "{n}[active=true]");
      assert(result.length === 2);
      assert.deepEqual(result[0], users[0]);
      assert.deepEqual(result[1], users[1]);
    });

    it("AttributeEqualityOnScalarValue", () => {
      let data = {
        entity: {
          id: 1,
          data1: "value"
        }
      };
      assert.deepEqual(Hash.extract(data, "entity[id=1].data1"), ["value"]);

      data = {entity: false};
      assert.deepEqual(Hash.extract(data, "entity[id=1].data1"), []);
    });

    it("AttributeComparison", () => {
      let data = getArticleData();
      let result;
      result = Hash.extract(data, "{n}.comment.{n}[user_id > 2]");
      assert.deepEqual(result, [data[0]["comment"][1]]);
      assert(result[0]["user_id"] === "4");

      result = Hash.extract(data, "{n}.comment.{n}[user_id >= 4]");
      assert.deepEqual(result, [data[0]["comment"][1]]);
      assert(result[0]["user_id"] === "4");

      result = Hash.extract(data, "{n}.comment.{n}[user_id < 3]");
      assert.deepEqual(result, [data[0]["comment"][0]]);
      assert(result[0]["user_id"] === "2");

      result = Hash.extract(data, "{n}.comment.{n}[user_id <= 2]");
      assert.deepEqual(result, [data[0]["comment"][0]]);
      assert(result[0]["user_id"] === "2");
    });

    it("AttributeMultiple", () => {
      let data = getArticleData();
      assert(Hash.extract(data, "{n}.comment.{n}[user_id > 2][id=1]").length === 0);
      assert.deepEqual(Hash.extract(data, "{n}.comment.{n}[user_id > 2][id=2]"), [data[0]["comment"][1]]);
    });

    it("AttributePattern", () => {
      let data = getArticleData();
      assert.deepEqual(Hash.extract(data, "{n}.article[title=/^First/]"), [data[0]["article"]]);
      assert.deepEqual(Hash.extract(data, "{n}.article[title=/^Fir[a-z]+/]"), [data[0]["article"]]);
    });

    it("AttributeMatchesNull", () => {
      let data = {
        country: [
          {name: "Canada"},
          {name: "Australia"},
          {name: null}
        ]
      };
      assert.deepEqual(Hash.extract(data, "country.{n}[name=/Canada|^$/]"), [
        {name: "Canada"},
        {name: null}
      ]);
    });

    it("UnevenKeys", () => {
      let data = {
        level1: {
          level2: ["test1", "test2"],
          level2bis: ["test3", "test4"]
        }
      };
      assert.deepEqual(Hash.extract(data, "level1.level2"), ["test1", "test2"]);
      assert.deepEqual(Hash.extract(data, "level1.level2bis"), ["test3", "test4"]);

      data = {
        level1: {
          level2bis: [
            ["test3", "test4"],
            ["test5", "test6"]
          ]
        }
      };
      let expected = [
        ["test3", "test4"],
        ["test5", "test6"]
      ];
      assert.deepEqual(Hash.extract(data, "level1.level2bis"), expected);

      data["level1"]["level2"] = ["test1", "test2"];
      assert.deepEqual(Hash.extract(data, "level1.level2bis"), expected);
    });
  });

  describe("insert()", () => {
    it("Simple", () => {
      let data = {
        pages: {name: "page"}
      };
      assert.deepEqual(Hash.insert(data, "files", {name: "file"}), {
        pages: {name: "page"},
        files: {name: "file"}
      });

      data = {
        pages: {name: "page"}
      };
      assert.deepEqual(Hash.insert(data, "pages.name", []), {
        pages: {name: []}
      });

      data = {
        foo: {bar: "baz"}
      };
      let result = Hash.insert(data, "some.0123.path", {foo: {bar: "baz"}});
      assert.deepEqual(Hash.get(result, "some.0123.path"), {
        foo: {bar: "baz"}
      });
    });

    it("Multi", () => {
      let data = getArticleData();
      let result = Hash.insert(data, "{n}.article.insert", "value");
      assert(result[0]["article"]["insert"] === "value");
      assert(result[1]["article"]["insert"] === "value");

      result = Hash.insert(data, "{n}.comment.{n}.insert", "value");
      assert(result[0]["comment"][0]["insert"] === "value");
      assert(result[0]["comment"][1]["insert"] === "value");

      data = [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second"}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4, title: "fourth"}},
        {item: {id: 5, title: "fifth"}}
      ];
      result = Hash.insert(data, "{n}.item[id=/\\b2|\\b4/]", {test: 2});
      assert.deepEqual(result, [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second", test: 2}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4, title: "fourth", test: 2}},
        {item: {id: 5, title: "fifth"}}
      ]);

      data = [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second"}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4, title: "fourth"}, testable: true},
        {item: {id: 5, title: "fifth"}}
      ];
      result = Hash.insert(data, "{n}[testable].item[id=/\\b|\\b4/].test", 2);
      assert.deepEqual(result, [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second"}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4, title: "fourth", test: 2}, testable: true},
        {item: {id: 5, title: "fifth"}}
      ]);
    });

    it("OverwriteStringValue", () => {
      let data = {
        some: {string: "value"}
      };
      assert.deepEqual(Hash.insert(data, "some.string.value", ["values"]), {
        some: {string: {value: ["values"]}}
      });
    });
  });

  describe("remove()", () => {
    it("Simple", () => {
      let data = {
        pages: {name: "page"},
        files: {name: "file"}
      };
      assert.deepEqual(Hash.remove(data, "files"), {
        pages: {name: "page"}
      });

      data = {
        pages: [
          {name: "main"},
          {name: "about", vars: {title: "page title"}}
        ]
      };
      assert.deepEqual(Hash.remove(data, "pages.1.vars"), {
        pages: [
          {name: "main"},
          {name: "about"}
        ]
      });
      assert.deepEqual(Hash.remove(data, "pages.2.vars"), data);

      data = [
        {name: "pages"},
        {name: "files"}
      ];
      assert.deepEqual(Hash.remove(data, "{n}[name=files]"), [
        {name: "pages"}
      ]);

      data = ["foo", ["baz"]];
      assert.deepEqual(Hash.remove(data, "{n}.part"), ["foo", ["baz"]]);
      assert.deepEqual(Hash.remove(data, "{n}.{n}.part"), ["foo", ["baz"]]);
    });

    it("Multi", () => {
      let data = getArticleData();
      let result = Hash.remove(data, "{n}.article.title");
      assert(result[0]["article"]["title"] === undefined);
      assert(result[1]["article"]["title"] === undefined);

      data = getArticleData();
      result = Hash.remove(data, "{n}.article.{s}");
      assert(result[0]["article"] === undefined);

      data = [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second"}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4, title: "fourth"}},
        {item: {id: 5, title: "fifth"}}
      ];
      let expected = [];
      expected[0] = {item: {id: 1, title: "first"}};
      expected[2] = {item: {id: 3, title: "third"}};
      expected[4] = {item: {id: 5, title: "fifth"}};
      assert.deepEqual(Hash.remove(data, "{n}.item[id=/\\b2|\\b4/]"), expected);

      data = [
        {item: {id: 1, title: "first"}},
        {item: {id: 2, title: "second"}},
        {item: {id: 3, title: "third"}},
        {item: {id: 4}, testable: true},
        {item: {id: 5, title: "fifth"}}
      ];
      assert.deepEqual(Hash.remove(data, "{n}[testable].item[id=/\\b2|\\b4/].title"), data);
    });
  });

  describe("combine()", () => {
    it("Simple", () => {
      assert.deepEqual(Hash.combine([], "{n}.user.id", "{n}.user.data"), {});

      let data = getUserData();
      let expected = {};
      expected[2] = null;
      expected[14] = null;
      expected[25] = null;
      assert.deepEqual(Hash.combine(data, "{n}.user.id"), expected);
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.non-existant"), expected);

      expected = {};
      expected[2] = {user: "mariano.iglesias", name: "Mariano Iglesias"};
      expected[14] = {user: "phpnut", name: "Larry E. Masters"};
      expected[25] = {user: "gwoo", name: "The Gwoo"};
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.data"), expected);

      expected = {};
      expected[2] = "Mariano Iglesias";
      expected[14] = "Larry E. Masters";
      expected[25] = "The Gwoo";
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.data.name"), expected);
    });

    it("MissingValue", () => {
      let data = [
        {user: {id: 1, name: "mark"}},
        {user: {name: "jose"}}
      ];
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.name"), {});
    });

    it("MissingKey", () => {
      let data = [
        {user: {id: 1, name: "mark"}},
        {user: {id: 2}}
      ];
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.name"), {});
    });

    it("GroupPath", () => {
      let data = getUserData();
      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.data", "{n}.user.group_id"), {
        1: {
          2: {user: "mariano.iglesias", name: "Mariano Iglesias"},
          25: {user: "gwoo", name: "The Gwoo"}
        },
        2: {
          14: {user: "phpnut", name: "Larry E. Masters"}
        }
      });

      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.data.name", "{n}.user.group_id"), {
        1: {
          2: "Mariano Iglesias",
          25: "The Gwoo"
        },
        2: {
          14: "Larry E. Masters"
        }
      });

      assert.deepEqual(Hash.combine(data, "{n}.user.id", "{n}.user.data", "{n}.user.group_id"), {
        1: {
          2: {user: "mariano.iglesias", name: "Mariano Iglesias"},
          25: {user: "gwoo", name: "The Gwoo"}
        },
        2: {
          14: {user: "phpnut", name: "Larry E. Masters"}
        }
      });
    });
  });
});
