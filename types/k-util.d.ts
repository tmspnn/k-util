export as namespace kutil;

type Func = (...args: any[]) => void;

type Sub = null | {
  listener: Func;
  context: any;
};

interface Dict<T> {
  [k: string]: T;
}

export function at(o: any, ...paths: Array<number | string>): any;

export function clone(o: any): typeof o;

export function each(o: Dict, f: (v: any, k: number | string) => void): void;

export function Ee(): {
  subscriptions: Dict<Array<Sub>>;

  on: (channel: string, listener: Func, context: any) => void;

  off: (channel: string, listener: Func, context: any) => void;

  emit: (channel: string, ...args: any[]) => void;
};

export function isBrowser(): boolean;

export function Klass(
  props: Dict<any>,
  Base?: (...args: any[]) => any
): (...args: any[]) => any;

export function parseJSON(v: any): null | Dict<any>;

export function toArray(v: Dict<any>): any[];

export function View(): (...args: any[]) => {
  namespace: string;
  name: string;
  element: null | HTMLElement;
  refs: Dict<HTMLElement>;
  data: Dict<any>;
  constructor: (...args: any[]) => any;
  dispatch: (ptn: string, ...args: any[]) => void;
  dispatchNS: (ns: string, ptn: string, ...args: any[]) => void;
  listen: () => void;
  destroy: () => void;
  _eventHandler: (method: string, ...args: any[]) => void;
  _createBindings: (el: null | HTMLElement) => void;
};
