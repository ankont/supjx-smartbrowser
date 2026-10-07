import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

test('failed menu state action displays the server error', async () => {
  const previousJoomla = globalThis.Joomla;
  const messages = [];
  globalThis.Joomla = { renderMessages: (message) => messages.push(message) };
  try {
    const driver = new MediaActionDriver(
      { execute: async () => { throw new Error('Cannot unpublish the default home item'); } },
      {},
      async () => {},
      (key) => key,
    );
    await driver.execute({ id: 'unpublish', requiresSelection: true }, [{ id: 'menu-item:5', capabilities: { unpublish: true } }]);
    assert.deepEqual(messages, [{ error: ['Cannot unpublish the default home item'] }]);
  } finally {
    globalThis.Joomla = previousJoomla;
  }
});

test('menu home status is visible and the protected default home returns an error', async () => {
  const source = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  assert.match(source, /\$overlays\[\] = \[\s*'id' => 'home', 'icon' => 'fas fa-home'/);
  assert.match(source, /'image' => \$this->languageImage\(\(string\) \$item->language\)/);
  assert.match(source, /'source' => 'metadata\.homeLabel'/);
  assert.match(source, /COM_SMARTBROWSER_ERROR_MENU_DEFAULT_HOME/);
});
