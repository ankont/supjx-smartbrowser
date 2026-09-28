import assert from 'node:assert/strict';
import test from 'node:test';
import { resetSessionNavigationIfNeeded, urlWithoutSessionNavigation } from '../resources/js/core/resetSessionNavigation.js';

test('new login clears only remembered node and filters', () => {
  const values = new Map([['supjx.smartbrowser.articles', JSON.stringify({ selectedNode: 'category:4', filters: { language: 'el-GR' }, activeView: 'details', sortBy: 'title' })]]);
  const storage = {
    get length() { return values.size; },
    key: (index) => [...values.keys()][index],
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(resetSessionNavigationIfNeeded(storage, 'administrator', 'first'), false);
  assert.equal(resetSessionNavigationIfNeeded(storage, 'administrator', 'first'), false);
  assert.equal(resetSessionNavigationIfNeeded(storage, 'administrator', 'second'), true);
  assert.deepEqual(JSON.parse(values.get('supjx.smartbrowser.articles')), { activeView: 'details', sortBy: 'title' });
  assert.equal(resetSessionNavigationIfNeeded(storage, 'administrator', 'second'), false);
});

test('new login removes bookmarked node and temporary flat scope', () => {
  const url = new URL(urlWithoutSessionNavigation('https://example.test/administrator/index.php?adapter=flat-articles&browseRoot=category%3A4&node=flat-articles%3Aroot&flatFromAdapter=articles&flatFromNode=category%3A4'));
  assert.equal(url.searchParams.has('node'), false);
  assert.equal(url.searchParams.has('browseRoot'), false);
  assert.equal(url.searchParams.has('flatFromAdapter'), false);
  assert.equal(url.searchParams.get('adapter'), 'flat-articles');
});
