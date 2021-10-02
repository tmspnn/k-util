const test = require("ava");
const kutil = require("../dist/k-util");

test("at", (t) => {
    const { at } = kutil;

    const a = [{}, { a: { b: [1, 2, { c: [1, 2, { d: 99 }] }] } }];

    t.is(at(a, 1, "a", "b", 2, "c", 2, "d"), 99);
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
