async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection && SmartBrowserPicker.registerImagePresentation);
  await page.evaluate(async () => {
    window.presentationCounts = { applied: 0, cleaned: 0, notified: 0 };
    const target = document.createElement('div'); target.id = 'presentation-host'; document.body.append(target);
    window.presentationCollection = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: false, selectionUseData: 'editable',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.effect': true } }] });
    await presentationCollection.ready;
    window.unregisterPresentation = SmartBrowserPicker.registerImagePresentation({ id: 'example.filter', styles: ['filter'],
      applies: context => context.values['ext.example.effect'] === true,
      hasChanges: context => context.getMetadata('example.effect') === true,
      reset: context => context.setMetadata('example.effect', null),
      apply(image, context) {
        presentationCounts.applied++; window.presentationContext = context;
        image.style.filter = 'grayscale(1)';
        context.notifyPresentationChange({ reason: 'appearance', extensionValue: 42 });
        return () => presentationCounts.cleaned++;
      } });
  });
  const host = page.locator('#presentation-host');
  await page.waitForFunction(() => document.querySelector('#presentation-host .resource-lightweight-visual .resource-visual-image')?.style.filter === 'grayscale(1)');
  if (await host.locator('.resource-browser-item img, .resource-details-view img').evaluateAll(images => images.some(image => Boolean(image.style.filter)))) throw Error('Preview provider affected grid/list images');
  const original = await page.evaluate(() => JSON.stringify(presentationCollection.getItems()));
  await page.evaluate(() => {
    window.unregisterRenderer = SmartBrowserPicker.registerPreviewRenderer({ id: 'example.frame', applies: () => true,
      mount(layer, context) {
        const frame = document.createElement('figure'), image = document.createElement('img'), pin = document.createElement('b');
        frame.className = 'example-frame'; pin.className = 'example-pin'; pin.textContent = 'Pin';
        image.src = context.imageUrl; image.style.opacity = '.9'; frame.append(image, pin); layer.append(frame);
        const release = context.setImageElement(image, { onPresentationChange(detail) { if (detail.reason) presentationCounts.notified++; } });
        return () => { release(); frame.remove(); };
      } });
  });
  await page.waitForFunction(() => document.querySelector('#presentation-host .example-frame img')?.style.filter === 'grayscale(1)');
  if (!await host.locator('.example-pin').isVisible()) throw Error('Renderer pin was lost');
  if (await page.evaluate(() => JSON.stringify(presentationCollection.getItems())) !== original) throw Error('Presentation changed storage');
  await page.evaluate(async () => {
    window.oldPresentationContext = presentationContext;
    await presentationCollection.setItems([{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.effect': true, 'ext.example.other': 1 } }]);
  });
  await page.waitForFunction(() => oldPresentationContext.signal.aborted && document.querySelector('#presentation-host .example-frame img')?.style.filter === 'grayscale(1)');
  await page.evaluate(() => unregisterRenderer());
  await page.waitForFunction(() => !document.querySelector('#presentation-host .example-frame') && document.querySelector('#presentation-host .resource-lightweight-visual .resource-visual-image')?.style.filter === 'grayscale(1)');
  await host.locator('.resource-lightweight-preview-action button').filter({ has: page.locator('.fa-times') }).click();
  await page.waitForFunction(() => !document.querySelector('#presentation-host .resource-lightweight-visual .resource-visual-image')?.style.filter);
  if (await page.evaluate(() => presentationCollection.getItems()[0].usage['ext.example.effect']) !== null) throw Error('Provider reset did not run');
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'readonly-presentation'; document.body.append(target);
    window.readonlyPresentation = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: false, selectionUseData: 'readonly',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.effect': true } }] });
    await readonlyPresentation.ready;
  });
  await page.waitForFunction(() => document.querySelector('#readonly-presentation .resource-lightweight-visual .resource-visual-image')?.style.filter === 'grayscale(1)');
  if (await page.evaluate(() => { try { presentationContext.setMetadata('example.effect', null); return true; } catch { return false; } })) throw Error('Readonly presentation wrote usage');
  await page.evaluate(async () => {
    const native = document.createElement('div'), image = document.createElement('img'), target = document.createElement('div');
    target.id = 'attached-image-presentation'; native.id = 'native-owned-image'; image.src = '/resources/images/visual-example.svg';
    native.append(image); document.body.append(native, target);
    window.attachedPresentation = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: false, selectionUseData: 'readonly',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.effect': true } }] });
    await attachedPresentation.ready; attachedPresentation.attachPreview(native);
  });
  await page.waitForFunction(() => document.querySelector('#native-owned-image img')?.style.filter === 'grayscale(1)');
  await page.evaluate(() => {
    window.previousNativeImage = document.querySelector('#native-owned-image img');
    const image = document.createElement('img'); image.src = '/resources/images/visual-example.svg?replacement';
    previousNativeImage.replaceWith(image);
  });
  await page.waitForFunction(() => document.querySelector('#native-owned-image img')?.style.filter === 'grayscale(1)' && !previousNativeImage.style.filter);
  await page.screenshot({ path: 'build/image-presentation-contract.png', fullPage: true });
  await page.evaluate(() => { unregisterPresentation(); presentationCollection.destroy(); readonlyPresentation.destroy(); attachedPresentation.destroy(); });
  const counts = await page.evaluate(() => presentationCounts);
  if (counts.applied !== counts.cleaned || !counts.notified) throw Error('Presentation cleanup or layout notification failed: ' + JSON.stringify(counts));
  return 'Native fallback, custom frame/pin, late registry, updates, reset, readonly and cleanup passed.';
}
