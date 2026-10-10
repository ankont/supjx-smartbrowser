import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import MediaActionDriver from '../resources/js/adapters/MediaActionDriver.js';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('media upload uses Joomla allowed types and maps native upload errors', async () => {
  const [adapter, controller, support] = await Promise.all([
    source('package/component/admin/src/Adapter/MediaAdapter.php'),
    source('package/component/admin/src/Controller/ApiController.php'),
    source('package/component/admin/src/Support/BrowserViewSupport.php'),
  ]);
  assert.match(adapter, /\$name = \$this->withAllMediaTypes\(fn \(\) => \$this->apiModel->createFile\(/);
  assert.match(adapter, /get\('upload_maxsize', 0\)/);
  assert.match(controller, /\$error instanceof FileExistsException[\s\S]*409/);
  assert.match(controller, /\$error instanceof InvalidPathException[\s\S]*400/);
  assert.match(support, /Text::script\('COM_MEDIA_FILE_EXISTS_AND_OVERRIDE'\)/);
  assert.match(adapter, /withAllMediaTypes\(fn \(\) => \$this->apiModel->delete\(\$adapter, \$path\)\)/);
  assert.match(adapter, /withAllMediaTypes\(fn \(\) => \$this->apiModel->createFile\(\$adapter, \$name, \$parent, \$content, false\)\)/);
  assert.match(controller, /\$language->load\('com_smartbrowser', JPATH_ADMINISTRATOR/);
});

test('action displays a busy state until a slow request completes', async () => {
  const previousJoomla = globalThis.Joomla;
  globalThis.Joomla = { renderMessages: () => {} };
  try {
    let finish;
    const pending = new Promise((resolve) => { finish = resolve; });
    const state = { busy: false };
    const driver = new MediaActionDriver({ execute: () => pending }, state, async () => {}, (key) => key);
    const run = driver.execute({ id: 'publish', requiresSelection: true }, [{ id: 'article:1', capabilities: { publish: true } }]);
    assert.equal(state.busy, true);
    finish({ updated: ['article:1'] });
    await run;
    assert.equal(state.busy, false);
  } finally {
    globalThis.Joomla = previousJoomla;
  }
});

test('existing file prompts for replacement and retries with override', async () => {
  const previousWindow = globalThis.window;
  const previousJoomla = globalThis.Joomla;
  const calls = [];
  const messages = [];
  let reloads = 0;
  globalThis.window = { confirm: (message) => { assert.equal(message, 'photo.jpg already exists. Replace it?'); return true; } };
  globalThis.Joomla = { renderMessages: (message) => messages.push(message) };
  try {
    const api = { execute: async (_action, _selection, payload) => {
      calls.push(payload);
      if (!payload.override) throw Object.assign(new Error('Exists'), { status: 409 });
    } };
    const driver = new MediaActionDriver(api, { selectedNode: 'local-images:/' }, async () => { reloads++; }, (key) => ({
      COM_MEDIA_FILE_EXISTS_AND_OVERRIDE: '%s already exists. Replace it?',
      COM_MEDIA_UPLOAD_SUCCESS: 'Item uploaded.',
    })[key] || key);
    driver.actionDialog = async ({ message }) => window.confirm(message);
    driver.read = async () => 'YQ==';
    await driver.uploadFiles([{ name: 'photo.jpg' }]);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].override, undefined);
    assert.equal(calls[1].override, true);
    assert.equal(reloads, 1);
    assert.deepEqual(messages, [{ success: ['Item uploaded.'] }]);
  } finally {
    globalThis.window = previousWindow;
    globalThis.Joomla = previousJoomla;
  }
});

test('Greek replacement prompt fills Joomla uppercase placeholder', async () => {
  const previousWindow = globalThis.window;
  const previousJoomla = globalThis.Joomla;
  let question = '';
  globalThis.window = { confirm: (value) => { question = value; return false; } };
  globalThis.Joomla = { renderMessages: () => {} };
  try {
    const driver = new MediaActionDriver(
      { execute: async () => { throw Object.assign(new Error('Exists'), { status: 409 }); } },
      { selectedNode: 'local-images:/' },
      async () => {},
      () => 'Το %S υπάρχει ήδη. Θέλετε να αντικατασταθεί;',
    );
    driver.actionDialog = async ({ message }) => window.confirm(message);
    driver.read = async () => 'YQ==';
    await driver.uploadFiles([{ name: 'photo.jpg' }]);
    assert.equal(question, 'Το photo.jpg υπάρχει ήδη. Θέλετε να αντικατασταθεί;');
  } finally {
    globalThis.window = previousWindow;
    globalThis.Joomla = previousJoomla;
  }
});

test('declining replacement leaves the existing file untouched', async () => {
  const previousWindow = globalThis.window;
  const previousJoomla = globalThis.Joomla;
  let calls = 0;
  const messages = [];
  globalThis.window = { confirm: () => false };
  globalThis.Joomla = { renderMessages: (message) => messages.push(message) };
  try {
    const api = { execute: async () => { calls++; throw Object.assign(new Error('Exists'), { status: 409 }); } };
    const driver = new MediaActionDriver(api, { selectedNode: 'local-images:/' }, async () => {}, () => '%s exists');
    driver.actionDialog = async ({ message }) => window.confirm(message);
    driver.read = async () => 'YQ==';
    await driver.uploadFiles([{ name: 'photo.jpg' }]);
    assert.equal(calls, 1);
    assert.deepEqual(messages, []);
  } finally {
    globalThis.window = previousWindow;
    globalThis.Joomla = previousJoomla;
  }
});

test('upload identifies a rejected file and continues with the next one', async () => {
  const previousJoomla = globalThis.Joomla;
  const messages = [];
  let reloads = 0;
  globalThis.Joomla = { renderMessages: (message) => messages.push(message) };
  try {
    const api = { execute: async (_action, _selection, payload) => {
      if (payload.name === 'blocked.pdf') throw Object.assign(new Error('File type is not allowed'), { status: 400 });
    } };
    const driver = new MediaActionDriver(api, { selectedNode: 'local-files:/' }, async () => { reloads++; }, (key) => key);
    driver.read = async () => 'YQ==';
    await driver.uploadFiles([{ name: 'blocked.pdf' }, { name: 'allowed.txt' }]);
    assert.deepEqual(messages[0], { error: ['blocked.pdf: File type is not allowed'] });
    assert.equal(reloads, 1);
  } finally {
    globalThis.Joomla = previousJoomla;
  }
});
