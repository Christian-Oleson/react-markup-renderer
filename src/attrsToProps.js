import cssToStyle from 'css-to-style';
import standardProps from './constants/standardProps';
import reactProps from './constants/reactProps';
import booleanAttrs from './constants/booleanAttrs';
import unsafeUrlAttrs from './constants/unsafeUrlAttrs';

// Matches the javascript:/vbscript: URI schemes. Tabs, newlines and
// carriage returns are stripped first, wherever they occur in the value
// (not just leading whitespace), since browsers ignore them when
// resolving a URL scheme—a common sanitizer-bypass technique, e.g.
// "java\tscript:".
const UNSAFE_URI_SCHEME = /^\s*(?:javascript|vbscript):/i;
const isUnsafeUri = (value) =>
  UNSAFE_URI_SCHEME.test(value.replace(/[\t\n\r]/g, ''));

const attrsToProps = (attrs) => {
  const props = {};
  for (let i = 0; i < attrs.length; i++) {
    const { name, value } = attrs[i];
    // Disallow event attributes and react props.
    if (name.startsWith('on') || reactProps.has(name)) {
      continue;
    }
    // Disallow `srcdoc`—an iframe’s srcdoc runs with the parent’s origin
    // and would bypass the <script> element/event attribute restrictions.
    if (name === 'srcdoc') {
      continue;
    }
    // Disallow javascript:/vbscript: URIs in URL attributes.
    if (unsafeUrlAttrs.has(name) && isUnsafeUri(value)) {
      continue;
    }
    // Don't modify aria-* or data-* attributes.
    if (name.startsWith('aria-') || name.startsWith('data-')) {
      props[name] = value;
      continue;
    }
    // Handle style attribute.
    if (name === 'style') {
      props[name] = cssToStyle(value);
      continue;
    }
    props[standardProps.get(name) ?? name] =
      value === '' && booleanAttrs.has(name) ? true : value;
  }
  return props;
};

export default attrsToProps;
