export function isInt(v: any): boolean {
  return typeof v == 'number' && (v | 0) == v;
}

export function isString(v: any): boolean {
  return typeof v == 'string';
}

export function isFunction(v: any): boolean {
  return typeof v == 'function';
}

export function isArray(v: any): boolean {
  return v instanceof Array;
}

export function isObject(v: any): boolean {
  return v instanceof Object;
}

export function isNull(v: any): boolean {
  return v == null;
}

export function isJSON(v: any): boolean {
  try {
    return typeof JSON.parse(v) == 'object';
  } catch (e) {
    return false;
  }
}

export function toArray(v: object): Array<any> {
  return Array.prototype.slice.call(v);
}

export function get(o: any, path: string): any {
  if (typeof o == 'string' || o instanceof Object) {
    const paths: string[] | null = path.match(/[^\.\[\]\'\"]+/gi);
    if (paths) {
      paths[0] = o[paths[0]];
      return paths.reduce((result: any, key: string): any => (result ? result[key] : null));
    }
  }
  return null;
}

export function last(a: Array<any>): any {
  return a[a.length - 1];
}

export function each(o: any, f: (v: any, k: number | string) => any) {
  if (!(o instanceof Object)) return;
  if (o.length) {
    for (let i = 0; i < o.length; i++) {
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
