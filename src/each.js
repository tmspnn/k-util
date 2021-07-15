/**
 * Collections' forEach
 * @param {Array|Object} o
 * @param {Function(*, Number|String)} f
 * @returns Void
 */
export default function each(o, f) {
  if (o.length) {
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
