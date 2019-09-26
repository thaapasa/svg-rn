function toLogStr(x: any): string {
  return typeof x === 'string' ? x : JSON.stringify(x, null, 2);
}

export function log(...msg: any[]) {
  const message = msg.map(toLogStr).join(' ');
  process.stderr.write(message + '\n');
}
