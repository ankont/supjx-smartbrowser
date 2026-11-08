import test from 'node:test';
import assert from 'node:assert/strict';
import { effectScope, nextTick } from 'vue';
import { execFileSync } from 'node:child_process';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import ResourceApi from '../resources/js/services/ResourceApi.js';
import PersistenceService from '../resources/js/services/PersistenceService.js';
import { resolveLoadingPreferences } from '../resources/js/core/personalPreferences.js';

const item = id => ({ id: `article:${id}`, title: `Article ${id}`, kind: 'item', type: 'article', selectable: true, bulkSelectable: true, capabilities: {} });
const response = (ids, offset = 0, total = 5) => ({ nodes: [], navigationNodes: [{ id: 'category:2', title: 'Folder' }], items: ids.map(item), breadcrumb: [], actions: [], presentation: { filters: [], sortFields: [{ id: 'title' }] }, pagination: { offset, limit: 2, total, hasMore: offset + 2 < total } });
function fixture(api) {
  const previous = { window: globalThis.window, Joomla: globalThis.Joomla };
  globalThis.window = { location: { href: 'https://example.test/?adapter=articles' }, history: { replaceState() {} } };
  globalThis.Joomla = { renderMessages() {} };
  const scope = effectScope();
  const browser = scope.run(() => createBrowserState({ options: { adapter: 'articles', mode: 'manage', multiple: true, roots: [{ id: 'root' }], initialNode: 'root', loadingMode: 'pages', pageSize: 10, paginationSupported: true }, api,
    persistence: { load: defaults => defaults, save() {} }, viewRegistry: { has: () => true } }));
  return { browser, close() { scope.stop(); Object.assign(globalThis, previous); } };
}

test('page selections survive navigation, invert and select-all are limited to the visible page', async () => {
  const calls = [];
  const f = fixture({ getResources: async (node, query) => { calls.push(query); return query.offset ? response([3, 4], 2) : response([1, 2]); } });
  try {
    const b = f.browser;
    await b.load();
    b.toggle(b.resources.value[0]);
    await b.load('root', { offset: 2 });
    assert.equal(calls[1].limit, 10);
    assert.equal(b.state.navigationNodes[0].id, 'category:2');
    assert.equal(b.selection.value[0].id, 'article:1');
    b.selectAll();
    assert.deepEqual(b.selection.value.map(r => r.id), ['article:1', 'article:3', 'article:4']);
    b.invertSelection();
    assert.deepEqual(b.selection.value.map(r => r.id), ['article:1']);
    await b.load('category:2');
    assert.deepEqual(b.selection.value, []);
    assert.equal(calls.at(-1).offset, 0);
  } finally { f.close(); }
});

test('failed and superseded page requests preserve valid results and selections', async () => {
  let resolveOld, count = 0;
  const f = fixture({ getResources: async () => {
    count++;
    if (count === 2) return new Promise(resolve => { resolveOld = resolve; });
    if (count === 4) throw Error('Network unavailable');
    return count === 1 ? response([1, 2]) : response([5], 4);
  } });
  try {
    const b = f.browser;
    await b.load(); b.toggle(b.resources.value[0]);
    const older = b.load('root', { offset: 2 });
    await b.load('root', { offset: 4 });
    resolveOld(response([3, 4], 2)); await older;
    assert.equal(b.resources.value[0].id, 'article:5');
    await b.load('root', { offset: 2 });
    assert.equal(b.resources.value[0].id, 'article:5');
    assert.equal(b.selection.value[0].id, 'article:1');
    assert.equal(b.state.loading, false);
    assert.equal(b.state.error, 'Network unavailable');
  } finally { f.close(); }
});

