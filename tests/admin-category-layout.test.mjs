import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('administrator categories reuse native fields, params and permission gates in the Article layout', () => {
  const layout = readFileSync('package/component/site/tmpl/editor/category-admin.php', 'utf8');
  assert.ok(layout.indexOf("'joomla.edit.title_alias'") < layout.indexOf("'uitab.startTabSet'"));
  for (const name of ['global', 'params', 'publishingdata', 'metadata']) assert.ok(layout.includes(`'joomla.edit.${name}'`));
  assert.match(layout, /col-lg-9[\s\S]*getInput\('description'\)[\s\S]*col-lg-3/);
  assert.match(layout, /authorise\('core.admin', \$asset\) && \$form->getField\('rules'\)/);
  assert.match(layout, /finally\s*\{\s*\$input->set\('option', \$originalOption\)/);
  assert.match(layout, /isWorkflowActive\([\s\S]*\$ignored\[\] = 'workflow'/);
  assert.doesNotMatch(layout, /category-image.php/);
  assert.match(readFileSync('package/component/site/tmpl/editor/modal.php', 'utf8'), /require __DIR__ \. '\/category-admin.php'/);
  assert.match(readFileSync('package/component/site/src/View/Editor/HtmlView.php', 'utf8'), /versions\(\$extension \. '\.category', \$this->resourceId\)/);
});

test('category image selections retain native storage and only supported presentation properties', () => {
  const layout = readFileSync('resources/js/image-selectors.js', 'utf8');
  assert.match(layout, /images\|params/);
  assert.match(layout, /'media.alt'/);
  assert.match(layout, /'media.decorative'/);
  assert.match(layout, /if \(match && match\[1\] === 'images'\)/);
  assert.match(layout, /try \{ reference = selection\(field.value\); \} catch \{ return; \}/);
  assert.match(layout, /<input type="hidden" data-sb-value/);
  const bridge = readFileSync('resources/js/article-media.js', 'utf8');
  assert.match(bridge, /categoryImage \? \[mapping.image/);
  assert.match(bridge, /if \(!categoryImage\)/);
});
