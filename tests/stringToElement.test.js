import {JSDOM} from "jsdom";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import process from "node:process";
import test from "node:test";
import {setTimeout} from "node:timers/promises";

test("stringToElement", async (t) => {
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

    const r = window.eval(`
        var { stringToElement } = kutil;

        var div = stringToElement('<div class="test-div">Hello <b>k-util!</b></div>');

        div;
    `);

    assert(r.className, "test-div");

    assert(r.textContent == "Hello k-util!");
});
