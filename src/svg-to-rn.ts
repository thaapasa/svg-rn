import * as xmljs from 'xml-js';
import { wrapAsJsx } from './output';
import { fixSvgForRN } from './fix-svg';
import { logError } from './util/logger';
import { ConversionOptions } from './options';

function retrieveElementNames(el: xmljs.Element, rec: Record<string, null>) {
  if (el.name) {
    rec[el.name] = null;
  }
  if (el.elements) {
    el.elements.forEach(e => retrieveElementNames(e, rec));
  }
}

function findElementNames(el: xmljs.Element): string[] {
  const res: Record<string, null> = {};
  retrieveElementNames(el, res);
  const names = Object.keys(res);
  return names.sort();
}

export function svgToReactNative(src: string, options: ConversionOptions = {}): string {
  try {
    const xml: xmljs.Element = xmljs.xml2js(src, {
      compact: false,
    }) as xmljs.Element;
    const svg = xml.elements && xml.elements.find(e => e.name === 'svg');
    if (!svg) {
      return 'Error: No SVG element found';
    }

    delete xml.declaration;

    const result = {
      ...xml,
      elements: [fixSvgForRN(svg, options)],
    };
    const els = findElementNames(result.elements[0]);
    const rnXML = xmljs.js2xml(result, { compact: false, spaces: 2 });
    return wrapAsJsx(rnXML, els);
  } catch (e) {
    logError('Error when fixing XML:', e);
    return 'Invalid SVG';
  }
}
