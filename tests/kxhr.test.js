import {JSDOM} from "jsdom";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import process from "node:process";
import test from "node:test";
import {setTimeout} from "node:timers/promises";

test("kxhr", async (t) => {
    const libStr = readFileSync(process.cwd() + "/dist/kutil.min.js");

    const dom = new JSDOM(`<!doctype html>
		<html>
			<head></head>
			<body>
				<script>${libStr}</script>
			</body>
		</html>`,
                          {runScripts: "dangerously"});

    const window = dom.window;

    const eq = assert.strict;

    window.eval(`var { kxhr } = kutil;`);

    await t.test("Get", async (t) => {
        const res = await window.eval(`kxhr("https://jsonplaceholder.typicode.com/todos/1")`);
        const json = JSON.parse(res);
        eq(json.id, 1);
        eq(json.userId, 1);
        eq(json.title, "delectus aut autem");
        assert(!json.completed);
    });

    await t.test("Post JSON", async (t) => {
        const res = await window.eval(
            `kxhr("https://jsonplaceholder.typicode.com/posts", "post", JSON.stringify({ id: 1, data: "foo" }), { contentType: "application/json" })`);
        const json = JSON.parse(res);
        eq(json.id, 101);
        eq(json.data, "foo");
    });

    await t.test("Cancel", async (t) => {
        const k = window.eval(`
            var i = 0;

            var finallyCalled = false;

            var k = kxhr("https://jsonplaceholder.typicode.com/todos/1")
                .then(() => ++i)
                .finally(() => finallyCalled = true);

            k.cancel();
        `);

        await setTimeout(1000);

        var r = window.eval("i;")

        eq(r, 0);

        r = window.eval("finallyCalled;")

        eq(r, true);
    });

    await t.test("Await & Throw", async (t) => {
        try {
            await window.eval(
                `kxhr("https://jsonplaceholder.typicode.com/todos/1").then(() => { throw new Error("Custom error message..."); })`);
        } catch (e) {
            eq(e.message, "Custom error message...");
        }
    });
});
