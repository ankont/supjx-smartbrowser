import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('native article preview maximizes without replacing its iframe or affecting other dialogs', () => {
  const source = readFileSync('package/component/media/js/editor-fields.js', 'utf8');
  const view = readFileSync('package/component/site/src/View/Editor/HtmlView.php', 'utf8');
  assert.match(view, /->popupType\('iframe'\)->modalWidth\('90vw'\)->modalHeight\('90vh'\)/,
    'Preview must explicitly use Joomla Dialog instead of the legacy Bootstrap fallback');
  const start = source.indexOf("    document.addEventListener('joomla-dialog:open'");
  const end = source.indexOf('    const submitbutton', start);
  let opened, clicked, inserted;
  const classes = new Set();
  const button = { setAttribute() {}, addEventListener: (_, fn) => { clicked = fn; } };
  vm.runInNewContext(source.slice(start, end), {
    document: { addEventListener: (_, fn) => { opened = fn; }, createElement: () => button },
    Joomla: { Text: { _: key => key } },
  });
  opened({ target: {} });
  assert.equal(inserted, undefined);
  const popup = {
    JoomlaDialogTrigger: { closest: selector => selector === '#toolbar-preview' },
    classList: { contains: value => classes.has(value), add: value => classes.add(value), toggle: value => classes.has(value) ? classes.delete(value) : classes.add(value) },
    querySelector: () => ({ before: element => { inserted = element; } }),
  };
  opened({ target: popup });
  assert.equal(inserted, button);
  assert.equal(button.title, 'COM_SMARTBROWSER_EDITOR_MAXIMIZE');
  clicked();
  assert.equal(button.title, 'COM_SMARTBROWSER_EDITOR_RESTORE');
  clicked();
  assert.equal(classes.has('is-maximized'), false);
  const css = readFileSync('package/component/media/css/editor.css', 'utf8');
  assert.match(css, /joomla-dialog\.sb-article-preview \.iframe-content\s*\{[^}]*height: 100% !important/s);
  assert.match(css, /dialog::backdrop\s*\{[^}]*backdrop-filter: blur\(4px\)/s);
  assert.match(css, /html:has\(joomla-dialog\.sb-article-preview\.is-maximized > dialog\[open\]\) body\s*\{\s*overflow: hidden !important/s);
});
