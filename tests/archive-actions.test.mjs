import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const adapter = (name) => readFile(new URL(`../package/component/admin/src/Adapter/${name}.php`, import.meta.url), 'utf8');

test('archive action follows publish state through article, category, and tag adapters', async () => {
  const [articles, categories, tags, byTag, content] = await Promise.all([
    adapter('ArticleCollectionAdapter'), adapter('CategoryAdapter'), adapter('TagAdapter'),
    adapter('ArticlesByTagAdapter'), adapter('ContentAdapter'),
  ]);
  for (const source of [articles, categories, tags]) {
    assert.match(source, /action\('archive', 'COM_SMARTBROWSER_ACTION_ARCHIVE', 'fas fa-archive'/);
    assert.match(source, /action\('unarchive', 'COM_SMARTBROWSER_ACTION_UNARCHIVE', 'fas fa-archive'/);
    assert.match(source, /'archive' => (?:\$this->setState\(\$selection, 2\)|2)/);
    assert.match(source, /'unarchive' => (?:\$this->setState\(\$selection, 0\)|0)/);
  }
  assert.match(byTag, /\['publish', 'unpublish', 'archive', 'unarchive', 'trash', 'restore', 'delete'\]/);
  assert.match(content, /'archive' => \$canArchive && in_array\(\$state, \[0, 1\], true\)/);
  assert.match(content, /'unarchive' => \$canUnpublish && \$state === 2/);
  assert.match(content, /2 => 'archive'/);
  assert.match(content, /2 => 'unarchive'/);
  assert.match(content, /'published' => \[0, 1, 2, -2\]/);
  assert.match(content, /default => in_array\(\$state, \[0, 1\], true\)/);
});

test('clipped breadcrumb names retain their full title as a tooltip', async () => {
  const breadcrumb = await readFile(new URL('../resources/js/components/ResourceBreadcrumb.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(breadcrumb, /:title="crumb.title"/);
  assert.match(breadcrumb, /class="resource-breadcrumb-title"/);
  assert.match(css, /\.resource-breadcrumb-title \{[^}]*text-overflow: ellipsis;/s);
});
