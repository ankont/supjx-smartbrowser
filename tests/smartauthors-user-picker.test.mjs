import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('SmartAuthors picker targets only its owner and contributor user fields', async () => {
  const script = await readFile(new URL('../package/component/media/js/smartauthors-user-field.js', import.meta.url), 'utf8');
  const plugin = await readFile(new URL('../package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', import.meta.url), 'utf8');
  assert.match(script, /name\.includes\('\[smartauthors\]'\)/);
  assert.match(script, /name\.endsWith\('\[owner_id\]'\)/);
  assert.match(script, /name\.includes\('\[contributors\]'\) && name\.endsWith\('\[user_id\]'\)/);
  assert.match(script, /allowedResourceTypes: \['user'\]/);
  assert.match(script, /field\.setValue\(id, user\.title\)/);
  assert.match(script, /allowNoUser: !field\.querySelector\('\.field-user-input-name'\)\?\.required/);
  assert.match(plugin, /PluginHelper::isEnabled\('system', 'smartauthors'\)/);
});

test('optional user picker can select no user without affecting required contributors', async () => {
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const picker = await readFile(new URL('../package/component/media/js/picker.js', import.meta.url), 'utf8');
  assert.match(actions, /v-if="allowNoUser"[\s\S]*JOPTION_NO_USER/);
  assert.match(app, /@no-user="completeSelection\(\[\{ id: 'user:0', type: 'user', title: '' \}\]\)"/);
  assert.match(picker, /allowNoUser: config\.allowNoUser \? '1' : '0'/);
});
