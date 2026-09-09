import { expect, test } from 'vitest';
import attrsToProps from '../attrsToProps';

test('converts attributes to props', () => {
  const attrs = [
    { name: 'class', value: 'foo bar' },
    { name: 'id', value: 'baz' },
  ];
  expect(attrsToProps(attrs)).toEqual({
    className: 'foo bar',
    id: 'baz',
  });
});

test('handles aria and data attributes', () => {
  const attrs = [
    { name: 'aria-role', value: 'presentation' },
    { name: 'data-class', value: 'foo' },
  ];
  expect(attrsToProps(attrs)).toEqual({
    'aria-role': 'presentation',
    'data-class': 'foo',
  });
});

test('handles style attribute', () => {
  const attrs = [{ name: 'style', value: 'color: red; float: left' }];
  expect(attrsToProps(attrs)).toEqual({
    style: {
      color: 'red',
      cssFloat: 'left',
    },
  });
});

test('handles boolean attributes', () => {
  const attrs = [
    { name: 'checked', value: '' },
    { name: 'readonly', value: '' },
  ];
  expect(attrsToProps(attrs)).toEqual({
    checked: true,
    readOnly: true,
  });
});

test('doesn’t coerce empty non-boolean attributes to true', () => {
  const attrs = [
    { name: 'alt', value: '' },
    { name: 'title', value: '' },
    { name: 'class', value: '' },
  ];
  expect(attrsToProps(attrs)).toEqual({
    alt: '',
    title: '',
    className: '',
  });
});

test('strips javascript:/vbscript: URIs from URL attributes', () => {
  const attrs = [
    { name: 'href', value: 'javascript:alert(1)' },
    { name: 'src', value: 'JAVASCRIPT:alert(1)' },
    { name: 'action', value: 'vbscript:msgbox(1)' },
    { name: 'formaction', value: ' \tjavascript:alert(1)' },
    { name: 'xlink:href', value: 'java\tscript:alert(1)' },
  ];
  expect(attrsToProps(attrs)).toEqual({});
});

test('keeps safe URIs in URL attributes', () => {
  const attrs = [
    { name: 'href', value: 'https://example.com' },
    { name: 'src', value: 'data:image/png;base64,AAAA' },
  ];
  expect(attrsToProps(attrs)).toEqual({
    href: 'https://example.com',
    src: 'data:image/png;base64,AAAA',
  });
});

test('strips srcdoc attribute', () => {
  const attrs = [{ name: 'srcdoc', value: '<script>alert(1)</script>' }];
  expect(attrsToProps(attrs)).toEqual({});
});

test('filters react props', () => {
  const attrs = [
    { name: 'children', value: 'foo' },
    { name: 'key', value: 'bar' },
    { name: 'ref', value: 'baz' },
  ];
  expect(attrsToProps(attrs)).toEqual({});
});

test('filters event attributes', () => {
  const attrs = [
    { name: 'onclick', value: 'void 0' },
    { name: 'onError', value: 'alert("xss")' },
  ];
  expect(attrsToProps(attrs)).toEqual({});
});
