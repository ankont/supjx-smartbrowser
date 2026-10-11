import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('native User passwords are cleared before display, including failed-save rebinding', () => {
  const service = readFileSync('package/component/site/src/Service/FrontendEditorService.php', 'utf8');
  const view = readFileSync('package/component/site/src/View/Editor/HtmlView.php', 'utf8');
  assert.match(service, /if \(\$type === 'user'\) \{[^}]*setValue\('password', null, ''\);[^}]*setValue\('password2', null, ''\);[^}]*\}\s*return \$form;/s);
  assert.ok(view.indexOf("setValue('password', null, '')") > view.indexOf("bind($failure['data'])"));
  assert.match(view, /resourceType === 'user'[\s\S]*setValue\('password2', null, ''\)/);
});

test('image selectors retain their native labels and share the original controls column', () => {
  const css = readFileSync('package/component/media/css/smartbrowser.css', 'utf8');
  assert.doesNotMatch(css, /\.sb-article-image-field > \.control-label/);
  const bridge = readFileSync('resources/js/article-media.js', 'utf8');
  assert.match(bridge, /closest\('\.controls'\)[\s\S]*controls\.append\(root\)/);
});
