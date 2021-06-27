const assign = Object.assign;
const getPrototypeOf = Object.getPrototypeOf;
const setPrototypeOf = Object.setPrototypeOf;

/**
 * @param {Object} props
 * @param {Function} props.constructor
 * @param {Function} Base
 */
export default function Klass(props, Base) {
  return function (...args) {
    assign(this, props);

    if (Base) {
      this.Super = function (...baseArgs) {
        this.super = new Base(...baseArgs);
        setPrototypeOf(getPrototypeOf(this), this.super);
      };
    }

    if (props.hasOwnProperty("constructor")) {
      props.constructor.call(this, ...args);
    } else {
      this.Super && this.Super();
    }
  };
}
