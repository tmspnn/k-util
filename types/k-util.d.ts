export as namespace kutil;

export function at(o: any, path: string): any;

export function each(
  o: { [k: string]: any },
  f: (v: any, k: number | string) => void
): void;

export function Ee(): {
  subscriptions: Array<(...args: any[]) => void>;

  on: (
    channel: string,
    listener: (...args: any[]) => void,
    context: any
  ) => void;

  off: (channel: string, listener: (...args: any[]) => void) => void;

  emit: (channel: string, ...args: any[]) => void;
};

export function int(v: any): number;

export function isBrowser(): boolean;

export function Klass(
  props: { [k: string]: any },
  Base?: (...args: any[]) => any
): (...args: any[]) => any;

export function parseJSON(v: any): null | { [k: string]: any };

export function put(o: any, path: string, v: any): any;

export function toArray(v: { [k: string]: any }): any[];

export function View(): (...args: any[]) => {
  namespace: string;
  name: string;
  element: null | HTMLElement;
  refs: { [k: string]: HTMLElement };
  data: null | { [k: string]: any };
  bindings: { [k: string]: () => void };
  constructor: (...args: any[]) => any;
  bindData: (data: { [k: string]: any }) => void;
  setData: (k: string | { [k: string]: any }, v: any) => void;
  dispatch: (ptn: string, ...args: any[]) => void;
  listen: () => void;
  destroy: () => void;
  onBroadcast: (...args: any[]) => void;
  _eventHandler: (method: string, ...args: any[]) => void;
  _createBindings: (el: HTMLElement) => void;
  _onDataUpdate: (arg: string | string[]) => void;
  _mutate: () => void;
};
