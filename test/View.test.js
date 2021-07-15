const test = require("ava");
//
const kutil = require("../dist/k-util");
//
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

      args: null,

      constructor() {
        this.Super();
        this.listen();
      },

      setArgs(...args) {
        this.args = args;
      }
    },
    View
  );
  const c2 = new C2();

  c1.dispatch("c2.setArgs", 1, 2, 3);
  t.deepEqual(c2.args, [1, 2, 3]);

  c2.dispatch("c1.setC1Prop", 100);
  t.is(c1.prop, 100);

  c1.destroy();
  c2.destroy();

  c1.dispatch("c2.setArgs", 100);
  t.deepEqual(c2.args, [1, 2, 3]);

  c2.dispatch("c1.setC1Prop", 23333);
  t.is(c1.prop, 100);

  t.is(c1.element, null);
  t.is(c2.element, null);
});
