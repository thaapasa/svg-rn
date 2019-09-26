export function toUpperCase(value: string): string {
  return typeof value === 'string' ? value.toUpperCase() : '';
}

export function toLowerCase(value: string): string {
  return typeof value === 'string' ? value.toLowerCase() : '';
}

export function toUpperCaseFirst(value: string): string {
  return value && value.length > 0 ? toUpperCase(value[0]) + value.slice(1) : value;
}

export function hyphenCaseToCamelCase(value: string): string {
  if (!value) {
    return value;
  }
  const pairs = value.split('-');
  return [pairs[0], ...pairs.slice(1).map(toUpperCaseFirst)].join('');
}

export function hyphenCaseToPascalCase(value: string): string {
  if (!value) {
    return value;
  }
  const pairs = value.split('-');
  return pairs.map(toUpperCaseFirst).join('');
}
