export default class CustomEventEmitter {
    constructor() {
        this.displayName = "CustomEventEmitter";
        this.subscriptions = {}
    }

    /**
     * @param {string | symbol} channel
     * @param {(...args: any) => void} listener
     * @param {*} context
     */
    on(channel, listener, context) {
        const sub = {listener, context};

        if (this.subscriptions[channel]) {
            this.subscriptions[channel].push(sub);
        } else {
            this.subscriptions[channel] = [sub];
        }
    }

    /**
     * @param {string | symbol} channel
     * @param {(...args: any) => void} listener
     * @param {*} context
     */
    off(channel, listener, context) {
        if (!this.subscriptions[channel]) {
            return;
        }

        if (listener) {
            this.subscriptions[channel].forEach((sub, i) => {
                if (sub && sub.listener == listener && sub.context == context) {
                    this.subscriptions[channel][i] = null;
                }
            });
        } else {
            this.subscriptions[channel] = null;
        }
    }

    /**
     * @param {string | symbol} channel
     * @param {any[]} args
     */
    emit(channel, ...args) {
        if (this.subscriptions[channel]) {
            this.subscriptions[channel].forEach((sub) => {
                if (sub) {
                    sub.listener.call(sub.context, ...args);
                }
            });
        }
    }
}
