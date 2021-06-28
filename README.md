# k-util

JavaScript utility functions, could also be used as a frontend framework.

**1.7KB** Gzipped, no dependencies, compatible with all modern browsers(Edge 12+).

## Installation

```
npm install k-util
```

## Utility functions

```javascript
import { at, each, Ee, int, isBrowser, parseJSON, put, toArray } from "kutil";

const foo = { bar: 1, zoo: [2, { x: 100 }] };

at(foo, "bar"); // 1
at(foo, "zoo[1].x"); // 100
at(foo, -1); // null

put(foo, "zoo[1].x.a[1].b", "prop set"); // foo.zoo[1].x.a[1].b == "prop set"

each([1, 2, 3], (v, i) => console.log(i, v)); // 0 1, 1 2, 2 3
each({ x: 1, y: 2, z: 3 }, (v, k) => console.log(v, v)); // x 1, y 2, z 3

const ee = new Ee();
const myContext = { text: "this is bind to myContext" };
const listner = function (...args) {
  console.log(this.text, ...args);
};
ee.on("myChannel", listener, myContext);
ee.emit("myChannel", 1, 2, 3); // "this is bind to myContext", 1, 2, 3
ee.off("myChannel", listener, myContext);

int(0.998); // 0

isBrowser(); // true in browser, false in node

parseJSON(undefined); // null
parseJSON(null); //null
parseJSON("null"); // null
parseJSON("foobar"); // null
parseJSON(0); // 0
parseJSON(JSON.stringify({ a: 1 })); // { a: 1 }

const nodeList = document.querySelectorAll(".my-elements");
Array.isArray(toArray(nodeList)); // true;
```

## Klass

```javascript
import { Klass } from "k-util";

const Base = Klass({
  baseFoo: 0,
  baseBar: 0,

  logFoo() {
    console.log(this.baseFoo);
  },

  constructor(baseFoo, baseBar) {
    this.baseFoo = baseFoo;
    this.baseBar = baseBar;
  }
});

const Derived = Klass(
  {
    foo: 0,
    bar: 0,

    logFoo() {
      console.log(this.foo);
    },

    constructor(foo, bar) {
      this.foo = foo;
      this.bar = bar;
      this.Super(foo + 1, bar + 100);
    }
  },
  Base
);

const d = new Derived(1, 2);
d instanceof Base; // true

d.foo; // 1
d.baseFoo; // 2
d.super.foo; // undefined
d.super.baseFoo; // 2

d.bar; // 2
d.baseBar; // 102
d.super.bar; // undefined
d.super.baseBar; // 102

d.logFoo(); // 1
d.super.logFoo(); // 2
```

## View

```html
<div id="counter">
  <p data-ref="paragraph">
    You've clicked
    <span data-:="textContent: clickTimes; @customCallBack: clickTimes">0</span>
    times!
  </p>
  <button data-on="click: onBtnClick">Click Me</button>
</div>
```

```javascript
import { Klass, View } from "k-util";

const Counter = Klass(
  {
    name: "counter",

    constructor() {
      this.Super();
      this.element = document.getElementById("counter");

      // Data binding. Call setData before using this.refs and this.data
      this.setData({ clickTimes: 0 });

      // Make Methods callable from other components
      this.listen();
    },

    // Use "data-on" to register self-bind event listeners
    onBtnClick() {
      this.setData({
        clickTimes: this.data.clickTimes + 1
      });
    },

    // User "data-:" to declare data binding and custom callbacks
    // Custom callback functions could be declared with '@ + method name': property
    // Use "data-ref" to create DOM reference, could be access with 'this.refs'
    customCallBask(...args) {
      console.log(...args);
      console.log(this.refs.paragraph);
    }
  },
  View
);
const counter = new Counter();

const v = new View();

// Will log "param1", "param2", "param3, and the HTMLParagraphElement
v.dispatch("counter.customCallBask", "param1", "param2", "param3");

counter.destroy();
v.destroy();
```
