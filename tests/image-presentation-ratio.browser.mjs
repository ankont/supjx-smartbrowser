async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'ratio-host'; document.body.append(target);
    window.ratioCollection = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: false, selectionUseData: 'editable',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }] });
    await ratioCollection.ready; window.ratioApplications = 0;
  });
  const image = page.locator('#ratio-host .resource-lightweight-visual .asset-image img');
  await image.waitFor();
  await image.evaluate(image => image.decode());
  const geometry = () => image.evaluate(image => {
    const box = image.parentElement.getBoundingClientRect();
    return { ratio: box.width / box.height, natural: image.naturalWidth / image.naturalHeight };
  });
  const baseline = await geometry();
  await page.evaluate(async () => {
    window.removeRatioProvider = SmartBrowserPicker.registerImagePresentation({ id: 'example.ratio', styles: ['aspect-ratio'],
      applies: context => Boolean(context.getMetadata('example.ratio')),
      hasChanges: context => Boolean(context.getMetadata('example.ratio')),
      reset: context => context.setMetadata('example.ratio', null),
      apply(image, context) {
        window.liveRatioContext = context;
        ratioApplications++; image.style.setProperty('aspect-ratio', context.getMetadata('example.ratio'));
        context.notifyPresentationChange({ reason: 'image-style' });
      } });
    await ratioCollection.setItems([{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.ratio': '16 / 9' } }]);
  });
  await page.waitForFunction(() => {
    const image = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image img');
    const box = image.parentElement.getBoundingClientRect(); return Math.abs(box.width / box.height - 16 / 9) < .02;
  });
  const applications = await page.evaluate(() => ratioApplications);
  await page.evaluate(() => {
    liveRatioContext.imageElement.style.setProperty('aspect-ratio', '4 / 3');
    liveRatioContext.notifyPresentationChange({ reason: 'style-updated' });
  });
  await page.waitForFunction(() => {
    const box = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image').getBoundingClientRect();
    return Math.abs(box.width / box.height - 4 / 3) < .02;
  });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  if (await page.evaluate(() => ratioApplications) !== applications) throw Error('Geometry triggered a provider feedback loop');
  await page.locator('#ratio-host .resource-lightweight-preview-action button').filter({ has: page.locator('.fa-times') }).click();
  await page.waitForFunction(expected => {
    const image = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image img'); const box = image.parentElement.getBoundingClientRect();
    return !image.style.aspectRatio && Math.abs(box.width / box.height - expected) < .02;
  }, baseline.ratio);
  await page.evaluate(async () => {
    await ratioCollection.setItems([{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: { 'ext.example.ratio': '1 / 2' } }]);
  });
  await page.waitForFunction(() => {
    const box = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image').getBoundingClientRect();
    return Math.abs(box.width / box.height - .5) < .02;
  });
  await page.evaluate(async () => { await ratioCollection.setItems([{ selection: { adapter: 'media', id: 'local-images:/b.png' }, usage: {} }]); });
  await page.waitForFunction(expected => {
    const image = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image img'), box = image.parentElement.getBoundingClientRect();
    return !image.style.aspectRatio && Math.abs(box.width / box.height - expected) < .02;
  }, baseline.ratio);
  await page.evaluate(async () => { await ratioCollection.setItems([{ selection: { adapter: 'media', id: 'local-images:/b.png' }, usage: { 'ext.example.ratio': '3 / 1' } }]); });
  await page.waitForFunction(() => {
    const image = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image img'), box = image.parentElement.getBoundingClientRect(); return Math.abs(box.width / box.height - 3) < .02;
  });
  await page.evaluate(() => removeRatioProvider());
  await page.waitForFunction(expected => {
    const image = document.querySelector('#ratio-host .resource-lightweight-visual .asset-image img'), box = image.parentElement.getBoundingClientRect();
    return !image.style.aspectRatio && Math.abs(box.width / box.height - expected) < .02;
  }, baseline.ratio);
  await page.screenshot({ path: 'build/image-presentation-ratio.png', fullPage: true });
  await page.evaluate(() => ratioCollection.destroy());
  return 'Declared CSS ratio overrides natural viewport ratio; reset, resource change and unregister restore fallback; no provider reapplication loop.';
}
