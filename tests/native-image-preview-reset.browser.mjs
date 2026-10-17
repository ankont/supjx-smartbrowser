async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'native-address-reset'; document.body.append(target);
    window.nativeReset = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: false, nativeImage: true, selectionUseData: 'editable',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }],
      translate: key => Joomla.Text._(key, key) });
    await nativeReset.ready;
  });
  const reset = page.locator('#native-address-reset .resource-lightweight-preview-action button').filter({ has: page.locator('.fa-times') });
  if (await reset.count()) throw Error('Unchanged native image unexpectedly has reset');
  await page.evaluate(() => nativeReset.setNativeAddress('images/a.png#joomlaImage://local-images/a.png?crop=0,0,400,300'));
  await reset.waitFor();
  await reset.click();
  await page.waitForFunction(() => Boolean(nativeReset.getItems()[0].usage['ext.address']) && !nativeReset.getItems()[0].usage['ext.address'].includes('crop='));
  await reset.waitFor({ state: 'detached' });
  await page.screenshot({ path: 'build/native-image-preview-reset.png', fullPage: true });
  return 'Native image address-only edits show reset and restore the default address without SmartCrop metadata or an attached native preview.';
}
