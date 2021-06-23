// External modules
const fs = require("fs");
const JSDOM = require("jsdom").JSDOM;
const test = require("ava");

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
  <div id="test">
    <p data-ref="paragraph">
      You've clicked
      <span data-:="textContent: clickTimes; @customCallBack: clickTimes">0</span>
      times!
    </p>
    <button data-on="click: onBtnClick">Click Me</button>
  </div>
  <script>${kutilJS}</script>
</body>
</html>`,
  {
    runScripts: "dangerously"
  }
);

test("Data binding", (t) => {
  with (dom.window) {
    const { Klass, View } = kutil;
    t.is(typeof View, "function");

    const ClickCounter = Klass(
      {
        constructor() {
          this.Super();
          this.element = document.getElementById("test");
          this.bindData({ clickTimes: 0 });
        },

        onBtnClick() {
          this.setData({
            clickTimes: this.data.clickTimes + 1
          });
        },

        customCallBackCalled: 0,

        customCallBask() {
          ++this.customCallBackCalled;
        }
      },
      View
    );

    const counter = new ClickCounter();
    document.querySelector("button").dispatchEvent(new Event("click"));

    setTimeout(() => {
      t.is(counter.data.clickTimes, 1);
      t.is(counter.data.customCallBackCalled, 1);
      t.is(document.querySelector("span").textContent, 1);
    }, 100);
  }
});

test("Event Emitter", (t) => {
  with (dom.window) {
    const { Klass, View } = kutil;

    const C1 = Klass(
      {
        name: "c1",

        prop: null,

        constructor(...args) {
          this.Super();
          this.listen();
        },

        setC1Prop(prop) {
          this.prop = prop;
        }
      },
      View
    );
    const c1 = new C1();

    const C2 = Klass(
      {
        name: "c2",

        broadcastArgs: null,

        constructor(...args) {
          this.Super();
          this.listen();
        },

        onBroadcast(...args) {
          this.broadcastArgs = args;
        }
      },
      View
    );
    const c2 = new C2();

    c1.broadcast(1, 2, 3);
    t.deepEqual(c2.broadcastArgs, [1, 2, 3]);

    c2.dispatch("c1.setC1Prop", 100);
    t.is(c1.prop, 100);

    c1.destroy();
    c2.destroy();

    c1.broadcast(4, 5, 6, 7, 8);
    t.deepEqual(c2.broadcastArgs, [1, 2, 3]);

    c2.dispatch("c1.setC1Prop", 23333);
    t.is(c1.prop, 100);

    t.is(c1.element, null);
    t.is(c2.element, null);
  }
});
