import Klass from "./Klass";

const Ee = Klass({
  /**
   * @property {Array} subscriptions.*
   * @property {Function} subscriptions.*[*].listener
   * @property {*} subscriptions.*[*].context
   */
  subscriptions: {},

  on(channel, listener, context) {
    const sub = { listener, context };
    if (this.subscriptions[channel]) {
      this.subscriptions[channel].push(sub);
    } else {
      this.subscriptions[channel] = [sub];
    }
  },

  off(channel, listener, context) {
    if (!this.subscriptions[channel]) return;
    if (listener) {
      this.subscriptions[channel].forEach((sub, i) => {
        if (sub && sub.listener == listener && sub.context == context) {
          this.subscriptions[channel][i] = null;
        }
      });
    } else {
      this.subscriptions[channel] = null;
    }
  },

  emit(channel, ...args) {
    if (this.subscriptions[channel]) {
      this.subscriptions[channel].forEach((sub) => {
        sub && sub.listener.call(sub.context, ...args);
      });
    }
  }
});

export default Ee;
