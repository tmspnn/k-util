# k-util

A small set of utility functions

## Installation

### Node.js

```
npm install k-util
```

### Browser

```
<script src="node_modules/k-util/dist/k-util.min.js"></script>
```

## Methods

- `isInt(v: any): boolean`
- `isString(v: any): boolean`
- `isFunction(v: any): boolean`
- `isArray(v: any): boolean`
- `isObject(v: any): boolean`
- `isNull(v: any): boolean`
- `isJSON(v: any): boolean`
- `toArray(v: object): Array<any>`
- `get(o: any, path: string): any`
- `last(a: Array<any>): any`
- `each(o: any, f: (v: any, k: number | string) => any): void`
