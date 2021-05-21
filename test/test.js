// External modules
const fs = require("fs");
const JSDOM = require("jsdom").JSDOM;
const test = require("ava");
const kutil = require("../dist/k-util");

// Setup the testing environment
const kutilJS = fs.readFileSync(__dirname + "/../dist/k-util.js", "utf8");
const dom = new JSDOM(
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Testing</title>
</head>
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
  <script>${kutilJS}</script>
</body>
</html>
`,
  {
    runScripts: "dangerously"
  }
);

// Run testcases
test("var", (t) => {
  with (dom.window) {
    t.is(typeof kutil, "object");
  }
});

test("isInt", (t) => {
  const { isInt } = kutil;

  t.is(isInt(0), true);
  t.is(isInt(0.1), false);
});

test("isJSON", (t) => {
  const { isJSON } = kutil;

  t.is(isJSON(undefined), false);
  t.is(isJSON(null), false);
  t.is(isJSON(1), false);
  t.is(isJSON(""), false);
  t.is(isJSON(JSON.stringify({ a: 1 })), true);
});

test("parseJSON", (t) => {
  const { parseJSON } = kutil;

  t.is(parseJSON(undefined), null);
  t.is(parseJSON(null), null);
  t.is(parseJSON("null"), null);
  t.is(parseJSON("foobar"), null);
  t.is(parseJSON(0), 0);
  t.is(parseJSON(JSON.stringify({ a: 1 })).a, 1);
});

test("isBrowser", (t) => {
  with (dom.window) {
    const { isBrowser } = kutil;

    t.is(isBrowser(), true);
  }

  t.is(kutil.isBrowser(), false);
});

test("toArray", (t) => {
  with (dom.window) {
    const { toArray } = kutil;

    const lists = toArray(document.querySelectorAll("li"));
    t.is(Array.isArray(lists), true);
  }
});

test("at", (t) => {
  const { at } = kutil;

  const s = "123";
  const o = { a: { b: [{ c: [1, 2, 3] }] } };

  t.is(at(s, 1), "2");
  t.is(at(o, "a.b[0].c[2]"), 3);
});

test("each", (t) => {
  const { each } = kutil;

  const a = [1, 2, 3];
  const a1 = [];
  const b = { x: 9, y: 8, z: 7 };
  const b1 = {};

  each(a, (v, i) => a1.push(v + i));
  t.is(a1[0], 1);
  t.is(a1[1], 3);
  t.is(a1[2], 5);

  each(b, (v, k) => (b1[k] = v - 1));
  t.is(b1.x, 8);
  t.is(b1.y, 7);
  t.is(b1.z, 6);
});
