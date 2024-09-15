// src/Class.js
function Class(proto = {}) {
  function C(initialValues = {}) {
    copyAndBind(this, proto);
    C._implementedInterfaces.forEach((i) => copyAndBind(this, i));
    copyAndBind(this, initialValues);
  }
  Object.assign(C.prototype, proto);
  C._isCustomClass = true;
  C._implementedInterfaces = [];
  C.static = function(o) {
    return Object.assign(C, o);
  };
  C.inherit = function(B) {
    if (!B._isCustomClass) {
      throw new TypeError("CustomClass.inherit requires a custom class, but received: " + String(B));
    }
    Object.setPrototypeOf(C.prototype, B.prototype);
    return C;
  };
  C.implement = function(...interfaces) {
    C._implementedInterfaces = interfaces;
    return C;
  };
  return C;
}
function copyAndBind(target, source, thisArg) {
  const self = thisArg || target;
  Object.keys(source).forEach((k) => {
    const v = source[k];
    const t = typeof v;
    if (v == null || t == "number" || t == "string" || t == "boolean" || t == "symbol") {
      target[k] = v;
    } else if (typeof v == "function") {
      target[k] = v.bind(self);
    } else {
      target[k] = Array.isArray(v) ? [] : {};
      copyAndBind(target[k], v, self);
    }
  });
}

// src/CustomEventEmitter.js
var CustomEventEmitter = class {
  constructor() {
    this.displayName = "CustomEventEmitter";
    this.subscriptions = {};
  }
  /**
   * @param {string | symbol} channel
   * @param {(...args: any) => void} listener
   * @param {*} context
   */
  on(channel, listener, context) {
    const sub = { listener, context };
    if (this.subscriptions[channel]) {
      this.subscriptions[channel].push(sub);
    } else {
      this.subscriptions[channel] = [sub];
    }
  }
  /**
   * @param {string | symbol} channel
   * @param {(...args: any) => void} listener
   * @param {*} context
   */
  off(channel, listener, context) {
    if (!this.subscriptions[channel]) {
      return;
    }
    if (listener) {
      this.subscriptions[channel].forEach((sub, i) => {
        if (sub && sub.listener == listener && sub.context == context) {
          this.subscriptions[channel][i] = null;
        }
      });
    } else {
      this.subscriptions[channel] = null;
    }
  }
  /**
   * @param {string | symbol} channel
   * @param {any[]} args
   */
  emit(channel, ...args) {
    if (this.subscriptions[channel]) {
      this.subscriptions[channel].forEach((sub) => {
        if (sub) {
          sub.listener.call(sub.context, ...args);
        }
      });
    }
  }
};

// src/kxhr.js
function kxhr(url, method = "GET", data = null, options = {}) {
  const k = {
    /**
     * @type {"pending" | "resolved" | "rejected" | "cancelled"}
     */
    state: "pending",
    result: null,
    err: null,
    callbacks: [],
    xhr: new XMLHttpRequest()
  };
  k.xhr.open(method.toUpperCase(), url, true);
  if (options.contentType) {
    k.xhr.setRequestHeader("Content-Type", options.contentType);
  }
  if (options.headers) {
    Object.keys(options.headers).forEach((h) => {
      k.xhr.setRequestHeader(h, options.headers[h]);
    });
  }
  k.xhr.withCredentials = options.withCredentials || false;
  k.xhr.timeout = options.timeout || 0;
  k.xhr.onload = onLoad.bind(k);
  k.xhr.onerror = onError.bind(k);
  k.next = next.bind(k);
  k.then = then.bind(k);
  k.catch = kCatch.bind(k);
  k.cancel = cancel.bind(k);
  k.finally = kFinally.bind(k);
  if (options.onProgress == "function") {
    if (k.xhr.upload) {
      k.xhr.upload.onprogress = options.onProgress;
    } else {
      k.xhr.onprogress = options.onProgress;
    }
  }
  if (typeof options.beforeSend == "function") {
    options.beforeSend(k.xhr);
  }
  setTimeout(() => k.xhr.send(data));
  return k;
}
function isPromise(o) {
  return o != null && typeof o == "object" && typeof o.then == "function";
}
function then(onResolve, onReject) {
  if (typeof onResolve == "function") {
    this.callbacks.push({ type: "resolve", f: onResolve });
  }
  if (typeof onReject == "function") {
    this.callbacks.push({ type: "reject", f: onReject });
  }
  return this;
}
function kCatch(onReject) {
  return this.then(null, onReject);
}
function kFinally(onComplete) {
  if (typeof onComplete == "function") {
    this.callbacks.push({ type: "finally", f: onComplete });
  }
  return this;
}
function cancel() {
  this.xhr.abort();
  this.state = "cancelled";
  var i = this.callbacks.length;
  while (--i) {
    const cb = this.callbacks[i];
    if (cb.type == "finally") {
      cb.f(this.xhr);
      break;
    }
  }
}
function onLoad() {
  if (this.xhr.status >= 200 && this.xhr.status < 400) {
    this.state = "resolved";
    this.result = this.xhr.response;
    this.next();
  } else {
    this.xhr.onerror();
  }
}
function onError() {
  this.state = "rejected";
  this.err = new Error(this.xhr.response || this.xhr.statusText);
  this.next();
}
function next() {
  for (var i = 0; i < this.callbacks.length; ++i) {
    const cb = this.callbacks[i];
    if (isPromise(this.result)) {
      if (cb.type == "resolve") {
        this.result.then(cb.f);
      } else if (cb.type == "reject") {
        this.result.catch(cb.f);
      } else if (cb.type == "finally") {
        this.result.finally(cb.f);
      }
    } else if (this.state == "resolved" && cb.type == "resolve") {
      try {
        this.result = cb.f(this.result);
      } catch (e) {
        this.state = "rejected";
        this.err = e;
      }
    } else if (this.state == "rejected" && cb.type == "reject") {
      this.result = cb.f(this.err);
      this.state = "resolved";
    } else if (cb.type == "finally") {
      cb.f(this.xhr);
    }
  }
}

// src/stringToElement.js
var parser = new DOMParser();
function stringToElement(html) {
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.firstChild;
}

// src/View.js
var viewEventEmitter = new CustomEventEmitter();
var View = Class({
  displayName: "CustomClass [[ View ]]",
  eventEmitter: viewEventEmitter,
  /**
   * @type {null | HTMLElement}
   */
  element: null,
  /**
   * @type {Record<string, HTMLElement>}
   */
  refs: {},
  /**
   * @param {string | HTMLElement} strOrEl
   */
  init(strOrEl) {
    if (typeof strOrEl == "string") {
      this.element = stringToElement(strOrEl);
    } else if (typeof strOrEl == "object") {
      this.element = strOrEl;
    } else {
      throw new TypeError(`View.init(strOrEl: string | HTMLElement) does not recognize ${String(strOrEl)}.`);
    }
    this.refs = { self: this.element };
    this.traverse(this.element);
    return this;
  },
  /**
   * @param {HTMLElement} el
   */
  traverse(el) {
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
          el.addEventListener(e, this[h]);
        }
      });
    }
    for (var i = 0; i < el.children.length; ++i) {
      const ch = el.children[i];
      if (!ch.hasAttribute("data-view")) {
        this.traverse(ch);
      }
    }
  },
  destroy() {
    if (document.body.contains(this.element)) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.refs = {};
  }
});
export {
  Class,
  CustomEventEmitter,
  View,
  kxhr,
  stringToElement,
  viewEventEmitter
};
