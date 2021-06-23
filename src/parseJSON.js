export default function parseJSON(v) {
  try {
    return JSON.parse(v);
  } catch (e) {
    return null;
  }
}
