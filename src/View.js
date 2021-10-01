import each from "./each";
import Ee from "./Ee";
import Klass from "./Klass";

const ENV = typeof window == "undefined" ? global : window;

let ee = ENV._ee;

if (!ee) {
    ee = ENV._ee = new Ee();
}

const View = Klass({
    namespace: "",

    name: "",

    element: null,

    refs: {},

    data: {},

    constructor() {
        this.namespace = ENV.location
            ? ENV.location.pathname + ENV.location.search
            : ENV.process.title + " " + ENV.process.version;
    },

    listen() {
        if (this.element) {
            this._createBindings(this.element);
        }
        ee.on(this.namespace + "::" + this.name, this._eventHandler, this);
    },

    dispatch(ptn, ...args) {
        const p = ptn.split(".");
        const viewName = p[0];
        const method = p[1];
        ee.emit(this.namespace + "::" + viewName, method, ...args);
    },

    dispatchNS(ns, ptn, ...args) {
        const p = ptn.split(".");
        const viewName = p[0];
        const method = p[1];
        ee.emit(ns + "::" + viewName, method, ...args);
    },

    destroy() {
        if (
            typeof document != "undefined" &&
            document.body.contains(this.element)
        ) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
        ee.off(this.namespace + "::" + this.name, this._eventHandler, this);
    },

    _eventHandler(method, ...args) {
        if (typeof this[method] == "function") {
            this[method].call(this, ...args);
        }
    },

    _createBindings(el) {
        if (!(el instanceof HTMLElement)) return;

        each(el.dataset, (v, k) => {
            switch (k) {
                case "ref":
                    this.refs[v] = el;
                    break;
                case "click":
                    if (typeof this[v] == "function") {
                        el.addEventListener("click", this[v].bind(this));
                    }
                    break;
                case "on":
                    each(v.split(";"), (pair) => {
                        const p = pair.split(":").map((txt) => txt.trim());
                        const e = p[0];
                        const h = p[1];
                        if (e && typeof this[h] == "function") {
                            el.addEventListener(e, this[h].bind(this));
                        }
                    });
                    break;
                default:
                    break;
            }
        });

        each(el.children, (ch) => {
            if (/^-\w|\s+-\w/.test(ch.className) || ch.hasAttribute("data-view"))
                return;

            this._createBindings(ch);
        });
    }
});

export default View;
