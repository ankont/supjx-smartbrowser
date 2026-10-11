import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('administrator articles reuse native fieldset hierarchy and component context', () => {
    const layout = readFileSync('package/component/site/tmpl/editor/article-admin.php', 'utf8');
    assert.ok(layout.includes('use Joomla\\CMS\\Language\\Associations;'));
    assert.ok(layout.includes('COM_CONTENT_FIELD_ARTICLETEXT_LABEL'));
    assert.ok(layout.includes('COM_SMARTBROWSER_CONTENT_SETTINGS'));
    assert.ok(layout.includes("require __DIR__ . '/article-media.php'"));
    assert.ok(layout.includes('COM_CONTENT_SLIDER_EDITOR_CONFIG'));
    assert.ok(layout.indexOf('joomla.edit.title_alias') < layout.indexOf("echo '<div class=\"main-card\">'"));
    for (const name of ['title_alias', 'global', 'params', 'publishingdata', 'metadata']) {
        assert.ok(layout.includes(`joomla.edit.${name}`));
    }
    assert.match(layout, /'linka', 'linkb', 'linkc'/);
    assert.match(layout, /'configFieldsets' => \['editorConfig'\]/);
    assert.match(layout, /\$canAdmin && \$params->get\('show_permissions'/);
    assert.match(layout, /getInput\('rules'\)/);
    assert.match(layout, /set\('option', 'com_content'\)/);
    assert.match(layout, /finally\s*\{\s*\$input->set\('option', \$originalOption\)/);
    assert.match(layout, /\$this->values\[\$name\] \?\? \$this->\{\$name\}/);
    const view = readFileSync('package/component/site/src/View/Editor/HtmlView.php', 'utf8');
    const css = readFileSync('package/component/media/css/editor.css', 'utf8');
    assert.match(css, /is-aligned-editor \.options-form \.control-group \{ display: flex; flex-direction: row;/);
    assert.match(css, /is-aligned-editor \.options-form \.control-group > \.control-label \{ flex: 0 0 240px;/);
    assert.match(css, /is-aligned-editor \.col-lg-3 \.control-group \{ flex-direction: column;/);
    assert.ok(view.includes("versions('com_content.article', $this->resourceId)"));
    assert.ok(view.includes("preview($url, 'JGLOBAL_PREVIEW', false)"));
    assert.ok(view.includes("'smartbrowser.cancel', 'times', '', 'JCLOSE'"));
    assert.match(view, /isClient\('administrator'\)[\s\S]*?set\('hidemainmenu', true\)/);
});
