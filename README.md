# k-util

Useful utility functions for front-end development.

-   A helper function `Class` for convenient object-oriented patterns (this binding, static properties, inheritance and implementing interfaces).

-   A small class `CustomEventEmitter` for custom events.

-   A custom class `View` for communicative UI components with easy DOM reference binding and adding event listeners.

-   A helper function `kxhr` for making HTTP requests.

-   A helper function `stringToElement` for creating DOM element with string.

-   **2KB** Gzipped, no dependencies, compatible with all modern browsers (Chrome 42+, Edge 13+, Safari 9+, Firefox 45+).

## Installation

```shell
npm i k-util
```

```html
<script src="node_modules/k-util/dist/kutil.min.js"></script>
```

## Get Started

```javascript
import { Class } from "k-util";

const A = Class({
    name: "A",
    getName() {
        return this.name;
    }
});

const InterfaceX = {
    x: "foo",
    getX() {
        return this.x;
    },
    setX(x) {
        this.x = x;
    }
};

const B = Class({ name: "B" }).inherit(A).implement(InterfaceX);

const b = new B();

b instanceof A; // true

b.getName(); // "B"

b.x; // "foo"

b.setX("bar");

b.getX(); // "bar"
```

```javascript
import { CustomEventEmitter } from "k-util";

const ee = new CustomEventEmitter();

let count = 0;

function addOne() {
    count += 1;
}

ee.on("add", addOne);

ee.emit("add");

count; // 1

ee.off("add", addOne);

ee.emit("add");

count; // 1
```

```html
<div id="counter">
    <p data-ref="p"></p>
    <button data-ref="btn" data-click="onBtnClick">Click Me!</button>
</div>
```

```javascript
import { View } from "k-util";

const counter = new View({
    count: 0,
    onBtnClick() {
        this.count += 1;
        this.refs.p.textContent = this.count.toString();
    }
}).init(document.getElementById("counter"));

counter.refs.btn.click();

counter.count; // 1

counter.eventEmitter; // a CustomEventEmitter
```

```javascript
import { kxhr } from "k-util";

const res = await kxhr(
    "https://jsonplaceholder.typicode.com/posts",
    "post",
    JSON.stringify({
        id: 1,
        data: "foo"
    }),
    { contentType: "application/json" }
);

const json = JSON.parse(res);
```

```javascript
import { stringToElement } from "k-util";

stringToElement("<div>Hello!</div>"); // HTMLDivElement
```

## Documentation

-   `Class(proto: Record<string, any>): CustomClass`

    -   `_isCustomClass: true`
    -   `_implementedInterfaces: Record<string, any>[]`
    -   `static(staticProps: Record<string, any>): this`
    -   `inherit(Base: CustomClass): this`
    -   `implement(...args: Record<string, any>): this`

-   `CustomEventEmitter`

    -   `on(channel: string | symbol, listener: (...args: any) => void, context?: any): void`
    -   `off(channel: string | symbol, listener?: (...args: any) => void, context?: any): void`
    -   `emit(channel: string | symbol, ...args: any): void`

-   `View`

    -   `eventEmitter: CustomEventEmitter`
    -   `element: null | HTMLElement`
    -   `refs: Record<string, HTMLElement>`
    -   `init(strOrEl: string | HTMLElement): this`
    -   `destroy(): void`
    -   Custom HTML attributes:
        - `data-view="myComponent"`. If an element has attribute `data-view`, it will be seen as a component and it will **NOT** be in the `refs` of its parent.
        - `data-ref="myRef"`. 
        - `data-click="myOnClick"`.
        - `data-on="touchstart: myOnTouchStart; touchmove: myOnTouchMove; touchend: myOnTouchEnd;"`. Separate listeners by semicolons;

-   `kxhr(url: string, method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH", data: any, options: { contentType: string, headers: Record<string, string>, withCredentials?: boolean, timeout?: number, onProgress: (e: ProgressEvent) => void, beforeSend: (xhr: XMLHttpRequest) => void }): Kxhr`
