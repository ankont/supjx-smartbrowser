async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.locator('.sb-selection-field .resource-info-panel').first().waitFor();
  await page.evaluate(async () => {
    const form = document.createElement('form'); form.id = 'native-address-fixture';
    const initial = '/resources/images/visual-example.svg#joomlaImage://local-images/a.png?width=800&height=600&crop=original&plugin=keep';
    for (const name of ['image_intro', 'image_intro_alt', 'image_intro_alt_empty', 'image_intro_caption', 'float_intro']) {
      const row = document.createElement('div'); row.className = 'control-group';
      const controls = document.createElement('div'); controls.className = 'controls'; row.append(controls);
      const input = document.createElement('input'); input.name = `jform[images][${name}]`;
      input.type = name.endsWith('_empty') ? 'checkbox' : 'text'; input.value = name === 'image_intro' ? initial : '';
      if (name === 'image_intro') { const media = document.createElement('joomla-field-media'); media.setAttribute('types', 'images'); input.className = 'field-media-input'; media.append(input); const preview = document.createElement('div'); preview.className = 'field-media-preview'; media.append(preview); controls.append(media); }
      else controls.append(input);
      form.append(row);
    }
    const root = document.createElement('div'); root.className = 'sb-selection-field'; root.id = 'native-address-control';
    root.dataset.sbArticleMedia = JSON.stringify({ group: 'images', role: 'intro' });
    root.dataset.sbField = JSON.stringify({ adapter: 'media', allowedAdapters: ['media'], allowedResourceTypes: ['image'], referenceItems: true, multiple: false, nativeImage: true,
      nativeUsageKeys: ['media.alt', 'media.decorative', 'media.caption', 'media.class'], selectionTarget: 'item', selectionUseData: 'editable', selectionProfile: { 'media.alt': {}, 'media.decorative': {} }, apiBaseUrl: location.origin + '/index.php', csrfToken: 'test' });
    root.innerHTML = '<input type="hidden" data-sb-value><div data-sb-collection></div><p data-sb-error hidden></p>';
    root.querySelector('input').value = JSON.stringify({ version: 1, items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }] });
    form.append(root); document.body.append(form);
    const module = await import('/package/component/media/js/article-media.js');
    module.mountNativeSelection(root);
  });
  const field = page.locator('#native-address-control');
  await field.locator('.resource-selection-path input').waitFor();
  await page.waitForFunction(() => document.querySelector('#native-address-control .resource-selection-path input').value.includes('crop=original'));
  const text = '/explicit/public-image.svg#joomlaImage://local-images/a.png?width=800&height=600&crop=0%2C0%2C800%2C600&ratio=4%3A3&zoom=1.5&unknownPlugin=retained';
  await field.evaluate((root, address) => SmartBrowser.mountSelectionField(root).importAddresses(address, { append: false }), text);
  await page.waitForFunction(expected => document.querySelector('#native-address-fixture input[name="jform[images][image_intro]"]').value === expected, text);
  const portable = await field.evaluate(root => SmartBrowser.mountSelectionField(root).exportAddresses());
  if (!portable.startsWith(text) || !portable.includes('unknownPlugin=retained')) throw Error('Native field metadata/export changed');
  const before = await field.locator('[data-sb-value]').inputValue();
  const rejected = await field.evaluate(async root => { try { await SmartBrowser.mountSelectionField(root).importAddresses('/x#joomlaFile://local-images/a.png', { append: false }); return false; } catch { return true; } });
  if (!rejected || await field.locator('[data-sb-value]').inputValue() !== before) throw Error('Incompatible native format was committed');
  return 'Native Intro Image reads existing URI, preserves SmartCrop/unknown metadata, writes only native format and rejects incompatible imports without mutation.';
}
