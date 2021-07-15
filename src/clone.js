/**
 * Deep clone an object
 * @param {Object} o
 */
export default function clone(o) {
  if (o && typeof o == "object") {
    const cloned = {};

    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        cloned[k] = clone(o[k]);
      }
    }

    return cloned;
  }

  return o;
}
