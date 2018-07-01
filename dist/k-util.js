"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInt(v) {
    return typeof v == 'number' && (v | 0) == v;
}
exports.isInt = isInt;
function isString(v) {
    return typeof v == 'string';
}
exports.isString = isString;
function isFunction(v) {
    return typeof v == 'function';
}
exports.isFunction = isFunction;
function isArray(v) {
    return v instanceof Array;
}
exports.isArray = isArray;
function isObject(v) {
    return v instanceof Object;
}
exports.isObject = isObject;
function isNull(v) {
    return v == null;
}
exports.isNull = isNull;
function isJSON(v) {
    try {
        return typeof JSON.parse(v) == 'object';
    }
    catch (e) {
        return false;
    }
}
exports.isJSON = isJSON;
function toArray(v) {
    return Array.prototype.slice.call(v);
}
exports.toArray = toArray;
function get(o, path) {
    if (typeof o == 'string' || o instanceof Object) {
        var paths = path.match(/[^\.\[\]\'\"]+/gi);
        if (paths) {
            paths[0] = o[paths[0]];
            return paths.reduce(function (result, key) { return (result ? result[key] : null); });
        }
    }
    return null;
}
exports.get = get;
function last(a) {
    return a[a.length - 1];
}
exports.last = last;
function each(o, f) {
    if (!(o instanceof Object))
        return;
    if (o.length) {
        for (var i = 0; i < o.length; i++) {
            f(o[i], i);
        }
    }
    else {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                f(o[i], i);
            }
        }
    }
}
exports.each = each;
//# sourceMappingURL=k-util.js.map