export function wrapAsJsx(svg: string, elements: string[]): string {
  return `import React from 'react';
import { ${elements.join(', ')} } from 'react-native-svg';

export const SvgImage = () => (
  ${svg.split('\n').join('\n  ')}
);
`;
}
