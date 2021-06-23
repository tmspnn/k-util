export default function each(o, f) {
  if (o.length) {
    for (let i = 0; i < o.length; ++i) {
      f(o[i], i);
    }
  } else {
    for (let i in o) {
      if (o.hasOwnProperty(i)) {
        f(o[i], i);
      }
    }
  }
}
