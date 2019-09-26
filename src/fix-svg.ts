import * as xmljs from 'xml-js';
import { hyphenCaseToCamelCase, toUpperCaseFirst } from './util/strings';
import { flatten, pairsToObject } from './util/util';

type AttributeValue = string | number | undefined;

const attributesToRemove = ['serif:id'];

const removeExtraAttrs = (attrs: xmljs.Attributes): xmljs.Attributes => {
  const copy = { ...attrs };
  attributesToRemove.forEach(a => delete copy[a]);
  return copy;
};

const renameAttributeKeys = (attrs: xmljs.Attributes): xmljs.Attributes =>
  pairsToObject(
    Object.keys(attrs).map<[string, AttributeValue]>(k => [hyphenCaseToCamelCase(k), attrs[k]]),
  );

const expandStyleValue = (value?: string | number): xmljs.Attributes =>
  value && typeof value === 'string'
    ? pairsToObject(
        flatten(
          value
            .split(';')
            .map<Array<[string, string]>>(d =>
              d.indexOf(':') > 0 ? [d.split(':', 2) as [string, string]] : [],
            ),
        ),
      )
    : {};

const expandStyleAttribute = (attrs: xmljs.Attributes): xmljs.Attributes => {
  const { style, ...rest } = attrs;
  return { ...rest, ...expandStyleValue(style) };
};

function fixAttributes(attrs: xmljs.Attributes): xmljs.Attributes {
  return renameAttributeKeys(expandStyleAttribute(removeExtraAttrs(attrs)));
}

function fixElement(element: xmljs.Element): xmljs.Element {
  return {
    ...element,
    name: toUpperCaseFirst(element.name || ''),
    elements: element.elements && element.elements.map(fixElement),
    attributes: element.attributes && fixAttributes(element.attributes),
  };
}

export function fixSvgForRN(svg: xmljs.Element): xmljs.Element {
  const attrs = svg.attributes;
  return fixElement({
    ...svg,
    elements: svg.elements
      ? svg.elements.filter(e => e.name !== 'title' && e.name !== 'desc').map(fixElement)
      : undefined,
    attributes: attrs
      ? { width: attrs.width, height: attrs.height, viewBox: attrs.viewBox }
      : undefined,
  });
}
