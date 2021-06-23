export default function put(o, path, v) {
  if (o instanceof Object) {
    const paths = path.toString().match(/[^\.\[\]\'\"]+/g);
    if (paths) {
      let t = o;
      paths.forEach((key, idx) => {
        if (idx == paths.length - 1) {
          t[key] = v;
        } else {
          if (!(t[key] instanceof Object)) {
            t[key] = {};
          }
          t = t[key];
        }
      });
      return o;
    }
  }
  return null;
}
