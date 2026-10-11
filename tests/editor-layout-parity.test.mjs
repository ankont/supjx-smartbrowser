import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('all editor clients share spacing and menu/tag/user native layouts', () => {
  const modal = readFileSync('package/component/site/tmpl/editor/modal.php', 'utf8');
  const resources = readFileSync('package/component/site/tmpl/editor/resource-native.php', 'utf8');
  const css = readFileSync('package/component/media/css/editor.css', 'utf8');
  assert.match(modal, /is-aligned-editor/);
  assert.match(modal, /elseif \(\$this->resourceType === 'category'\)/);
  assert.match(modal, /require __DIR__ \. '\/resource-native.php'/);
  assert.match(resources, /'tag' => 'com_tags', 'menu-item' => 'com_menus', 'user' => 'com_users'/);
  for (const name of ['title_alias', 'params', 'global', 'publishingdata', 'metadata']) assert.ok(resources.includes(`'joomla.edit.${name}'`));
  assert.match(resources, /'menutype', 'parent_id', 'menuordering', 'published'/);
  assert.match(resources, /loadUserById\(\$this->resourceId\)->groups/);
  assert.match(resources, /finally \{ \$input->set\('option', \$originalOption\)/);
  assert.match(css, /\.is-aligned-editor \.col-lg-3 \.control-group \{ flex-direction: column/);
  assert.match(css, /\.is-aligned-editor \.options-form \{[^}]*border: 1px solid/s);
  assert.match(css, /\.is-aligned-editor \.options-form > legend \{[^}]*float: none;[^}]*width: auto;[^}]*font-size: 1rem;/s);
  assert.match(readFileSync('package/component/media/js/editor-fields.js', 'utf8'), /is-admin-resource-page/);
});

test('frontend articles put existing native publishing fields in the sidebar without duplicating them', () => {
  const layout = readFileSync('package/component/site/tmpl/editor/article-site.php', 'utf8');
  assert.ok(layout.indexOf("$renderField('title')") < layout.indexOf('uitab.startTabSet'));
  assert.match(layout, /col-lg-9[\s\S]*getInput\('articletext'\)[\s\S]*col-lg-3/);
  assert.match(layout, /\['transition', 'state', 'catid', 'featured', 'access', 'tags', 'note'\]/);
  assert.match(layout, /if \(\$showImages/);
  assert.match(layout, /if \(\$showPublishing\)/);
  assert.match(layout, /\$renderField\('language'\)/);
  assert.doesNotMatch(layout, /setFieldAttribute\([^\n]*(?:readonly|disabled)/);
  assert.match(layout, /\$fieldsetFields\(\$fieldset->name\)/);
});
