# k-util

A small set of JavaScript utility functions

## Installation

```
npm install k-util
```

## Quick Start

```javascript
import { isInt, isJSON, parseJSON, isBrowser, toArray, at, each } from "kutil";

isInt(0); // true
isInt(0.1); // false

isJSON(undefined); // false
isJSON(null); // false
isJSON(1); // false
isJSON(""); // false
isJSON(JSON.stringify({ a: 1 })); // true

parseJSON(undefined); // null
parseJSON(null); //null
parseJSON("null"); // null
parseJSON("foobar"); // null
parseJSON(0); // 0
parseJSON(JSON.stringify({ a: 1 })); // { a: 1 }

isBrowser(); // true in browser, false in node

Array.isArray(toArray(document.querySelectorAll(".my-elements"))); // true;

const s = "123";
const o = { a: { b: [{ c: [1, 2, 3] }] } };

at(s, 1); // "2"
at(o, "a.b[0].c[2]"); // 3

const a = [1, 2, 3];
const a1 = [];

each(a, (v, i) => a1.push(v + i));
a1[0]; // 1
a1[1]; // 3
a1[2]; // 5

const b = { x: 9, y: 8, z: 7 };
const b1 = {};

each(b, (v, k) => (b1[k] = v - 1));
b.x; // 8
b.y; // 7
b.z; // 6
```
