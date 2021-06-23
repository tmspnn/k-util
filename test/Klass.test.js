const test = require("ava");
const Klass = require("../dist/k-util").Klass;

test("New", (t) => {
  t.is(typeof Klass, "function");

  const K = Klass({
    a: 1,
    setA(v) {
      this.a = v;
    }
  });
  const k = new K();

  t.is(k.a, 1);

  k.setA(100);
  t.is(k.a, 100);
});

test("Inheritance", (t) => {
  const Base = Klass({
    isBase: true,
    baseFunc() {
      return "baseFunc";
    }
  });

  const Foo = Klass(
    {
      isFoo: true,
      func() {
        return "func";
      }
    },
    Base
  );

  const foo = new Foo();

  t.is(foo instanceof Base, true);
  t.is(foo.baseFunc(), "baseFunc");
});

test("Constructor", (t) => {
  const Base = Klass({
    constructor(baseProp1, baseProp2, baseProp3) {
      this.baseProp1 = baseProp1;
      this.baseProp2 = baseProp2;
      this.baseProp3 = baseProp3;
    }
  });

  const Foo = Klass(
    {
      constructor(...args) {
        const [prop1, prop2, prop3] = args;
        this.prop1 = prop1;
        this.prop2 = prop2;
        this.prop3 = prop3;
        this.Super(prop1 - 1, prop2 - 2, prop3 - 3);
      }
    },
    Base
  );

  const foo = new Foo(5, 4, 3);
  t.is(foo.prop1, 5);
  t.is(foo.baseProp1, 4);
  t.is(foo.prop2, 4);
  t.is(foo.baseProp2, 2);
  t.is(foo.prop3, 3);
  t.is(foo.baseProp3, 0);
  t.is(foo.super.prop1, undefined);
  t.is(foo.super.baseProp1, 4);
  t.is(foo.super.prop2, undefined);
  t.is(foo.super.baseProp2, 2);
  t.is(foo.super.prop3, undefined);
  t.is(foo.super.baseProp3, 0);
});
