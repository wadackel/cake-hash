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

  it("extract() - Basic", () => {
    let data = getArticleData();
    assert.deepEqual(Hash.extract(data, ""), data);
    assert(Hash.extract(data, "0.article.title") === "First Article");
    assert(Hash.extract(data, "1.article.title") === "Second Article");
    assert.deepEqual(Hash.extract([false], "{n}.something.another_thing"), []);
  });

  it("extract() - NumericKey", () => {
    let data = getArticleData();
    assert.deepEqual(Hash.extract(data, "{n}.article.title"), [
      "First Article", "Second Article",
      "Third Article", "Fourth Article",
      "Fifth Article"
    ]);
    assert.deepEqual(Hash.extract(data, "0.comment.{n}.user_id"), ["2", "4"]);
  });

  it("extract() - NumericMixedKeys", () => {
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

  it("extract() - NumericNonZero", () => {
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

  it("extract() - StringKey", () => {
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

  it("extract() - Wildcard", () => {
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

  it("extract() - AttributePresence", () => {
    let data = getArticleData();
    assert.deepEqual(Hash.extract(data, "{n}.article[published]"), [data[1].article]);
    assert.deepEqual(Hash.extract(data, "{n}.article[id][published]"), [data[1].article]);
  });

  it("extract() - AttributeEquality", () => {
    let data = getArticleData();
    assert.deepEqual(Hash.extract(data, "{n}.article[id=3]"), [data[2].article]);
    assert.deepEqual(Hash.extract(data, "{n}.article[id = 3]"), [data[2].article]);

    let result = Hash.extract(data, "{n}.article[id!=3]");
    assert(result[0]["id"] === "1");
    assert(result[1]["id"] === "2");
    assert(result[2]["id"] === "4");
    assert(result[3]["id"] === "5");
  });

  it("extract() - AttributeBoolean", () => {
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
});