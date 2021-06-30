// External modules
const kutil = require("../dist/k-util");

const test = require("ava");

test("Event Emitter", (t) => {
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

      constructor() {
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
});
