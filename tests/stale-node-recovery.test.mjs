import assert from 'node:assert/strict';
import test from 'node:test';
import createBrowserState from '../resources/js/core/createBrowserState.js';

function setup(status) {
  const requests = [];
  const saved = [];
  const errors = [];
  const location = new URL('https://example.test/?node=category%3A97');
  globalThis.window = {
    location,
    history: { replaceState: (_state, _title, url) => { location.href = url.toString(); } },
  };
  globalThis.Joomla = { renderMessages: (messages) => errors.push(messages) };
  const browser = createBrowserState({
    options: { initialNode: 'content:root', roots: [{ id: 'content:root' }], mode: 'manage' },
    api: { getResources: async (node) => {
      requests.push(node);
      if (node === 'category:97') throw Object.assign(new Error('Not found'), { status });
      return { nodes: [], items: [], breadcrumb: [], actions: [] };
    } },
    persistence: {
      load: (defaults) => ({ ...defaults, selectedNode: 'category:97' }),
      save: (state) => saved.push(state.selectedNode),
    },
    viewRegistry: { has: () => true },
  });
  return { browser, requests, saved, errors, location };
}

test('inaccessible persisted category returns to root and replaces the stale URL', async () => {
  const { browser, requests, errors, location } = setup(403);
  await browser.load();
  assert.deepEqual(requests, ['category:97', 'content:root']);
  assert.equal(browser.state.selectedNode, 'content:root');
  assert.equal(location.searchParams.get('node'), 'content:root');
  assert.deepEqual(errors, []);
});

test('server failures do not silently reset the selected category', async () => {
  const { browser, requests, errors } = setup(500);
  await browser.load();
  assert.deepEqual(requests, ['category:97']);
  assert.equal(browser.state.selectedNode, 'category:97');
  assert.equal(errors.length, 1);
});
