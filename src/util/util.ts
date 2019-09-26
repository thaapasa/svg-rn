export function flatten<T>(arr: T[][]): T[] {
  const res: T[] = [];
  arr.forEach(list => list.forEach(i => res.push(i)));
  return res;
}

export function pairsToObject<T>(pairs: Array<[string, T]>): Record<string, T> {
  const res: Record<string, T> = {};
  pairs.forEach(p => (res[p[0]] = p[1]));
  return res;
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}
