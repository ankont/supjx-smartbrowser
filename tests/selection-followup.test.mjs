import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compareResources } from '../resources/js/core/resourceSort.js';
import { execFileSync } from 'node:child_process';
import { hierarchyText, infoFieldPresentation } from '../resources/js/core/selectedPresentation.js';

test('privileged previews require a scoped valid grant and current management access', () => {
  assert.match(execFileSync('php', ['tests/article-preview-access.php'], { encoding: 'utf8' }), /management ACL OK/);
});

test('information paths use consistent labels and separators without changing stored metadata', () => {
  assert.equal(hierarchyText('Library / Drawing / Saints\nYear / October'), 'Library » Drawing » Saints\nYear » October');
  assert.equal(infoFieldPresentation({ source: 'metadata.categoryPath' }, { type: 'article' }).label, 'COM_SMARTBROWSER_LOCATION');
  assert.equal(infoFieldPresentation({ source: 'metadata.tagPaths' }, { type: 'article' }).label, 'COM_SMARTBROWSER_TAGS');
  assert.equal(infoFieldPresentation({ source: 'metadata.tagPaths' }, { type: 'tag' }).label, 'COM_SMARTBROWSER_LOCATION');
});

test('article preview delegates to native rendering and always releases its presentation hook', () => {
  assert.match(execFileSync('php', ['tests/article-preview-view.php'], { encoding: 'utf8' }), /cleanup OK/);
});

test('flat location sorting uses hierarchy paths rather than leaf labels or indentation', () => {
  const values = [
    { title: 'First', metadata: { location: 'Alpha', locationPath: 'Zeta / Alpha', locationDepth: 3 } },
    { title: 'Second', metadata: { location: 'Zeta', locationPath: 'Alpha / Zeta', locationDepth: 0 } },
  ];
  assert.deepEqual([...values].sort(compareResources('location', 'asc')).map(r => r.title), ['Second', 'First']);
  assert.deepEqual([...values].sort(compareResources('location', 'desc')).map(r => r.title), ['First', 'Second']);
});

test('flat ordering respects category groups and nested tree traversal', () => {
  const articles = [{ id: 1, type: 'article', parentId: 'category:2', metadata: { ordering: 1, locationPath: 'Z' } },
    { id: 2, type: 'article', parentId: 'category:1', metadata: { ordering: 2, locationPath: 'A' } },
    { id: 3, type: 'article', parentId: 'category:1', metadata: { ordering: 1, locationPath: 'A' } }];
  assert.deepEqual(articles.sort(compareResources('ordering', 'asc')).map(r => r.id), [3, 2, 1]);
  const nodes = [{ metadata: { ordering: 1, hierarchyOrder: 2 } }, { metadata: { ordering: 8, hierarchyOrder: 0 } }];
  assert.equal(nodes.sort(compareResources('ordering', 'asc'))[0].metadata.hierarchyOrder, 0);
});

test('embedded and full browsers load the current client core language', () => {
  for (const file of ['CollectionViewSupport', 'BrowserViewSupport']) {
    const source = readFileSync(`package/component/admin/src/Support/${file}.php`, 'utf8');
    assert.match(source, /load\('joomla', [^\n]+isClient\('administrator'\) \? JPATH_ADMINISTRATOR : JPATH_SITE/);
    assert.doesNotMatch(source, /load\('joomla', JPATH_ADMINISTRATOR/);
  }
});
