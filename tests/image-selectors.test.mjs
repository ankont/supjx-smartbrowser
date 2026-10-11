import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('shared image integration converts compatible fields once and keeps unsupported values native', () => {
  let changed;
  const mounted = [];
  const make = (name, value = '', types = 'images', locked = false) => {
    const row = { after(root) { this.nextElementSibling = root; } };
    const form = { elements: { namedItem: () => null } };
    const input = { name, value, form, readOnly: locked, matches: () => false, closest: () => row, addEventListener() {} };
    return { getAttribute: () => types, querySelector: () => input, input };
  };
  const fields = [make('jform[custom_image]', 'images/a.jpg'), make('jform[external]', 'https://other.test/a.jpg'),
    make('jform[unsafe]', 'images/%2e%2e/secret.jpg'), make('jform[locked]', '', 'images', true), make('jform[all]', '', 'images,videos')];
  const source = readFileSync('resources/js/image-selectors.js', 'utf8').replace(/^import .*;\s*/gm, '');
  vm.runInNewContext(source, {
    URL, JSON, Object, WeakSet, Error,
    Joomla: { getOptions: () => ({ siteUrl: 'https://site.test/', roots: [{ url: 'https://site.test/images/', filesystem: 'local-images' }] }) },
    window: { SmartBrowserMediaValue: { parse: () => ({}) }, addEventListener() {} },
    mountNativeSelection: root => mounted.push(JSON.parse(root.dataset.sbArticleMedia)),
    mountSelectionField: () => ({ setItems() {} }),
    MutationObserver: class { constructor(fn) { changed = fn; } observe() {} },
    document: { body: {}, querySelectorAll: () => fields, createElement: () => ({ dataset: {}, querySelector: () => ({}), matches: () => true }) },
  });
  assert.equal(mounted.length, 1);
  assert.equal(mounted[0].nativeNames.image, 'jform[custom_image]');
  assert.deepEqual(Object.keys(mounted[0].usageFields), []);
  changed();
  assert.equal(mounted.length, 1, 'Repeated mutations must not duplicate selectors');
  fields.push(make('jform[new_image]'));
  changed();
  assert.equal(mounted.length, 2, 'New subform fields must be converted');
  for (const prefix of ['jform[com_fields][picture]', 'jform[com_fields][gallery][row0][picture]']) {
    const media = make(prefix + '[imagefile]', 'images/a.jpg');
    const controls = {
      [prefix + '[alt_text]']: { tagName: 'INPUT', type: 'text', value: 'Native description' },
      [prefix + '[alt_empty]']: { tagName: 'INPUT', type: 'checkbox', checked: true },
    };
    media.input.form.elements.namedItem = name => controls[name];
    fields.push(media);
    changed();
    const mapping = mounted.at(-1);
    assert.equal(mapping.nativeNames.alt_text, prefix + '[alt_text]');
    assert.equal(mapping.nativeNames.alt_empty, prefix + '[alt_empty]');
    assert.equal(mapping.usageFields['media.alt'], 'alt_text');
    assert.equal(mapping.usageFields['media.decorative'], 'alt_empty');
    assert.deepEqual(Object.keys(mapping.usageFields), ['media.alt', 'media.decorative']);
  }
});

test('image integration remains separate from Media Manager and always loads in SmartBrowser editors', () => {
  const plugin = readFileSync('package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php', 'utf8');
  assert.match(plugin, /IntegrationOptions::enabled\('replace_image_selectors'\)/);
  assert.match(readFileSync('package/component/site/src/View/Editor/HtmlView.php', 'utf8'), /ImageSelectorSupport::prepare\(\$this->getDocument\(\)\)/);
  assert.match(readFileSync('package/component/admin/config.xml', 'utf8'), /name="replace_image_selectors"/);
  assert.doesNotMatch(readFileSync('package/component/site/tmpl/editor/article-media.php', 'utf8'), /\$picker\(\$reference/);
});
