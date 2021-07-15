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
</html>`,
  {
    runScripts: "dangerously"
  }
);

test("at", (t) => {
  const { at } = kutil;

  const a = [{}, { a: { b: [1, 2, { c: [1, 2, { d: 99 }] }] } }];

  t.is(at(a, 1, "a", "b", 2, "c", 2, "d"), 99);
});

test("clone", (t) => {
  const { clone } = kutil;

  const a = { x: [0, 1, { y: { c: { d: 100 } } }] };
  const b = clone(a);

  t.is(b == a, false);
  t.is(b.x[2].y.c.d, 100);
});

test("each", (t) => {
  const { each } = kutil;

  const a = [{}, {}, {}];
  const b = { x: {}, y: {}, z: {} };

  each(a, (v, i) => (v.idx = i));
  each(b, (v, k) => (v.key = k));

  t.is(a[2].idx, 2);
  t.is(b.z.key, "z");
});

test("Ee", (t) => {
  const { Ee } = kutil;

  const ee = new Ee();
  let v = 0;

  ee.on("test_channel", (x) => (v = x));
  ee.emit("test_channel", 100);
  t.is(v, 100);

  ee.off("test_channel");
  ee.emit("test_channel", 200);
  t.is(v, 100);
});

test("isBrowser", (t) => {
  with (dom.window) {
    const { isBrowser } = kutil;
    t.is(isBrowser(), true);
  }
});

test("parseJSON", (t) => {
  const { parseJSON } = kutil;

  const a = parseJSON(undefined);
  const b = parseJSON('{"foo": 1}');

  t.is(a, null);
  t.is(b.foo, 1);
});

test("toArray", (t) => {
  with (dom.window) {
    const { toArray } = kutil;

    const lists = toArray(document.querySelectorAll("li"));
    t.is(Array.isArray(lists), true);
  }
});
