async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => sessionStorage.clear());
  await page.waitForFunction(() => window.SmartBrowserPicker?.registerVisualOverlay);
  await page.evaluate(() => {
    SmartBrowserPicker.registerImagePresentation({ id: 'example.picker-effect', styles: ['filter'],
      applies: context => context.getAddress().includes('crop='),
      apply(image) { image.style.filter = 'grayscale(1)'; } });
    SmartBrowserPicker.registerVisualOverlay({ id: 'example.address-reset', mount(layer, context) { window.pickerPreview = context; } });
    SmartBrowserPicker.open({ url: location.origin + '/index.php?pickerAddressFixture=1', adapter: 'media', multiple: false,
      resultFormat: 'collection', selectionProfile: {}, initialInfoOpen: true,
      initialFocus: { adapter: 'media', id: 'local-images:/a.png' },
      initialCollection: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }] });
  });
  const picker = page.frameLocator('dialog.smartbrowser-picker iframe');
  await picker.locator('.resource-info-panel h3').getByText('First image', { exact: true }).waitFor();
  await picker.getByRole('tab', { name: 'Usage options', exact: true }).waitFor();
  const reset = picker.locator('.resource-info-panel .resource-lightweight-preview-action button').filter({ has: picker.locator('.fa-times') });
  if (await reset.count()) throw Error('Unchanged image has reset');
  await page.waitForFunction(() => window.pickerPreview);
  await page.evaluate(() => pickerPreview.setAddress('images/a.png#joomlaImage://local-images/a.png?crop=0%2C0%2C400%2C300'));
  await reset.waitFor();
  await picker.locator('.resource-info-panel .resource-visual-image[style*="grayscale"]').waitFor();
  await picker.getByRole('tab', { name: 'Information', exact: true }).click();
  if (await reset.count()) throw Error('Information must not expose reset');
  if (await picker.locator('.resource-info-panel .resource-visual-image[style*="grayscale"]').count()) throw Error('Information inherited provider presentation');
  if (await picker.locator('.resource-info-panel .resource-visual-overlay-layer').count()) throw Error('Information must not mount usage overlays');
  await picker.getByRole('tab', { name: 'Usage options', exact: true }).click();
  await reset.waitFor();
  await picker.getByRole('button', { name: 'List', exact: true }).click();
  if (await picker.locator('th.resource-column-selectionAddress').count()) throw Error('Address column should be hidden by default');
  await picker.locator('main .resource-column-picker > button').click();
  await picker.locator('main .resource-column-choice').filter({ hasText: 'URI' }).getByRole('checkbox').check();
  await picker.locator('main .resource-column-picker > button').click();
  await picker.locator('td.resource-column-selectionAddress').filter({ hasText: 'crop=' }).waitFor();
  await reset.click();
  await reset.waitFor({ state: 'detached' });
  if (!await page.evaluate(() => pickerPreview.getAddress() === pickerPreview.getDefaultAddress())) throw Error('Reset did not restore default address');
  await picker.locator('td.resource-column-selectionAddress').filter({ hasText: 'crop=' }).waitFor({ state: 'detached' });
  await page.screenshot({ path: 'build/picker-address-reset.png', fullPage: true });
  await picker.locator('.resource-actions').getByRole('button', { name: 'Cancel', exact: true }).click();
  return 'Picker exposes Selection Usage for address-only crops; Information stays unmodified; reset and the optional Address column track usage changes.';
}
