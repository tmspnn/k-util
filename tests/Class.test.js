import assert from "node:assert/strict";
import test from "node:test";

import Class from "../src/Class.js";

test("Class", async (t) => {
    await t.test("Inheritance", (t) => {
        const A = Class({name: "A", getName() { return this.name; }});

        const B = Class({name: "B"}).inherit(A);

        const b = new B();

        assert(b instanceof A);
    });

    await t.test("Binding 'this'", (t) => {
        const C = Class({getThis() { return this; }})

        const c = new C();

        const d = {name: "d"};

        d.getThis = c.getThis;

        assert(d.getThis() == c);
    });

    await t.test("Static property", (t) => {
        const E = Class().static({staticName: "E"});

        assert(E.staticName == "E");
    });

    await t.test("Implementing interface", (t) => {
        const interfaceX = {
            x: "x",

            getX() { return this.x; },

            setX(x) { this.x = x; }
        }

        const F = Class().implement(interfaceX);

        const f = new F();

        assert(f.x == "x");

        f.setX("xx");

        assert(f.getX() == "xx");
    });
});
