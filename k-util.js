export function isInt(v) {
  return Number.isInteger(v)
}

export function toInt(v) {
  return parseInt(v, 10) || 0
}

export function isString(v) {
  return typeof v === 'string'
}

export function toString(v) {
  return v ? '' + v : ''
}

export function isObject(v) {
  return v instanceof Object
}

export function isArray(v) {
  return v instanceof Array
}

export function toArray(v) {
  return v ? Array.prototype.slice.call(v) : []
}

export function isFunction(v) {
  return typeof v === 'function'
}

export function isNull(v) {
  return v == null
}

export function isJSON(s) {
  try {
    JSON.parse(s)
    return true
  } catch (e) {
    return false
  }
}

export function assign() {
  const t = arguments[0]
  for (let i = 1, len = arguments.length; i < len; i++) {
    const o = arguments[i]
    for (let j in o) {
      if (o.hasOwnProperty(j)) {
        t[j] = o[j]
      }
    }
  }
  return t
}

export function getRandomStr() {
  return (1e32 * Math.random()).toString(36).slice(0, 16)
}