test('paged sorting and search reload the complete query from its first page', async () => {
  const calls = [];
  const f = fixture({ getResources: async (_, query) => { calls.push(query); return response([1, 2], query.offset); } });
  try {
    const b = f.browser;
    await b.load(); await b.load('root', { offset: 2 });
    b.state.search = 'different'; await nextTick(); await nextTick();
    assert.equal(calls.at(-1).offset, 0);
    assert.equal(b.resources.value.length, 2, 'Do not filter a server page again in the client');
    b.state.sortBy = 'title'; await nextTick(); await nextTick();
    assert.equal(calls.at(-1).sortBy, 'title');
    assert.equal(calls.at(-1).offset, 0);
  } finally { f.close(); }
});

test('pagination count and deterministic SQL ordering retain native access query', () => {
  for (const file of ['Adapter/ContentAdapter.php', 'Adapter/ArticleAdapter.php', 'Adapter/FlatArticleAdapter.php', 'Model/PagedArticlesModel.php', 'Model/PagedUsersModel.php', 'Adapter/UsersAdapter.php', 'Support/ResourceListing.php', 'Support/ResourcePagination.php', 'Controller/ApiController.php']) {
    assert.match(execFileSync('php', ['-l', `package/component/admin/src/${file}`], { encoding: 'utf8' }), /No syntax errors/);
  }
  assert.match(execFileSync('php', ['tests/pagination.php'], { encoding: 'utf8' }), /pagination OK/);
});

test('resource API keeps full-loading callers compatible and sends independent tree requests', async () => {
  const api = new ResourceApi({ adapter: 'articles', apiBaseUrl: 'https://example.test/?option=com_smartbrowser' });
  api.request = url => url;
  const full = await api.getResources('category:2');
  assert.equal(full.searchParams.has('limit'), false);
  const page = await api.getResources('category:2', { offset: 50, limit: 25 });
  assert.equal(page.searchParams.get('offset'), '50');
  assert.equal(page.searchParams.get('limit'), '25');
  api.options.navigationOnly = true;
  assert.equal((await api.getResources('category:2')).searchParams.get('navigationOnly'), '1');
});

test('personal page sizes override defaults, while legacy view sizes cannot mask global changes', () => {
  const persistence = new PersistenceService({ getItem: () => '{"pageSize":100}' });
  assert.equal(persistence.load({ pageSize: 25 }).pageSize, 25);
  assert.deepEqual(resolveLoadingPreferences({ loadingMode: 'inherit', pageSize: null }, { loadingMode: 'pages', pageSize: 25 }), { mode: 'pages', pageSize: 25 });
  assert.equal(resolveLoadingPreferences({ loadingMode: 'pages', pageSize: 237 }, { pageSize: 25 }).pageSize, 237);
});

test('saving loading preferences refreshes the query immediately without losing selections', async () => {
  const calls = [];
  const f = fixture({ getResources: async (_, query) => { calls.push(query); return response([1, 2], query.offset, 5); } });
  try {
    const b = f.browser;
    await b.load(); b.toggle(b.resources.value[0]);
    await b.applyLoadingPreferences({ loadingMode: 'pages', pageSize: 37 });
    assert.equal(calls.length, 2, 'Exactly one refresh for the saved preference');
    assert.equal(calls.at(-1).limit, 37);
    assert.equal(calls.at(-1).offset, 0);
    assert.equal(b.selection.value[0].id, 'article:1');
    await b.applyLoadingPreferences({ loadingMode: 'all', pageSize: 37 });
    assert.equal(calls.at(-1).limit, undefined);
    assert.equal(b.selection.value[0].id, 'article:1');
    await b.applyLoadingPreferences({ loadingMode: 'pages', pageSize: 7 });
    assert.equal(calls.at(-1).limit, 7);
    assert.equal(b.selection.value[0].id, 'article:1');
  } finally { f.close(); }
});

test('failed preference refresh retains the preceding page and selection', async () => {
  let calls = 0;
  const f = fixture({ getResources: async () => { if (++calls > 1) throw Error('Unavailable'); return response([1, 2]); } });
  try {
    const b = f.browser; await b.load(); b.toggle(b.resources.value[0]);
    await b.applyLoadingPreferences({ loadingMode: 'all', pageSize: 37 });
    assert.equal(b.state.pageSize, 10);
    assert.equal(b.selection.value[0].id, 'article:1');
    assert.equal(b.resources.value.length, 2);
    assert.equal(b.state.error, 'Unavailable');
  } finally { f.close(); }
});

