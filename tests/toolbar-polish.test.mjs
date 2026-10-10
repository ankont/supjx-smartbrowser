import assert from 'node:assert/strict';
import test from 'node:test';
import createBrowserState from '../resources/js/core/createBrowserState.js';
import { readFile } from 'node:fs/promises';

test('action menus stack above the browser toolbar in picker layouts', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  const actionsLayer = css.match(/\.resource-actions-area \{[^}]*\}/s)?.[0] || '';
  const toolbarLayer = css.match(/\.resource-toolbar \{[^}]*\}/s)?.[0] || '';
  assert.match(actionsLayer, /position: relative;/);
  assert.ok(Number(actionsLayer.match(/z-index: (\d+);/)?.[1]) > Number(toolbarLayer.match(/z-index: (\d+);/)?.[1]));
});

test('single-select hides invert and action labels compact without wrapping', async () => {
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const toolbar = await readFile(new URL('../resources/js/components/ResourceToolbar.vue', import.meta.url), 'utf8');
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(app, /:multiple="options\.multiple"/);
  assert.match(toolbar, /v-if="multiple"[^>]+COM_SMARTBROWSER_INVERT_SELECTION/);
  assert.match(actions, /resource-action-label/);
  assert.match(css, /\.resource-actions \{[^}]*flex-wrap: nowrap;/s);
  assert.match(actions, /new ResizeObserver\(\(\[entry\]\) =>/);
  assert.match(actions, /entry\.contentRect\.width === observedWidth/);
  assert.match(actions, /getBoundingClientRect\(\)\.width/);
  assert.match(css, /\.resource-actions\.is-compact-1/);
  assert.match(css, /\.resource-actions\.is-compact-1 \.resource-batch-toggle \.resource-action-label/);
  assert.match(css, /\.resource-actions\.is-compact-2 :is\(\.resource-action-menu-toggle/);
  assert.doesNotMatch(actions, /resource-filter-clear[^>]*icon-times/);
});

test('paired image fieldsets neutralize theme sibling spacing', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /smartbrowser-editor-image-row, \.smartbrowser-editor-link-row\) > \.options-form \{\s*margin-block-start: 0 !important;/);
});

