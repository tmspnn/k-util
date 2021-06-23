export default function at(o, path) {
  if (o instanceof Object) {
    const paths = path.toString().match(/[^\.\[\]\'\"]+/g);
    if (paths) {
      paths[0] = o[paths[0]];
      return paths.reduce((result, key) =>
        result instanceof Object ? result[key] : null
      );
    }
  }
  return null;
}