test('smart loading appends once, preserves focus/selection and refreshes from the first batch', async () => {
  const calls = [];
  const f = fixture({ getResources: async (_, query) => {
    calls.push(query);
    await new Promise(resolve => setTimeout(resolve, 0));
    return response(query.offset === 4 ? [5] : query.offset === 2 ? [3, 4] : [1, 2], query.offset);
  } });
  try {
    const b = f.browser;
    await b.applyLoadingPreferences({ loadingMode: 'smart', pageSize: 2 });
    b.toggle(b.resources.value[0]); const revision = b.state.navigationRevision;
    await Promise.all([b.loadMore(), b.loadMore()]);
    assert.equal(calls.length, 2);
    assert.deepEqual(b.resources.value.map(r => r.id), ['article:1', 'article:2', 'article:3', 'article:4']);
    assert.equal(b.state.focusedId, 'article:1');
    assert.equal(b.state.navigationRevision, revision);
    await b.loadMore();
    assert.equal(b.state.loadedCount, 5);
    assert.equal(b.selection.value[0].id, 'article:1');
    await b.loadMore(); assert.equal(calls.length, 3);
    await b.load();
    assert.equal(calls.at(-1).offset, 0);
    assert.equal(b.state.loadedCount, 2);
  } finally { f.close(); }
});

test('smart loading suppresses duplicates and does not discard results after an append failure', async () => {
  let fail = false;
  const f = fixture({ getResources: async (_, q) => {
    if (fail) throw Error('Offline');
    return response(q.offset ? [2, 3] : [1, 2], q.offset);
  } });
  try {
    const b = f.browser; await b.applyLoadingPreferences({ loadingMode: 'smart', pageSize: 2 });
    await b.loadMore();
    assert.equal(b.resources.value.length, 3);
    fail = true; await b.loadMore();
    assert.equal(b.resources.value.length, 3);
    assert.equal(b.state.loadingMore, false);
    assert.equal(b.state.error, 'Offline');
  } finally { f.close(); }
});

test('smart loading restarts a changed result set instead of combining inconsistent totals', async () => {
  let total = 5;
  const f = fixture({ getResources: async (_, q) => response(q.offset ? [3, 4] : [1, 2], q.offset, total) });
  try {
    const b = f.browser; await b.applyLoadingPreferences({ loadingMode: 'smart', pageSize: 2 });
    total = 6; await b.loadMore();
    assert.equal(b.state.pagination.offset, 0);
    assert.equal(b.state.pagination.total, 6);
    assert.equal(b.state.loadedCount, 2);
  } finally { f.close(); }
});

test('load all drains smart batches without changing mode and stops on failure', async () => {
  let fail = false;
  const f = fixture({ getResources: async (_, q) => {
    if (fail && q.offset === 4) throw Error('Offline');
    await new Promise(resolve => setTimeout(resolve, 0));
    return response(q.offset === 4 ? [5] : q.offset === 2 ? [3, 4] : [1, 2], q.offset);
  } });
  try {
    const b = f.browser;
    await b.applyLoadingPreferences({ loadingMode: 'smart', pageSize: 2 });
    b.toggle(b.resources.value[0]);
    await Promise.all([b.loadAll(), b.loadAll()]);
    assert.equal(b.state.loadedCount, 5);
    assert.equal(b.state.loadingMode, 'smart');
    assert.equal(b.state.loadingAll, false);
    assert.equal(b.selection.value[0].id, 'article:1');
    await b.load(); fail = true; await b.loadAll();
    assert.equal(b.state.loadedCount, 4);
    assert.equal(b.state.error, 'Offline');
    assert.equal(b.state.loadingAll, false);
  } finally { f.close(); }
});
