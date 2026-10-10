import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('local editor decodes translations as text and keeps caller suggestions editable', () => {
  const driver = readFileSync('resources/js/adapters/MediaActionDriver.js', 'utf8');
  assert.match(driver, /decoder\.innerHTML = this\.translate\(key\); return decoder\.value/);
  assert.match(driver, /save\.textContent = text\('JTOOLBAR_SAVE'\)/);
  assert.match(driver, /createElement\('datalist'\)/);
  assert.match(driver, /editorContext\?\.suggestions/);
  assert.match(driver, /field\.dependsOn/);
  assert.match(driver, /field\.warningPattern/);
  assert.match(driver, /field\.placeholderFrom/);
  assert.match(driver, /computedPlaceholder/);
  assert.match(driver, /this\.api\.execute\(definition\.action, \[\], payload\)/);
  assert.doesNotMatch(driver, /window\.(?:confirm|prompt)\(/);
  assert.match(driver, /field\.type === 'segmented'/);
  assert.match(driver, /button\.setAttribute\('aria-pressed'/);
  const css = readFileSync('package/component/media/css/smartbrowser.css', 'utf8');
  assert.match(css, /dialog\.smartbrowser-editor\.smartbrowser-local-editor \{[^}]*height: fit-content !important;[^}]*max-height: calc\(100dvh - 32px\)[^}]*overflow: auto/);
});

test('Picker transports generic adapter configuration and per-instance editor context', () => {
  const picker = readFileSync('package/component/media/js/picker.js', 'utf8');
  const api = readFileSync('resources/js/services/ResourceApi.js', 'utf8');
  assert.match(picker, /adapterOptions: JSON\.stringify\(config\.adapterOptions/);
  assert.match(picker, /selectionEditorContext: config\.selectionEditorContext/);
  assert.equal((api.match(/url\.searchParams\.set\('adapterOptions'/g) || []).length, 2);
});
