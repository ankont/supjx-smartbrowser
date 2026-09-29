import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = async (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('frontend associations reuse Joomla language handling', async () => {
  const view = await source('../package/component/site/src/View/Editor/HtmlView.php');
  const template = await source('../package/component/site/tmpl/editor/modal.php');
  assert.match(view, /useScript\('com_smartbrowser\.associations'\)/);
  assert.match(view, /Text::script\('JGLOBAL_ASSOC_NOT_POSSIBLE'\)/);
  assert.doesNotMatch(view, /getScriptOptions\('joomla\.jtext'\)/);
  assert.match(view, /'hidden' => \(int\) \(\$this->editorForm->getValue\('language', null, '\*'\) === '\*'\)/);
  assert.match(template, /'smartbrowserEditorTabs', 'associations'/);
  assert.match(template, /id="fieldset-associations"/);
});

test('associations retain only the current message', async () => {
  const script = await source('../package/component/media/js/associations.js');
  assert.match(script, /Joomla\.showAssociationMessage = \(\.\.\.args\) => \{\s*clearMessage\(\);/);
  assert.match(script, /Joomla\.hideAssociation = \(\.\.\.args\) => \{\s*clearMessage\(\);/);
});

test('shared editor controls and media picker handle their visible states', async () => {
  const css = await source('../package/component/media/css/smartbrowser.css');
  const editorCss = await source('../package/component/media/css/editor.css');
  assert.match(css, /\.com-smartbrowser-editor \.choices \.choices__list--single \.choices__button_joomla::before \{ content: '\\00d7'/);
  assert.match(css, /\.smartbrowser-picker \{[^}]*overflow: hidden/);
  assert.match(css, /\.smartbrowser-picker iframe \{ display: block/);
  assert.match(editorCss, /body \.calendar-container table tbody td\.day\.selected \{\s*color: #fff !important;\s*background: #0d6efd !important;/);
});

test('article featured period and menu home language flags reach both views', async () => {
  const content = await source('../package/component/admin/src/Adapter/ContentAdapter.php');
  const grid = await source('../resources/js/components/ResourceGrid.vue');
  const details = await source('../resources/js/components/ResourceDetails.vue');
  assert.match(content, /'JLIB_HTML_FEATURED_' \. strtoupper\(\$featuredTiming\) \. '_ITEM'/);
  assert.match(content, /'icon-' \. \$featuredTiming/);
  assert.match(grid, /<img v-if="overlay\.image"/);
  assert.match(details, /<img v-if="overlay\.image"/);
});

test('article publication dates change status presentation without changing publish actions', async () => {
  const content = await source('../package/component/admin/src/Adapter/ContentAdapter.php');
  const css = await source('../package/component/media/css/smartbrowser.css');
  assert.match(content, /\$state === 1[\s\S]*\$publishDown !== '' && \$publishDown !== \$nullDate[\s\S]*\$publicationTiming = 'expired'/);
  assert.match(content, /'JLIB_HTML_PUBLISHED_' \. strtoupper\(\$publicationTiming\) \. '_ITEM'/);
  assert.match(content, /\$statusOverlay = array_replace\(\$statusOverlay, \$statusPresentation\)/);
  assert.match(content, /'status' => \$state, 'statusPresentation' => \$statusPresentation/);
  assert.match(css, /\.resource-status-icon\.status-expired/);
});
