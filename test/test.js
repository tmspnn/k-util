import { readFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

test("kutil", async (t) => {
	const libStr = readFileSync("./dist/kutil.min.js");
	const eq = assert.strictEqual;
	const dom = new JSDOM(
		`<!doctype html>
		<html>
			<head></head>
			<body>
				<div data-view="myView">
					<p data-ref="p"></p>
					<button data-ref="btn" data-click="onBtnClick">Click Me</button>
				</div>
				<script>${libStr}</script>
			</body>
		</html>`,
		{ runScripts: "dangerously" }
	);
	const window = dom.window;

	await t.test("at", (t) => {
		const r = window.eval(`
			var at = kutil.at;
			var a = [{}, { a: { b: [1, 2, { c: [1, 2, { d: 99 }] }] } }];

			at(a, 1, "a", "b", 2, "c", 2, "d");
		`);
		eq(r, 99);
	});

	await t.test("each", (t) => {
		window.eval(`
			var each = kutil.each;

			var a = [{}, {}, {}];
			var b = { x: {}, y: {}, z: {} };

			each(a, (v, i) => (v.idx = i));
			each(b, (v, k) => (v.key = k));
		`);
		eq(window.eval("a[2].idx"), 2);
		eq(window.eval("b.z.key"), "z");
	});

	await t.test("stringToElement", (t) => {
		const div = window.eval(`
			var stringToElement = kutil.stringToElement;
			
			stringToElement("<div>Hello</div>");
		`);
		eq(div.textContent, "Hello");
	});

	await t.test("View", async (t) => {
		window.eval(`
			var View = kutil.View;

			class MyView extends View {
				name = "myView";

				clicked = 0;

				onBtnClick() {
					this.refs.p.textContent = ++this.clicked;	
				}
			}

			var myView = new MyView(document.querySelector("[data-view='myView']"));
			var controller = new View();
		`);

		// The initialization of components is asynchronous.
		await setTimeout(100);

		eq(window.eval("typeof myView"), "object");
		eq(window.eval("myView.namespace"), "");
		eq(window.eval("myView.name"), "myView");
		eq(window.eval("myView.refs.p instanceof HTMLParagraphElement"), true);
		eq(window.eval("myView.refs.btn instanceof HTMLButtonElement"), true);

		// Event handler.
		window.eval("myView.refs.btn.click()");
		eq(window.eval("myView.refs.p.textContent"), "1");

		// Call method from an external component.
		// This could be used to implement the Model-View-Controller pattern.
		window.eval("controller.dispatch('myView.onBtnClick')");
		eq(window.eval("myView.refs.p.textContent"), "2");

		// The .destroy method will unsubscribe events and remove the HTML element.
		window.eval("myView.destroy()");
		eq(window.eval(`document.querySelector("[data-view='myView']")`), null);
	});
});
