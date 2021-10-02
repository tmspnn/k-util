const test = require("ava");
const kutil = require("../dist/k-util");

test("View", async (t) => {
    const { View } = kutil;

    class C1 extends View {
        name = "c1";

        foo = null;

        setFoo(foo) {
            this.foo = foo;
        }
    }

    class C2 extends View {
        name = "c2";

        bar = null;

        setBar(bar) {
            this.bar = bar;
        }
    }

    const c1 = new C1();
    const c2 = new C2();

    await new Promise((resolve) => {
        setTimeout(() => resolve());
    });

    c1.dispatch("c2.setBar", 1);
    t.is(c2.bar, 1);

    c2.dispatch("c1.setFoo", 100);
    t.is(c1.foo, 100);

    c1.destroy();
    c2.destroy();

    c1.dispatch("c2.setBar", 100);
    t.is(c2.bar, 1);

    c2.dispatch("c1.setFoo", 23333);
    t.is(c1.foo, 100);
});
