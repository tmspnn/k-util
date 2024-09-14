/**
 * @typedef Kxhr
 * @property {"pending" | "resolved" | "rejected" | "cancelled"} state
 * @property {*} result
 * @property {null | Error} err
 * @property {Array<{ type: "resolve" | "reject" | "finally", f: (result: any) => void }>} callbacks
 * @property {XMLHttpRequest} xhr
 */

/**
 * @param {string} url
 * @param {"GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"} method
 * @param {*} [data]
 * @param {object} [options]
 * @param {string} [options.contentType]
 * @param {Record<string, string>} [options.headers]
 * @param {boolean} [options.withCredentials = true]
 * @param {number} [options.timeout = 0]
 * @param {(e: ProgressEvent) => void} [options.onProgress]
 * @param {(xhr: XMLHttpRequest) => void} [options.beforeSend]
 * @returns {Kxhr}
 */
export default function kxhr(url, method = "GET", data = null, options = {}) {
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
        Object.keys(options.headers).forEach((h) => { k.xhr.setRequestHeader(h, options.headers[h]); })
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

function isPromise(o) { return o != null && typeof o == "object" && typeof o.then == "function"; }

function then(onResolve, onReject) {
    if (typeof onResolve == "function") {
        this.callbacks.push({type: "resolve", f: onResolve});
    }

    if (typeof onReject == "function") {
        this.callbacks.push({type: "reject", f: onReject});
    }

    return this;
}

function kCatch(onReject) { return this.then(null, onReject); }

function kFinally(onComplete) {
    if (typeof onComplete == "function") {
        this.callbacks.push({type: "finally", f: onComplete});
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
            cb.f(this.xhr)

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
                this.result.finally(cb.f)
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
            cb.f(this.xhr)
        }
    }
}
