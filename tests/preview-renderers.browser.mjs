async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  const control = page.locator('.sb-selection-field').first();
  await control.locator('.resource-lightweight-visual').waitFor();
  await page.evaluate(() => {
    window.previewCounts = { mount: 0, update: 0, cleanup: 0 };
    window.removeRenderer = SmartBrowserPicker.registerPreviewRenderer({
      id: 'example.site', order: 20, applies: context => context.resource.type === 'image',
      mount(element, context) {
        previewCounts.mount++;
        if (element.closest('.sb-selection-field') === document.querySelector('.sb-selection-field')) window.primaryPreviewContext = context;
        const label = element.ownerDocument.createElement('span'); label.className = 'example-site-preview'; element.append(label);
        const style = element.ownerDocument.createElement('style'); style.textContent = '.example-site-preview { color: rgb(120, 30, 60); }'; element.append(style);
        label.textContent = 'Site preview: ' + (context.values['media.alt'] || context.resource.id);
        return () => { previewCounts.cleanup++; label.remove(); style.remove(); };
      },
      update(element, context) {
        previewCounts.update++;
        element.querySelector('.example-site-preview').textContent = 'Site preview: ' + (context.values['media.alt'] || context.resource.id);
      },
    });
  });
  await control.locator('.example-site-preview').waitFor();
  if (await control.locator('.example-site-preview').evaluate(el => getComputedStyle(el).color) !== 'rgb(120, 30, 60)') throw Error('Renderer styles missing');
  const readonly = await page.evaluate(() => { try { primaryPreviewContext.setMetadata('site.test', 'no'); return false; } catch { return primaryPreviewContext.isReadOnly; } });
  if (!readonly) throw Error('Readonly renderer writes were permitted');
  await control.evaluate(async root => {
    const items = JSON.parse(root.querySelector('[data-sb-value]').value).items;
    items[0].usage['media.alt'] = 'Changed externally';
    await SmartBrowser.mountSelectionField(root).setItems(items);
  });
  await control.getByText('Site preview: Changed externally', { exact: true }).waitFor();
  if (await page.evaluate(() => previewCounts.update) < 1) throw Error('Renderer did not update');
  await control.getByRole('button', { name: 'Replace', exact: true }).click();
  const picker = page.frameLocator('dialog.smartbrowser-picker iframe');
  await picker.locator('.resource-info-panel .example-site-preview').waitFor();
  if (await picker.locator('.example-site-preview').evaluate(el => getComputedStyle(el).color) !== 'rgb(120, 30, 60)') throw Error('Iframe renderer used parent document');
  await picker.getByRole('tab', { name: 'Information', exact: true }).click();
  if (await picker.locator('.resource-info-panel .example-site-preview').count()) throw Error('Renderer replaced Information visual');
  await picker.getByRole('tab', { name: 'Usage options', exact: true }).click();
  await picker.locator('.resource-info-panel .example-site-preview').waitFor();
  await page.evaluate(() => removeRenderer());
  await control.locator('.example-site-preview').waitFor({ state: 'detached' });
  await picker.locator('.resource-info-panel .example-site-preview').waitFor({ state: 'detached' });
  await control.locator('.resource-lightweight-visual .asset-image img').waitFor();
  await control.locator('.resource-lightweight-visual .asset-identity').waitFor();
  if (!await page.evaluate(() => primaryPreviewContext.signal.aborted && previewCounts.cleanup > 0)) throw Error('Renderer callbacks not aborted/cleaned up');
  await picker.locator('.resource-picker-cancel').click();
  await page.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
  await page.evaluate(() => {
    window.removeBrokenRenderer = SmartBrowserPicker.registerPreviewRenderer({ id: 'example.broken', mount(element) { element.textContent = 'Broken content'; throw Error('Expected preview failure'); } });
  });
  await control.locator('.resource-lightweight-visual .asset-image img').waitFor();
  if (await control.getByText('Broken content', { exact: true }).count()) throw Error('Failed renderer content leaked');
  await page.evaluate(() => removeBrokenRenderer());
  await page.setViewportSize({ width: 390, height: 844 });
  await control.screenshot({ path: 'build/preview-renderer-fallback-mobile.png' });
  return 'Late renderer registration, readonly guards, live updates, iframe ownerDocument, Information separation, unregister cleanup, generic image/badge fallback, failure isolation and mobile rendering passed.';
}
