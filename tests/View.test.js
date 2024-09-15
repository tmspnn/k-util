import {JSDOM} from "jsdom";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import process from "node:process";
import test from "node:test";

test("View", async (t) => {
    const libStr = readFileSync(process.cwd() + "/dist/kutil.min.js");

    const dom = new JSDOM(`<!doctype html>
		<html>
			<head></head>
			<body>
				<div class="test-view">
					<p data-ref="p"></p>
					<button data-ref="btn" data-click="onBtnClick">Click Me</button>
				</div>
				<script>${libStr}</script>
			</body>
		</html>`,
                          {runScripts: "dangerously"});

    const window = dom.window;

    await t.test(".init", (t) => {
        var r = window.eval(`
            var {View} = kutil;

            var v = new View({
              clickedTimes: 0,

              onBtnClick() {
                ++this.clickedTimes;
              }
            }).init(document.querySelector('.test-view'));

            typeof v;
        `);

        assert(r == "object");

        r = window.eval("v.displayName == 'CustomClass [[ View ]]'");

        assert(r);

        r = window.eval(`v.refs.p == document.querySelector('p[data-ref="p"]')`);

        assert(r);

        r = window.eval(`v.refs.btn.click(); v.clickedTimes;`);

        assert(r == 1);
    });

    await t.test(".destroy", (t) => {
        var r = window.eval(`var p = v.refs.p; v.destroy(); document.body.contains(p);`);

        assert(!r);

        r = window.eval(`v.element == null;`)

        assert(r);

        r = window.eval(`Object.keys(v.refs).length;`);

        assert(r == 0);
    });
});
