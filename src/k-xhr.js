function isPromise(o) {
	return o instanceof Object && typeof o.then == "function";
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

function cancel() {
	this.xhr.abort();
	this.state = "cancelled";

	if (typeof this.onComplete == "function") {
		this.onComplete(this);
	}
}

function kFinally(onComplete) {
	if (typeof onComplete == "function") {
		this.onComplete = onComplete;
	}
	
	return this;
}

function next() {
	for (let i = 0; i < this.callbacks.length; ++i) {
		const cb = this.callbacks[i];

		if (isPromise(this.result)) {
			if (cb.type == "resolve") {
				this.result.then(cb.f);
			} else if (cb.type == "reject") {
				this.result.catch(cb.f);
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
		}
	}

	if (typeof this.onComplete == "function") {
		if (isPromise(this.result)) {
			if (typeof this.result.finally == "function") {
				this.result.finally(this.onComplete);
			}
		} else {
			this.onComplete(this);
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

/**
 * @param {String} url
 * @param {String} method
 * @param {Object} data
 * @param {Function} options.success
 * @param {Function} options.fail
 * @param {Function} options.complete
 * @param {String} options.contentType
 * @param {String} options.headers.*
 * @param {Boolean} options.withCredentials
 * @param {Number} options.timeout
 * @param {Function} options.onProgress
 * @param {Function} options.beforeSend
 */
export default function kxhr(url, method = "get", data = null, options = {}) {
	const k = {
		state: "pending", // "pending" | "resolved" | "rejected" | "cancelled"
		result: null,
		err: null,
		resolve: null,
		reject: null,
		callbacks: [],
		onComplete: null,
		xhr: new XMLHttpRequest()
	};

	if (typeof options.success == "function") {
		k.callbacks.push({ type: "resolve", f: options.success });
	}

	if (typeof options.fail == "function") {
		k.callbacks.push({ type: "reject", f: options.fail });
	}

	if (typeof options.complete == "function") {
		k.onComplete = options.complete;
	}

	k.xhr.open(method.toUpperCase(), url, true);

	if (options.contentType) {
		k.xhr.setRequestHeader("Content-Type", options.contentType);
	}

	if (options.headers) {
		for (let h in options.headers) {
			if (options.headers.hasOwnProperty(h)) {
				k.xhr.setRequestHeader(h, options.headers[h]);
			}
		}
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
