export as namespace kUtil;

export function isInt(v: any): boolean;

export function isString(v: any): boolean;

export function isFunction(v: any): boolean;

export function isArray(v: any): boolean;

export function isObject(v: any): boolean;

export function isNull(v: any): boolean;

export function isJSON(v: any): boolean;

export function toArray(v: object): Array<any>;

export function get(o: any, path: string): any;

export function last(a: Array<any>): any;

export function each(o: any, f: (v: any, k: number | string) => any): void;
