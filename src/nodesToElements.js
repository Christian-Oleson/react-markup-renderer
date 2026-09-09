import * as React from 'react';
import { ELEMENT_NODE, TEXT_NODE } from './constants/nodeTypes';
import attrsToProps from './attrsToProps';
import getDisplayName from './getDisplayName';
import nodeNameToType from './nodeNameToType';

// Never rendered: <script> can run arbitrary code, and <base> can
// hijack every relative URL/resource on the page from wherever it
// appears in the document, not just inside <head>.
const NEVER_RENDER = new Set(['base', 'script']);

const nodesToElements = (nodeList, options) => {
  // Normalize an array `allowed` option to a Set once—options is the
  // same object shared across this recursive walk—instead of doing an
  // O(n) `.includes()` scan for every element at every depth.
  if (Array.isArray(options.allowed)) {
    options.allowed = new Set(options.allowed);
  }
  const tree = [];
  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    // Only render element nodes and text nodes.
    if (node.nodeType === ELEMENT_NODE) {
      let type = nodeNameToType(node.nodeName);
      if (
        // Never render <script> or <base> elements.
        NEVER_RENDER.has(type) ||
        // Handle allowed option to only render elements that are allowed.
        (options.allowed &&
          (typeof options.allowed === 'function'
            ? !options.allowed(node)
            : !options.allowed.has(type)))
      ) {
        continue;
      }
      // Handle replace option.
      if (options.replace) {
        const replacement =
          typeof options.replace === 'function'
            ? options.replace(node)
            : Object.hasOwn(options.replace, type)
              ? options.replace[type]
              : undefined;
        // Don't render element if replacement is false or null.
        if (replacement === false || replacement === null) {
          continue;
        }
        // Replace element replacement—if not undefined.
        if (replacement !== undefined) {
          type = replacement;
        }
      }
      const props = attrsToProps(node.attributes);
      props.key = `${getDisplayName(type)}-${i}`;
      const children = nodesToElements(node.childNodes, options);
      tree.push(
        React.isValidElement(type)
          ? React.cloneElement(type, props, children)
          : React.createElement(type, props, children),
      );
    } else if (node.nodeType === TEXT_NODE) {
      // Handle trim option to remove whitespace text nodes.
      if (!options.trim || node.textContent.trim() !== '') {
        tree.push(node.textContent);
      }
    }
  }
  return tree.length > 0 ? tree : null;
};

export default nodesToElements;
