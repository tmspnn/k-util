# k-util

Useful utility functions for front-end development.

**2KB** Gzipped, no dependencies, compatible with all modern browsers (Chrome 42+, Edge 13+, Safari 9+, Firefox 45+).

-   [k-util](#k-util)
    -   [Installation](#installation)
    -   [Get Started](#get-started)
    -   [Documentation](#documentation)

## Installation

```
npm i k-util
```

## Get Started

```html
<div id="counter">
	<p data-ref="p"></p>
	<button data-click="onBtnClick">Click Me</button>
</div>
```

```javascript
import { View } from "k-util";

class Counter extends View {
	name = "counter";

	clicked = 0;

	onBtnClick() {
		this.refs.p.textContent = ++this.clicked;
	}
}

const counter = new Counter(document.getElementById("counter"));
const controller = new View();

// Components' initialization is asynchronous.
setTimeout(() => {
	counter.refs.btn.click();
	console.log(counter.refs.p.textContent); // 1

	// Call method from an external component.
	controller.dispatch("counter.onBtnClick");
	console.log(counter.refs.p.textContent); // 2

	counter.destroy(); // Will remove the counter element from DOM tree
	v.destroy();
});
```

## Documentation

| API          | Type          | Description                                                                                                                                                                                              |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-view`  | HTML          | Component label. If a child of `this.element` has this attribute, the child and its children won't be put into `this.refs`                                                                               |
| `data-click` | HTML          | Bind click listener, method will bind to `this` automatically.                                                                                                                                           |
| `data-on`    | HTML          | Bind event listeners, multiple event-handler pairs seperated by `;`. `data-on="click: onClick; input: onInput;"` methods will bind to `this` automatically                                               |
| `data-ref`   | HTML          | Declare DOM reference, could be refered later in `this.refs`                                                                                                                                             |
| name         | View Property | default ""                                                                                                                                                                                               |
| element      | View Property | Required for front-end components                                                                                                                                                                        |
| refs         | View Property | default {}                                                                                                                                                                                               |
| dispatch     | View Method   | Call other components' method. `this.dispatch("anotherComponent.someMethod", 1, 2, 3)` will call the method `someMethod` of the component with name "anotherComponent", `1, 2, 3` will be the parameters |
| destroy      | View Method   | Will remove `this.element` from the DOM tree, and stop listening calls from other components                                                                                                             |
