import * as xmljs from 'xml-js';
import { hyphenCaseToCamelCase, toUpperCaseFirst } from './util/strings';
import { flatten, pairsToObject } from './util/util';
import { ConversionOptions } from './options';

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

const removePrefixes = (attrs: xmljs.Attributes): xmljs.Attributes => {
  const results = { ...attrs };
  Object.keys(attrs).forEach(k => {
    const parts = k.split(':');
    if (parts.length > 1) {
      delete results[k];
      results[parts[parts.length - 1]] = attrs[k];
    }
  });
  return results;
};

function removeIdAttributes(attrs: xmljs.Attributes): xmljs.Attributes {
  const copy = { ...attrs };
  delete copy.id;
  return copy;
}

function fixAttributes(attrs: xmljs.Attributes, options: ConversionOptions): xmljs.Attributes {
  let processed = renameAttributeKeys(
    removePrefixes(expandStyleAttribute(removeExtraAttrs(attrs))),
  );
  if (options.removeIds) {
    processed = removeIdAttributes(processed);
  }
  return processed;
}

function fixElement(element: xmljs.Element, options: ConversionOptions): xmljs.Element {
  return {
    ...element,
    name: toUpperCaseFirst(element.name || ''),
    elements: element.elements && element.elements.map(e => fixElement(e, options)),
    attributes: element.attributes && fixAttributes(element.attributes, options),
  };
}

export function fixSvgForRN(svg: xmljs.Element, options: ConversionOptions): xmljs.Element {
  const attrs = svg.attributes;
  return fixElement(
    {
      ...svg,
      elements: svg.elements
        ? svg.elements
            .filter(e => e.name !== 'title' && e.name !== 'desc')
            .map(e => fixElement(e, options))
        : undefined,
      attributes: attrs
        ? { width: attrs.width, height: attrs.height, viewBox: attrs.viewBox }
        : undefined,
    },
    options,
  );
}
