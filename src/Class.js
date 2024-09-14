/**
 * @typedef {(initialValues?: Record<string, any>) => typeof initialValues & {
 *   _isCustomClass: true,
 *   _implementedInterfaces: Record<string, any>,
 *   static: (props: Record<string, any>) => CustomClass,
 *   inherit: (Base: CustomClass) => CustomClass,
 *   implement: (...interfaces: Record<string, any>[]) => CustomClass
 * }} CustomClass
 */

/**
 * @param {Record<string, any>} proto
 * @returns {CustomClass}
 */
export default function Class(proto = {}) {
    function C(initialValues = {}) {
        copyAndBind(this, proto);

        C._implementedInterfaces.forEach((i) => copyAndBind(this, i));

        copyAndBind(this, initialValues);
    }

    Object.assign(C.prototype, proto);

    C._isCustomClass = true;

    C._implementedInterfaces = [];

    /**
     * @param {Record<string, any>} o
     */
    C.static = function(o) { return Object.assign(C, o); };

    /**
     * @param {CustomClass} B
     */
    C.inherit = function(B) {
        if (!B._isCustomClass) {
            throw new TypeError("CustomClass.inherit requires a custom class, but received: " + String(B));
        }

        Object.setPrototypeOf(C.prototype, B.prototype);

        return C;
    };

    /**
     * @param {Record<string, any>} ...interfaces
     */
    C.implement = function(...interfaces) {
        C._implementedInterfaces = interfaces;

        return C;
    };

    return C;
}

/**
 * @param {Record<string, any>} target
 * @param {Record<string, any>} source
 * @param {Record<string, any>} [thisArg]
 * @returns {void}
 */
function copyAndBind(target, source, thisArg) {
    const self = thisArg || target;

    Object.keys(source).forEach((k) => {
        const v = source[k];

        const t = typeof v;

        if (v == null || t == "number" || t == "string" || t == "boolean" || t == "symbol") {
            target[k] = v;
        } else if (typeof v == "function") {
            target[k] = v.bind(self);
        } else {
            target[k] = {};
            copyAndBind(target[k], v, self);
        }
    });
}
