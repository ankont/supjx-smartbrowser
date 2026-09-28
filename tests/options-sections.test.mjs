import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('component Options group editors then reset in one display tab', async () => {
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  const tab = config.match(/<fieldset name="preferences"[^>]*>([\s\S]*?)<\/fieldset>\s*<fieldset name="context"/);
  assert.ok(tab);
  assert.ok(tab[1].indexOf('name="preferences_editors"') < tab[1].indexOf('name="preferences_display"'));
  for (const name of ['editor_admin', 'editor_site', 'preferences_reset_token']) {
    assert.equal((config.match(new RegExp(`name="${name}"`, 'g')) || []).length, 1);
  }
  assert.ok(config.indexOf('name="preferences"') < config.indexOf('name="context"'));
  assert.ok(config.indexOf('name="context"') < config.indexOf('name="integration"'));
  assert.ok(config.indexOf('name="integration"') < config.indexOf('name="permissions"'));
});
