// Attributes whose value is a URL that browsers will navigate to or load,
// where a `javascript:`/`vbscript:` scheme would execute attacker-controlled
// script (bypassing the disallowed event attributes and <script> elements).
export default new Set([
  'action',
  'cite',
  'formaction',
  'href',
  'poster',
  'src',
  'xlink:href',
]);