test('creation actions order items before nodes and keep contextual add icon-only', async () => {
  const files = await Promise.all([
    'resources/js/components/ResourceActions.vue',
    'package/component/admin/src/Adapter/ArticleAdapter.php',
    'package/component/admin/src/Adapter/CategoryAdapter.php',
    'package/component/admin/src/Adapter/TagAdapter.php',
    'package/component/admin/src/Adapter/ArticlesByTagAdapter.php',
    'package/component/admin/src/Adapter/MediaAdapter.php',
  ].map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')));
  const [actions, articles, categories, tags, byTag, media] = files;
  assert.match(actions, /creationOrder = \{ item: 0, node: 1, contextual: 2 \}/);
  assert.match(actions, /v-if="action\.creationRole !== 'contextual'"/);
  assert.match(categories, /createChild'.*'fas fa-plus'.*'creationRole' => 'item'/);
  assert.match(categories, /newArticle'.*'fas fa-newspaper'.*'creationRole' => 'contextual'/);
  assert.match(tags, /createChild'.*'fas fa-plus'.*'creationRole' => 'item'/);
  assert.match(tags, /newArticle'.*'fas fa-file-alt'.*'creationRole' => 'contextual'/);
  assert.match(articles, /newArticle'.*'fas fa-plus'.*'creationRole' => 'item'/);
  assert.match(articles, /createChild'.*'fas fa-box'.*'creationRole' => 'node'/);
  assert.match(byTag, /'icon' => 'fas fa-tag', 'creationRole' => 'node'/);
  assert.match(media, /upload'.*'fas fa-plus'.*'creationRole' => 'item'/);
});

test('invert selection toggles only visible selectable resources', () => {
  const browser = createBrowserState({
    options: { roots: [{ id: 'root' }], mode: 'manage' },
    api: {},
    persistence: { load: (defaults) => defaults, save: () => {} },
    viewRegistry: { has: () => true },
  });
  browser.state.nodes = [
    { id: 'one', kind: 'node', title: 'One', selectable: true },
    { id: 'two', kind: 'node', title: 'Two', selectable: true },
  ];
  browser.state.contextItems = [{ id: 'context', kind: 'item', title: 'Context' }];
  browser.state.selectedIds = ['one', 'hidden'];
  browser.invertSelection();
  assert.deepEqual(browser.state.selectedIds, ['hidden', 'two']);
});

test('picker flat view is available, while manager navigation follows application', async () => {
  const app = await readFile(new URL('../resources/js/components/SmartBrowserApp.vue', import.meta.url), 'utf8');
  const actions = await readFile(new URL('../resources/js/components/ResourceActions.vue', import.meta.url), 'utf8');
  assert.match(app, /flatAvailable = options\.adapter !== 'featured-articles' && \['articles', 'categories', 'tags', 'articles-by-tag', 'menus', 'users', 'media'\]/);
  assert.match(app, /adapter: options\.adapter\.replace\(\/\^flat-\/, ''\)/);
  assert.match(app, /:manager-new-tab="options\.application === 'site'"/);
  assert.match(actions, /:target="managerNewTab \? '_blank' : undefined"/);
});

test('info panel localizes wildcard language and decorates labels', async () => {
  const panel = await readFile(new URL('../resources/js/components/ResourceInfoPanel.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(panel, /:class="fieldIcon\(field\)"/);
  assert.match(panel, /rawFieldValue\(field\) === '\*'/);
  assert.match(panel, /resource-info-identifier/);
  assert.match(details, /column\.format === 'language' && value === '\*'/);
  assert.match(details, /resource\.metadata\.language === '\*'[^>]*resource-language-all fas fa-asterisk/);
  assert.match(panel, /rawFieldValue\(field\) === '\*'[^>]*resource-language-all fas fa-asterisk/);
  assert.match(css, /\.resource-language-all \{[^}]*width: 18px;[^}]*height: 13px;[^}]*background: #4b9dd0;[^}]*border-radius: 2px;/s);
});

test('editor checkboxes keep their native width inside theme labels', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /\.com-smartbrowser-editor \.smartbrowser-editor-tab input\.form-check-input\[type="checkbox"\] \{[^}]*display: inline-block;[^}]*width: 16px !important;[^}]*max-width: none;/s);
});

test('node icons sit beside folder visuals while node images fill the tile', async () => {
  const grid = await readFile(new URL('../resources/js/components/ResourceGrid.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(grid, /<ResourceVisual :resource="resource"/);
  assert.match(css, /\.resource-visual-content \{[^}]*z-index: 1;/s);
  assert.match(css, /\.resource-visual-layer \.resource-visual-icon \{[^}]*position: static;[^}]*line-height: 1;/s);
  assert.match(css, /\.resource-visual-layer\.resource-node-visual-symbol \{[^}]*background: #fff;/s);
});

test('node visuals carry through tree and details while list images honor thumbnail setting', async () => {
  const tree = await readFile(new URL('../resources/js/components/ResourceTree.vue', import.meta.url), 'utf8');
  const details = await readFile(new URL('../resources/js/components/ResourceDetails.vue', import.meta.url), 'utf8');
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MenuAdapter.php', import.meta.url), 'utf8');
  const { resourceVisualIcon, hasNodeBadge } = await import('../resources/js/core/resourceVisual.js');
  const menu = { kind: 'node', type: 'menu-item', icon: 'fas fa-folder', image: '/menu.png', badgeIcon: 'fas fa-book' };
  assert.equal(resourceVisualIcon(menu), 'fas fa-book');
  assert.equal(hasNodeBadge(menu), true);
  assert.equal(hasNodeBadge({ ...menu, badgeIcon: undefined }), false);
  assert.equal(resourceVisualIcon({ type: 'article', icon: 'fas fa-file' }), 'fas fa-file');
  assert.match(tree, /<ResourceNodeVisual :resource="node"/);
  assert.match(tree, /<ResourceNodeVisual :resource="crumb"/);
  assert.doesNotMatch(tree, /resourceTreeImage|resource-tree-thumbnail/);
  assert.match(details, /<ResourceVisual :resource="resource" variant="compact" :allow-image="options\.detailsThumbnails"/);
  assert.match(adapter, /array_unshift\(\$chain, \[\.\.\.\$this->normalizeItem\(\$item\), 'visible' => true\]\)/);
});

test('compact node icons retain the folder behind a white badge', async () => {
  const visual = await readFile(new URL('../resources/js/components/ResourceNodeVisual.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(visual, /variant="compact" :allow-image="false" :open="open"/);
  assert.match(css, /\.resource-node-visual-symbol \{[^}]*background: #fff;/s);
  assert.match(css, /\.resource-visual-content\.visual-compact \{[^}]*width: 18px;[^}]*height: 18px;/s);
  assert.match(css, /\.resource-details-view \.resource-visual-content\.visual-compact \{[^}]*width: 24px;[^}]*height: 24px;/s);
  const tree = await readFile(new URL('../resources/js/components/ResourceTree.vue', import.meta.url), 'utf8');
  assert.match(tree, /class="resource-tree-root-icon" :class="root.useResourceIcon \? root.icon : adapter.icon"/);
  assert.match(tree, /:resource="crumb" :open="true"/);
});
