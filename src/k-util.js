export function isInt(v) {
  return typeof v == "number" && (v | 0) == v;
}

export function isJSON(v) {
  try {
    return JSON.parse(v) instanceof Object;
  } catch (e) {
    return false;
  }
}

export function parseJSON(v) {
  try {
    return JSON.parse(v);
  } catch (e) {
    return null;
  }
}

export const isBrowser = new Function(`
try {
  return this == window;
} catch (e) {
  return false;
}`)();

export function toArray(v) {
  return Array.prototype.slice.call(v);
}

export function at(o, path) {
  if (typeof o == "string" || o instanceof Object) {
    const paths = path.toString().match(/[^\.\[\]\'\"]+/gi);
    if (paths) {
      paths[0] = o[paths[0]];
      return paths.reduce((result, key) => (result instanceof Object ? result[key] : null));
    }
  }
  return null;
}

export function each(o, f) {
  if (o.length) {
    for (let i = 0; i < o.length; ++i) {
      o[i] = f(o[i], i);
    }
  } else {
    for (let i in o) {
      if (o.hasOwnProperty(i)) {
        o[i] = f(o[i], i);
      }
    }
  }
}

export default {
  isInt,
  isJSON,
  parseJSON,
  isBrowser,
  toArray,
  at,
  each
};
