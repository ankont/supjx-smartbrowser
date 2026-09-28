import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('category filters use Joomla category model in tree and flat views', async () => {
  const [categories, flat] = await Promise.all([
    source('package/component/admin/src/Adapter/CategoryAdapter.php'),
    source('package/component/admin/src/Adapter/FlatCategoryAdapter.php'),
  ]);
  for (const id of ['state', 'access', 'language', 'tag']) {
    assert.match(categories, new RegExp(`'id' => '${id}'`));
  }
  for (const state of ['published', 'access', 'language', 'tag']) {
    assert.match(categories, new RegExp(`setState\\('filter\\.${state}'`));
  }
  assert.match(categories, /hasMatchingCategoryDescendant\(\$child, \$matchingIds\)/);
  assert.doesNotMatch(categories, /'id' => 'category'|'id' => 'maxLevels'/);
  assert.match(flat, /FlatLevels::filter\(\)/);
  assert.match(flat, /'id' => 'category'/);
  assert.match(flat, /matchingCategoryIds\(\$options\)/);
});

test('article language filter has choices and reaches Joomla article model', async () => {
  const [articles, content] = await Promise.all([
    source('package/component/admin/src/Adapter/ArticleCollectionAdapter.php'),
    source('package/component/admin/src/Adapter/ContentAdapter.php'),
  ]);
  assert.match(articles, /'id' => 'language'[^\n]+\$this->languageOptions\(\)/);
  assert.match(content, /setState\('filter.language', \(string\) \(\$filters\['language'\]/);
  assert.match(content, /#__languages/);
});

test('flat content levels start at the selected node and constrain exact category IDs', async () => {
  const [articles, categories, content] = await Promise.all([
    source('package/component/admin/src/Adapter/FlatArticleAdapter.php'),
    source('package/component/admin/src/Adapter/FlatCategoryAdapter.php'),
    source('package/component/admin/src/Adapter/ContentAdapter.php'),
  ]);
  assert.match(articles, /\$root = \$selectedCategory > 0 \? \$this->getCategory\(\$selectedCategory\) : \$scope/);
  assert.match(categories, /\$root = \$inScope && \$selectedCategory > 0 \? \$this->getCategory\(\$selectedCategory\) : \$scope/);
  assert.match(content, /setState\('filter\.level', 1\)/);
  assert.ok(articles.indexOf("'id' => 'category'") < articles.indexOf("$presentation['filters'][] = FlatLevels::filter()"));
  assert.ok(categories.indexOf("'id' => 'category'", categories.indexOf("$presentation = $this->presentation()")) < categories.indexOf("$presentation['filters'][] = FlatLevels::filter()"));
});
