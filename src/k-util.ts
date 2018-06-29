export function isInt(v: any): boolean {
  return typeof v == 'number' && (v | 0) == v;
}

export function isString(v: any) {}
