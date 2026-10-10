import test from 'node:test';
import assert from 'node:assert/strict';
import { anchorSuggestions, articleAnchorSuggestions } from '../resources/js/core/articleAnchors.js';

const element = (localName, attributes) => ({ localName, getAttribute: key => attributes[key] ?? null, hasAttribute: key => key in attributes });
const nodes = [element('a', { id: 'intro' }), element('a', { name: 'legacy' }), element('div', { id: 'css-hook' }),
  element('a', { id: 'external-link', href: '/page' }), element('a', { id: 'intro', name: 'legacy' }), element('a', { id: '' })];
const content = { querySelectorAll(selector) { return nodes.filter(node => selector.startsWith('[id]') || node.localName === 'a' && (node.hasAttribute('name') || node.hasAttribute('id') && !node.hasAttribute('href'))); } };

test('anchor-only suggestions exclude CSS IDs and hyperlinks, preserve legacy names and deduplicate', () => {
  assert.deepEqual(anchorSuggestions(content, 'anchors'), ['intro', 'legacy']);
  assert.deepEqual(anchorSuggestions(content, 'all'), ['intro', 'legacy', 'css-hook', 'external-link']);
  assert.deepEqual(anchorSuggestions(content), []);
  assert.deepEqual(anchorSuggestions(content, 'unknown'), []);
});

test('article suggestions use live Joomla editor content on each opening and fall back to textarea', () => {
  const previous = globalThis.document;
  let parsed;
  globalThis.document = { createElement(type) { assert.equal(type, 'template'); return { set innerHTML(html) { parsed = html; }, content }; } };
  const field = { id: 'article-editor', value: 'stored' };
  const form = { elements: { namedItem(name) { assert.equal(name, 'jform[articletext]'); return field; } } };
  let html = 'unsaved';
  try {
    const editors = { 'article-editor': { getValue: () => html } };
    assert.deepEqual(articleAnchorSuggestions(form, 'anchors', editors), ['intro', 'legacy']);
    assert.equal(parsed, 'unsaved');
    html = 'changed again'; articleAnchorSuggestions(form, 'anchors', editors); assert.equal(parsed, html);
    articleAnchorSuggestions(form, 'all', {}); assert.equal(parsed, 'stored');
    assert.deepEqual(articleAnchorSuggestions(null, 'anchors', {}), []);
    assert.deepEqual(articleAnchorSuggestions(form, 'none', editors), []);
    assert.deepEqual(articleAnchorSuggestions(form, 'anchors', { 'article-editor': { getValue() { throw Error('unavailable'); } } }), []);
  } finally { globalThis.document = previous; }
});
