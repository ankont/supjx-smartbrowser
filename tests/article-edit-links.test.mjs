import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('native article links use the shared popup without intercepting unrelated or modified clicks', () => {
  const listeners = {};
  const opened = [];
  class MediaActionDriver { openEditor(url) { opened.push(url); } }
  const source = readFileSync('resources/js/article-edit-links.js', 'utf8').replace(/^import .*;\s*/, '');
  vm.runInNewContext(source, { MediaActionDriver, URL, Joomla: { Text: { _: key => key } },
    document: { addEventListener: (name, fn) => { listeners[name] = fn; } },
    window: { location: { href: 'https://example.test/library.html', origin: 'https://example.test' }, addEventListener() {} } });
  const click = (href, overrides = {}) => {
    let prevented = false;
    const link = { href, hasAttribute: () => false };
    listeners.click({ button: 0, target: { closest: () => link }, preventDefault: () => { prevented = true; }, ...overrides });
    return prevented;
  };
  assert.equal(click('https://example.test/article.html?task=article.edit&a_id=69'), true);
  assert.equal(new URL(opened[0]).searchParams.get('tmpl'), 'component');
  for (const href of ['https://evil.test/?task=article.edit', 'https://example.test/?task=article.edit&sbNative=1', 'https://example.test/?option=com_users&task=article.edit', 'https://example.test/?task=article.save']) assert.equal(click(href), false);
  assert.equal(click('https://example.test/?task=article.edit', { ctrlKey: true }), false);
  assert.equal(opened.length, 1);
});
