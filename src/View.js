import each from "./each";
import ee from "./ee";

const ENV = typeof window == "undefined" ? global : window;

if (!ENV._ee) {
    ENV._ee = ee;
}

export default class View {
    constructor() {
        this.namespace = ENV.location
            ? ENV.location.pathname + ENV.location.search
            : ENV.process.title + " " + ENV.process.version;

        this.refs = {};

        setTimeout(() => {
            if (typeof this.name != "string") {
                this.name = "";
            }
            if (this.element) {
                this.bindElement(this.element);
            }
            ENV._ee.on(
                this.namespace + "::" + this.name,
                this.eventHandler,
                this
            );
        });
    }

    bindElement(el) {
        if (el.hasAttribute("data-ref")) {
            const refName = el.getAttribute("data-ref");
            this.refs[refName] = el;
        }

        if (el.hasAttribute("data-click")) {
            const method = el.getAttribute("data-click");
            if (typeof this[method] == "function") {
                el.addEventListener("click", this[method].bind(this));
            }
        }

        if (el.hasAttribute("data-on")) {
            const pairs = el.getAttribute("data-on").split(";");
            pairs.forEach((pair) => {
                const p = pair.split(":").map((txt) => txt.trim());
                const e = p[0];
                const h = p[1];
                if (typeof this[h] == "function") {
                    el.addEventListener(e, this[h].bind(this));
                }
            });
        }

        for (let i = 0; i < el.children.length; ++i) {
            const ch = el.children[i];
            if (!ch.hasAttribute("data-view")) {
                this.bindElement(ch);
            }
        }
    }

    dispatch(ptn, ...args) {
        const p = ptn.split(".");
        const viewName = p[0];
        const method = p[1];
        ENV._ee.emit(this.namespace + "::" + viewName, method, ...args);
    }

    dispatchNS(ns, ptn, ...args) {
        const p = ptn.split(".");
        const viewName = p[0];
        const method = p[1];
        ENV._ee.emit(ns + "::" + viewName, method, ...args);
    }

    destroy() {
        if (
            typeof document != "undefined" &&
            document.body.contains(this.element)
        ) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
            this.refs = {};
        }
        ENV._ee.off(
            this.namespace + "::" + this.name,
            this._eventHandler,
            this
        );
    }

    eventHandler(method, ...args) {
        if (typeof this[method] == "function") {
            this[method].call(this, ...args);
        }
    }
}
