import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

test('options toolbar is scoped and Direct Links share configured node/item icons', () => {
  assert.match(execFileSync('php', ['tests/options-integration.php'], { encoding: 'utf8' }), /icons OK/);
});

test('all option help uses native inline help and integrations have independent translated groups', () => {
  const xml = readFileSync('package/component/admin/config.xml', 'utf8');
  assert.match(xml, /<inlinehelp button="show"/);
  assert.doesNotMatch(xml, /name="icons_hint"/);
  assert.match(xml, /name="icon_profiles"[^>]*label="COM_SMARTBROWSER_CUSTOMIZE_ICONS"/);
  for (const field of xml.matchAll(/<field\b[^>]*>/g)) {
    assert.match(field[0], /description="/);
    if (/type="note"/.test(field[0]) && !/name="(?:context_(?:site_)?hint|integration_hint)"/.test(field[0])) assert.match(field[0], /hide-aware-inline-help d-none/);
  }
  for (const locale of ['en-GB', 'el-GR']) {
    const language = readFileSync(`package/component/admin/language/${locale}/com_smartbrowser.ini`, 'utf8');
    for (const [, key] of xml.matchAll(/(?:description|label)="(COM_SMARTBROWSER_[^"]+)"/g)) {
      assert.ok(language.includes(`${key}=`), `${locale}: ${key}`);
    }
  }
  for (const kind of ['media', 'articles', 'menus']) assert.match(xml, new RegExp(`name="replace_editor_${kind}"[^>]*default="0"`));
  assert.match(xml, /name="replace_all"/);
  assert.doesNotMatch(xml, /value="inherit"/);
  assert.doesNotMatch(xml, /JENABLED|JDISABLED/);
  const css = readFileSync('package/component/media/css/smartbrowser.css', 'utf8');
  assert.match(css, /legend\.sb-integration-legend \.switcher \{[^}]*display: inline-block;[^}]*height: 28px;/);
  assert.match(xml, /name="context"[^>]*description="COM_SMARTBROWSER_RESET_PREFERENCES_DESC"/);
  assert.match(xml, /name="context_site"[^>]*description="COM_SMARTBROWSER_OPTIONS_CONTEXT_DESC"/);
  assert.ok(xml.indexOf('name="context_site"') < xml.indexOf('name="context_admin"'));
  assert.ok(xml.indexOf('name="preferences_reset_token"') < xml.indexOf('name="context_admin"'));
});
