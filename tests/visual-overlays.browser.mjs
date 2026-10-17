async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.removeItem('supjx.smartbrowser.collection.view.single-layout'));
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  const control = page.locator('.sb-selection-field').first();
  await control.locator('.resource-info-panel').waitFor();
  await page.evaluate(() => {
    SmartBrowser.SelectionAddress.registerCodec('example.ratio', { encode: data => [['ratio', data.ratio]], decode: parts => ({ value: Object.fromEntries(parts) }) });
    SmartBrowser.SelectionAddress.registerProperty({ key: 'ext.example.crop', type: 'object', address: { name: 'crop', codec: 'example.ratio', alias: 'c' } });
    window.overlayCounts = { mount: 0, update: 0, cleanup: 0 };
    window.removeOverlay = SmartBrowserPicker.registerVisualOverlay({
      id: 'example.test', applies: context => context.resource.type === 'image',
      mount(layer, context) {
        overlayCounts.mount++;
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = 'Overlay test';
        button.onclick = () => {
          context.setMetadata('example.crop', { ratio: '4:3' });
          context.setAddress('images/crop.png');
        };
        layer.append(button);
        return () => { overlayCounts.cleanup++; button.remove(); };
      }, update() { overlayCounts.update++; },
    });
  });
  await control.getByRole('button', { name: 'Overlay test', exact: true }).click();
  const stacking = await control.locator('[data-overlay-id="example.test"]').evaluate(layer => {
    layer.classList.add('is-expanded-overlay');
    const panel = layer.closest('.resource-info-panel');
    const style = getComputedStyle(panel);
    const result = { overflow: style.overflow, zIndex: style.zIndex };
    layer.classList.remove('is-expanded-overlay');
    return result;
  });
  if (stacking.overflow !== 'visible' || Number(stacking.zIndex) < 1050) throw new Error('Expanded overlay remains clipped');
  await page.waitForFunction(() => {
    const usage = JSON.parse(document.querySelector('[data-sb-value]').value).items[0].usage;
    return usage['ext.example.crop']?.ratio === '4:3' && usage['ext.address'] === 'images/crop.png';
  });
  await page.waitForFunction(() => document.querySelector('.resource-selection-path input')?.value.startsWith('images/crop.png#joomlaImage://'));
  const multiple = page.locator('.sb-selection-field').nth(3);
  await multiple.getByRole('button', { name: 'Overlay test', exact: true }).click();
  await multiple.locator('.sb-selection-gallery-nav button').last().click();
  if ((await multiple.locator('.resource-selection-path input').inputValue()).startsWith('images/crop.png#')) throw new Error('Address leaked across active resources');
  await control.getByRole('button', { name: 'Replace', exact: true }).click();
  const picker = page.frameLocator('dialog.smartbrowser-picker iframe');
  await picker.locator('.resource-picker-titlebar').waitFor();
  await picker.locator('.resource-item-title').getByText('First image', { exact: true }).last().click();
  await picker.getByRole('button', { name: 'Overlay test', exact: true }).waitFor();
  if (await picker.locator('.resource-actions').getByRole('button', { name: 'Select', exact: true }).isDisabled()) await picker.locator('.resource-item-title').getByText('First image', { exact: true }).last().click();
  await picker.locator('.resource-actions').getByRole('button', { name: 'Select', exact: true }).click();
  await page.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
  const stored = await control.locator('[data-sb-value]').evaluate(input => JSON.parse(input.value));
  if (stored.items[0].usage['ext.example.crop']?.ratio !== '4:3') throw new Error('Picker lost extension metadata');
  await control.evaluate(element => {
    const media = document.createElement('joomla-field-media');
    media.innerHTML = '<div class="field-media-preview">Native image</div>';
    document.body.append(media);
    SmartBrowser.mountSelectionField(element).attachPreview(media);
  });
  await control.locator('.sb-native-preview-host [data-overlay-id="example.test"]').waitFor();
  await page.evaluate(() => removeOverlay());
  await page.waitForFunction(() => document.querySelectorAll('[data-overlay-id="example.test"]').length === 0);
  const counts = await page.evaluate(() => overlayCounts);
  if (!counts.update || counts.mount !== counts.cleanup) throw new Error('Overlay lifecycle leak');
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  await control.locator('.resource-info-panel').waitFor();
  await page.evaluate(() => {
    window.blockedWrites = 0;
    SmartBrowserPicker.registerVisualOverlay({ id: 'example.readonly', applies: c => c.resource.type === 'image', mount(layer, context) {
      if (!context.isReadOnly) throw new Error('Readonly context missing');
      try { context.setMetadata('example.crop', {}); } catch { blockedWrites++; }
      const badge = document.createElement('span'); badge.textContent = 'Readonly overlay'; layer.append(badge);
    } });
    SmartBrowserPicker.registerPreviewAction({ id: 'example.inspect', allowReadOnly: true, label: 'Inspect image', applies: c => c.resource.type === 'image', run() {} });
    SmartBrowserPicker.registerPreviewAction({ id: 'example.edit', label: 'Edit image', run() {} });
  });
  await control.getByText('Readonly overlay', { exact: true }).waitFor();
  await control.getByRole('button', { name: 'Inspect image', exact: true }).waitFor();
  if (await control.getByRole('button', { name: 'Edit image', exact: true }).count()) throw new Error('Editing action exposed in readonly mode');
  if (!await page.evaluate(() => blockedWrites)) throw new Error('Readonly writes were not blocked');
  return 'Late overlays, updates, metadata/address persistence, Picker roundtrip, native surfaces, cleanup and readonly inspection passed.';
}
