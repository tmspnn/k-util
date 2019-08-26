export as namespace kUtil;

export function isInt(v: any): boolean;

export function isString(v: any): boolean;

export function isFunction(v: any): boolean;

export function isArray(v: any): boolean;

export function isObject(v: any): boolean;

export function isNaN(v: any): boolean;

export function isNull(v: any): boolean;

export function isJSON(v: any): boolean;

export const isBrowser: boolean;

export function toArray(v: { [k: string]: any }): Array<any>;

export function getPropByPath(o: any, path: string): any;

export function last(a: Array<any>): any;

export function each(o: { [k: string]: any }, f: (v: any, k: number | string) => void): void;
