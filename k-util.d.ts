export as namespace kutil;

export class CustomClass {
    constructor(initialValues?: Record<string|symbol, any>);

    _isCustomClass: true;

    _implementedInterfaces: Record<string, any>[];

    static(staticProps: Record<string, any>): this;

    extends(Base: CustomClass): this;

    implements(...interfaces: Record<string, any>[]): this;
};

export function Class(proto: Record<string, any>): CustomClass;

export class CustomEventEmitter {
    constructor();

    on(channel: string|symbol, listener: (...args: any) => void, context?: any): void;

    off(channel: string|symbol, listener?: (...args: any) => void, context?: any): void;

    emit(channel: string|symbol, ...args: any[]): void;
}

export class View {
    constructor();

    eventEmitter: CustomEventEmitter;

    element: null|HTMLElement;

    refs: Record<string, HTMLElement>;

    init(strOrEl: string|HTMLElement): this;

    destroy(): void;
}

declare const viewEventEmitter: CustomEventEmitter;

export type Kxhr = {
    state: "pending"|"resolved"|"rejected"|"cancelled";

    result: any;

    err: null | Error;

    callbacks: Array<{type: "resolve" | "reject" | "finally", f: (result: any) => void}>;

    xhr: XMLHttpRequest;
};

export function kxhr(
    url: string,

    method?: "GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"PATCH",

    data?: any,

    options?: Partial<{
        contentType: string,
        headers: Record<string, string>,
        withCredentials: boolean,
        timeout: number,
        onProgress: (e: ProgressEvent) => void,
        beforeSend: (xhr: XMLHttpRequest) => void
    }>,

    ): Kxhr;

export function stringToElement(s: string): null|HTMLElement;
