/**
 * Retrieve property by path
 * @param {Object} o
 * @param {Number|String} ...
 * @returns *
 */
export default function at(o, ...args) {
  if (o instanceof Object) {
    args[0] = o[args[0]];

    return args.reduce((result, key) =>
      result instanceof Object ? result[key] : null
    );
  }

  return null;
}
