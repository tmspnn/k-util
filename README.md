# k-util

JavaScript utility functions, could also be used as a frontend framework.

**1.5KB** Gzipped, no dependencies, compatible with all modern browsers.

## Installation

```
npm install k-util
```

## Utility functions

```javascript
import { at, each, clone, Ee, isBrowser, parseJSON, toArray } from "kutil";

const foo = { bar: 1, zoo: [2, { x: 100 }] };

at(foo, "zoo", 1, "x"); // 100
at(foo, -1); // null

each([1, 2, 3], (v, i) => console.log(i, v)); // 0 1, 1 2, 2 3
each({ x: 1, y: 2, z: 3 }, (v, k) => console.log(k, v)); // x 1, y 2, z 3

const ee = new Ee();
const myContext = { text: "this is bind to myContext" };
const listner = function (...args) {
  console.log(this.text, ...args);
};
ee.on("myChannel", listener, myContext);
ee.emit("myChannel", 1, 2, 3); // "this is bind to myContext", 1, 2, 3
ee.off("myChannel", listener, myContext);

isBrowser(); // true in browser, false in node

parseJSON(undefined); // null
parseJSON(null); //null
parseJSON("null"); // null
parseJSON("foobar"); // null
parseJSON(JSON.stringify({ a: 1 })); // { a: 1 }

const nodeList = document.querySelectorAll(".my-elements");
Array.isArray(toArray(nodeList)); // true;
```

## Klass

```javascript
import { Klass } from "k-util";

const Base = Klass({
  foo: 0,

  constructor(foo) {
    this.foo = foo;
  },

  logFoo() {
    console.log(this.foo);
  }
});

const Derived = Klass(
  {
    bar: 0,

    constructor(foo, bar) {
      this.Super(foo);
      this.bar = bar;
    },

    logBar() {
      console.log(this.bar);
    }
  },

  // The second parameter is the base class
  Base
);

const d = new Derived(1, 2);
d instanceof Base; // true

d.foo; // 1
d.super.foo; // 1
d.bar; // 2

d.logFoo(); // 1
d.super.logFoo(); // 1
d.logBar(); // 2
```

## View

```html
<div id="counter">
  <p>
    You've clicked
    <span data-ref="timesSpan">0</span>
    times!
  </p>
  <button data-click="onBtnClick" data-ref="btn">Click Me</button>
</div>
```

```javascript
import { Klass, View } from "k-util";

const Counter = Klass(
  {
    name: "counter",

    data: {
      clickTimes: 0
    },

    constructor() {
      this.Super();
      this.element = document.getElementById("counter");

      // Add event listeners and make methods callable from other components
      this.listen();
    },

    // Event listeners added by 'data-click' or 'data-on' are bind to self
    onBtnClick() {
      this.refs.timesSpan.textContent = ++this.data.clickTimes;
    }
  },

  View
);

const counter = new Counter();

const v = new View();

counter.refs.btn.dispatchEvent(new Event("click"));
console.log(counter.refs.timesSpan.textContent); // 1

v.dispatch("counter.onBtnClick");
console.log(counter.refs.timesSpan.textContent); // 2

counter.destroy();
v.destroy();
```
