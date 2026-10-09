import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture(result) {
  const actions = new Map();
  let config;
  const inserted = [];
  const errors = [];
  const context = { URL, window: { location: { href: 'https://site.test/' }, SmartBrowserPicker: { async open(value) { config = value; return result; } } },
    JoomlaEditorButton: { registerAction: (key, handler) => actions.set(key, handler) },
    Joomla: { getOptions: () => ({ siteUrl: 'https://site.test/', url: 'https://site.test/picker' }), renderMessages: value => errors.push(value) },
    document: { createElement(tag) { return { tag, append() {}, set textContent(value) { this.text = value; }, get outerHTML() { return JSON.stringify({ tag, src: this.src, alt: this.alt, loading: this.loading, href: this.href, text: this.text }); } }; } } };
  const source = fs.readFileSync(new URL('../package/component/media/js/editor-buttons.js', import.meta.url), 'utf8').replace(/^import .*;\r?\n/, '').replace('export async function', 'async function');
  vm.runInNewContext(source, context);
  return { actions, inserted, errors, config: () => config, editor: { replaceSelection: value => inserted.push(JSON.parse(value)) } };
}
test('media editor button requests usages and applies decorative/loading options', async () => {
  const f = fixture({ selection: { id: 'image:1', type: 'image', metadata: { url: '/images/a.jpg' } }, usage: { 'image:1': { 'media.alt': 'Example', 'media.decorative': true, 'media.loading': 'lazy' } } });
  await f.actions.get('smartbrowser-media')(f.editor);
  assert.equal(f.config().resultFormat, 'usage');
  assert.ok(f.config().selectionProfile['visual.thumbnailOverride']);
  assert.equal(f.inserted[0].alt, '');
  assert.equal(f.inserted[0].loading, 'lazy');
});
test('cancel leaves editor unchanged and unsafe URLs are rejected', async () => {
  const cancelled = fixture(null);
  await cancelled.actions.get('smartbrowser-media')(cancelled.editor);
  assert.equal(cancelled.inserted.length, 0);
  const unsafe = fixture({ selection: { id: 'x', type: 'image', metadata: { url: 'javascript:alert(1)' } }, usage: {} });
  await unsafe.actions.get('smartbrowser-media')(unsafe.editor);
  assert.equal(unsafe.inserted.length, 0);
  assert.equal(unsafe.errors.length, 1);
});
test('article button inserts a link from normalized identity', async () => {
  const f = fixture({ id: 'article:42', title: 'Example' });
  await f.actions.get('smartbrowser-article')(f.editor);
  assert.equal(f.inserted[0].href, 'https://site.test/index.php?option=com_content&view=article&id=42');
});
