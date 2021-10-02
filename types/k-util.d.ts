export as namespace kutil;

export function at(o: any, ...paths: Array<number | string>): any;

export function each(o: Record<string, any>, f: (v: any, k: number | string) => void): void;

export class View {
    namespace: string;

    name: string;

    refs: Record<string, HTMLElement>;

    bindElement: (el: HTMLElement) => void;

    eventHandler: (method: string, ...args: any[]) => void;

    dispatch: (ptn: string, ...args: any[]) => void;
    
    dispatchNS: (ns: string, ptn: string, ...args: any[]) => void;
    
    destroy: () => void;

    element?: null | HTMLElement;
}
