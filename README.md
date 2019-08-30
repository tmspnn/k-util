# k-util

A small set of utility functions

## Installation

```
npm install k-util
```

## Methods

```typescript
isInt(v: any): boolean;

isString(v: any): boolean;

isFunction(v: any): boolean;

isArray(v: any): boolean;

isObject(v: any): boolean;

isNaN(v: any): boolean;

isNull(v: any): boolean;

isJSON(v: any): boolean;

parseJSON(v: string): any;

isBrowser: boolean;

toArray(v: { [k: string]: any }): Array<any>;

getPropByPath(o: any, path: string): any;

last(a: Array<any>): any;

each(o: { [k: string]: any }, f: (v: any, k: number | string) => void): void;
```
