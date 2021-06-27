import at from "./at";
import each from "./each";
import Ee from "./Ee";
import Klass from "./Klass";
import put from "./put";

const assign = Object.assign;
const keys = Object.keys;

const ENV = typeof window == "undefined" ? global : window;

let ee = ENV._ee;

if (!ee) {
  ee = ENV._ee = new Ee();
}

const View = Klass({
  namespace: "",

  name: "",

  element: null,

  refs: null,

  data: null,

  bindings: null,

  constructor() {
    this.namespace = ENV.location
      ? ENV.location.pathname
      : ENV.process.title + " " + ENV.process.version;
  },

  /**
   * @param {String|Object} k
   * @param {*} v
   */
  setData(k, v) {
    if (!this.data) this.data = {};

    if (typeof k == "string") {
      if (typeof v == "function") {
        v(at(this.data, k));
      } else {
        put(this.data, k, v);
      }
      this._onDataUpdate(k);
    } else if (k instanceof Object) {
      assign(this.data, k);
      keys(k).forEach((key) => this._onDataUpdate(key));
    }
  },

  dispatch(ptn, ...args) {
    const p = ptn.split(".");
    const viewName = p[0];
    const method = p[1];
    ee.emit(this.namespace + "::" + viewName, method, ...args);
  },

  listen() {
    ee.on("global", this.onBroadcast, this);
    ee.on(this.namespace + "::" + this.name, this._eventHandler, this);
  },

  destroy() {
    if (document.documentElement.contains(this.element)) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
    ee.off("global", this.onBroadcast, this);
    ee.off(this.namespace + "::" + this.name, this._eventHandler, this);
  },

  broadcast(...args) {
    ee.emit("global", ...args);
  },

  onBroadcast() {},

  _eventHandler(method, ...args) {
    if (typeof this[method] == "function") {
      this[method].call(this, ...args);
    }
  },

  _onDataUpdate(k) {
    if (!this.bindings) {
      this.bindings = {};
      this._createBindings(this.element);
    }

    if (this.bindings[k]) {
      each(this.bindings[k], (f) => {
        f.call(this);
      });
    }
  },

  _createBindings(el) {
    if (!(el instanceof HTMLElement)) return;

    each(el.dataset, (v, k) => {
      switch (k) {
        case "ref":
          if (!this.refs) this.refs = {};
          this.refs[v] = el;
          break;
        case ":":
          each(v.split(";"), (pair) => {
            const p = pair.split(":").map((txt) => txt.trim());
            const attr = p[0];
            const dataProp = p[1];

            if (!dataProp) return;

            const bd =
              attr[0] == "@"
                ? function () {
                    this[attr.slice(1)]();
                  }
                : function () {
                    put(el, attr, at(this.data, dataProp));
                  };

            const bKey = dataProp.match(/[^\.[]+/)[0];

            if (!this.bindings[bKey]) {
              this.bindings[bKey] = [bd];
            } else {
              this.bindings[bKey].push(bd);
            }
          });
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
      this._createBindings(ch);
    });
  }
});

export default View;
