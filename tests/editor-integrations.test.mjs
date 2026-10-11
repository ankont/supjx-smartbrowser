import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('native editor replacement covers admin and frontend links with safe fallback and navigation boundaries', () => {
  assert.match(execFileSync('php', ['tests/editor-integrations.php'], { encoding: 'utf8' }), /safe returns OK/);
});

test('administrator editors share views, controller and templates instead of duplicating forms', () => {
  for (const path of ['View/Editor/HtmlView.php', 'View/Menutypes/HtmlView.php', 'Controller/EditorController.php']) {
    assert.match(readFileSync(`package/component/admin/src/${path}`, 'utf8'), /extends \\SuperSoft\\Component\\Smartbrowser\\Site\\/);
  }
  assert.match(readFileSync('package/component/admin/tmpl/editor/modal.php', 'utf8'), /require JPATH_SITE/);
  assert.match(readFileSync('package/component/site/tmpl/editor/modal.php', 'utf8'), /sbNative=1/);
});

test('frontend article editor URLs retain native article routing and fallback identity', () => {
  assert.match(execFileSync('php', ['tests/site-article-editor-route.php'], { encoding: 'utf8' }), /fallback OK/);
});

test('Joomla escape hatch is icon-only in the right-hand tools group next to popup sizing', () => {
  const template = readFileSync('package/component/site/tmpl/editor/modal.php', 'utf8');
  assert.match(template, /ms-auto smartbrowser-editor-tools/);
  assert.match(template, /smartbrowser-editor-native[^\n]*title="Joomla" aria-label="Joomla"/);
  assert.doesNotMatch(template, /<\/span> Joomla<\/a>/);
  const driver = readFileSync('resources/js/adapters/MediaActionDriver.js', 'utf8');
  assert.match(driver, /\(tools \|\| toolbar\)\.append\(button\)/);
  assert.match(driver, /destination\.searchParams\.set\('sbReturn', window\.btoa\(window\.location\.href\)\)/);
});
