import at from "./at";
import Ee from "./Ee";
import Klass from "./Klass";
import put from "./put";

const ee = new Ee();
const assign = Object.assign;
const keys = Object.keys;
const isArray = Array.isArray;

const View = Klass({
  namespace: "global",

  name: "",

  element: null,

  refs: {},

  data: null,

  bindings: {},

  constructor() {
    this.namespace = location.href;
  },

  bindData(data) {
    if (data) {
      if (this.data) {
        assign(this.data, data);
      } else {
        this.data = data;
      }
    }

    if (this.element) {
      this._createBindings(this.element);
    }
  },

  setData(k, v) {
    if (typeof k == "string") {
      if (typeof v == "function") {
        v(this.data[k]);
      } else {
        this.data[k] = v;
      }
      this._onDataUpdate(k);
    } else if (k instanceof Object) {
      assign(this.data, k);
      this._onDataUpdate(keys(k));
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
    console.log("name: ", this.name);
    console.log("method: ", method);

    if (typeof this[method] == "function") {
      this[method].call(this, ...args);
    }
  },

  _createBindings(el) {
    for (let k in el.dataset) {
      if (el.dataset.hasOwnProperty(k)) {
        switch (k) {
          case "ref":
            this.refs[el.dataset.ref] = el;
            break;
          case ":":
            el.dataset[":"].split(";").forEach((pair) => {
              const p = pair.split(":").map((txt) => txt.trim());
              const attr = p[0];
              const dataProp = p[1];

              if (!dataProp) return;

              let f;

              if (attr[0] == "@") {
                f = () => this[attr.slice(1)]();
              } else {
                f = () => put(el, attr, at(this.data, dataProp));
              }

              const bKey = dataProp.match(/[^\.[]+/)[0];

              if (!this.bindings[bKey]) {
                this.bindings[bKey] = [f];
              } else {
                this.bindings[bKey].push(f);
              }
            });
            break;
          case "on":
            el.dataset.on.split(";").forEach((pair) => {
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
      }
    }

    for (let i = 0; i < el.children.length; ++i) {
      this._createBindings(el.children[i]);
    }
  },

  _onDataUpdate(arg) {
    if (typeof arg == "string") {
      this._mutate(arg);
    } else if (isArray(arg)) {
      arg.forEach((a) => this._mutate(a));
    }
  },

  _mutate(bKey) {
    const binding = this.bindings[bKey];
    if (binding) {
      binding.forEach((f) => f());
    }
  }
});

export default View;
