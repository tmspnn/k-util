import assert from "node:assert/strict";
import test from "node:test";

import CustomEventEmitter from "../src/CustomEventEmitter.js";

test("CustomEventEmitter", async (t) => {
    const ee = new CustomEventEmitter();

    var count = 0;

    function addOne() { ++count; }

    await t.test(".on", (t) => {
        ee.on("add", addOne);

        ee.emit("add");

        assert(count == 1);
    });

    await t.test(".off", (t) => {
        ee.off("add", addOne);

        ee.emit("add");

        assert(count == 1);
    });

    await t.test(".off all listeners", (t) => {
        ee.on("add", addOne);
        ee.on("add", addOne);
        ee.on("add", addOne);

        ee.emit("add");

        assert(count == 4);

        ee.off("add");

        ee.emit("add");

        assert(count == 4);
    });
});
