/**
 * Iterate collections
 * @param {Array|Object} o
 * @param {Function(*, number|string)} f
 * @returns void
 */
export default function each(o, f) {
	if (typeof o.length == "number") {
		for (let i = 0; i < o.length; ++i) {
			f(o[i], i);
		}
	} else {
		for (let k in o) {
			if (o.hasOwnProperty(k)) {
				f(o[k], k);
			}
		}
	}
}
