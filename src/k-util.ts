export function isInt(v: any) {
  return typeof v == "number" && (v | 0) == v;
}

export function isString(v: any) {
  return typeof v == "string";
}

export function isFunction(v: any) {
  return typeof v == "function";
}

export function isArray(v: any) {
  return v instanceof Array;
}

export function isObject(v: any) {
  return v != null && typeof v == "object";
}

export function isNaN(v: any) {
  return v != v;
}

export function isNull(v: any) {
  return v == null;
}

export function isJSON(v: any) {
  try {
    return typeof JSON.parse(v) == "object";
  } catch (e) {
    return false;
  }
}

export const isBrowser: boolean = new Function(`
try {
  return this == window;
} catch (e) {
  return false;
}`)();

export function toArray(v: { [k: string]: any }) {
  return Array.prototype.slice.call(v);
}

export function getPropByPath(o: any, path: string): any {
  if (typeof o == "string" || o instanceof Object) {
    const paths: string[] | null = path.match(/[^\.\[\]\'\"]+/gi);
    if (paths) {
      paths[0] = o[paths[0]];
      return paths.reduce((result: any, key: string): any => {
        return result instanceof Object ? result[key] : null;
      });
    }
  }
  return null;
}

export function last(a: Array<any>): any {
  return a[a.length - 1];
}

export function each(o: { [k: string]: any }, f: (v: any, k: number | string) => void) {
  if (o.length) {
    for (let i = 0, len = o.length; i < len; ++i) {
      f(o[i], i);
    }
  } else {
    for (let i in o) {
      if (o.hasOwnProperty(i)) {
        f(o[i], i);
      }
    }
  }
}
