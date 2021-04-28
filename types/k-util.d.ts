export as namespace kutil;

export function isInt(v: any): boolean;

export function isJSON(v: any): boolean;

export function parseJSON(v: any): null | { [k: string]: any };

export const isBrowser: boolean;

export function toArray(v: { [k: string]: any }): Array<any>;

export function at(o: any, path: string): any;

export function each(o: { [k: string]: any }, f: (v: any, k: number | string) => void): void;
