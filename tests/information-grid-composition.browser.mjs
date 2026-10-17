async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto('http://127.0.0.1:8791?view=browser&nodePreviewFixture=1&nodeInformationFixture=1');
  const toolbar = page.locator('.resource-toolbar').first();
  await toolbar.getByRole('button', { name: 'Grid', exact: true }).click();
  if (!await page.locator('.resource-info-panel').count()) await toolbar.getByRole('button', { name: 'Toggle information', exact: true }).click();
  await page.evaluate(() => {
    window.sitePreviewMounts = 0;
    SmartBrowserPicker.registerPreviewRenderer({ id: 'example.not-information', mount() { sitePreviewMounts++; } });
  });
  const layers = async visual => visual.evaluate(el => {
    const parent = el.getBoundingClientRect();
    return [...el.querySelectorAll('.resource-visual-layer')].map(layer => {
      const rect = layer.getBoundingClientRect();
      return { classes: layer.className, icon: layer.querySelector('[data-visual-icon]')?.dataset.visualIcon || '', color: getComputedStyle(layer).color, image: layer.querySelector('img')?.getAttribute('src') || '',
        x: (rect.x - parent.x) / parent.width, y: (rect.y - parent.y) / parent.height, width: rect.width / parent.width, height: rect.height / parent.height };
    });
  });
  for (const title of ['category:7', 'menu-item:4']) {
    const card = page.locator('.resource-main .resource-browser-item').filter({ has: page.locator('.resource-item-title', { hasText: title }) });
    await card.locator('.resource-item-title').click();
    const info = page.locator('.resource-info-panel');
    await info.getByRole('heading', { name: title, exact: true }).waitFor();
    const surface = info.locator('.is-information-visual');
    const visual = surface.locator('.resource-visual-content');
    await visual.waitFor();
    const geometry = await surface.evaluate(el => ({ height: el.getBoundingClientRect().height, bottom: el.getBoundingClientRect().bottom, next: el.closest('.resource-info-panel').querySelector('h3').getBoundingClientRect().top }));
    if (geometry.height < 175 || geometry.bottom > geometry.next + 1) throw Error('Information visual collapsed or overlaps metadata');
    const expected = await layers(card.locator('.resource-visual-content'));
    const actual = await layers(visual);
    if (expected.length !== actual.length) throw Error('Information uses different layers');
    for (let i = 0; i < expected.length; i++) {
      for (const field of ['classes', 'icon', 'image', 'color']) if (expected[i][field] !== actual[i][field]) throw Error(`Information changed ${field}`);
      for (const field of ['x', 'y', 'width', 'height']) if (Math.abs(expected[i][field] - actual[i][field]) > .02) throw Error(`Information changed ${field} composition`);
    }
    if (await info.locator('[role="tablist"]').count()) throw Error('Fixture unexpectedly has Selection Usage tabs');
  }
  if (await page.evaluate(() => sitePreviewMounts) !== 0) throw Error('Site Preview renderer ran on Information');
  await page.screenshot({ path: 'build/information-grid-composition.png' });
  await page.locator('.resource-main .resource-item-title').getByText('First image', { exact: true }).click();
  await page.locator('.resource-info-panel').getByRole('heading', { name: 'First image', exact: true }).waitFor();
  const imageSurface = page.locator('.resource-info-panel .is-information-visual');
  await page.waitForFunction(() => document.querySelector('.resource-info-panel .is-information-visual')?.getBoundingClientRect().height > 40);
  const imageGeometry = await imageSurface.evaluate(el => ({ height: el.getBoundingClientRect().height, bottom: el.getBoundingClientRect().bottom, next: el.closest('.resource-info-panel').querySelector('h3').getBoundingClientRect().top }));
  if (imageGeometry.height < 40 || imageGeometry.bottom > imageGeometry.next + 1) throw Error('Adaptive image Information collapsed or overlaps metadata');
  return 'Information without Usage tabs matches Grid layers, icons, images and normalized positions; no collapsed surface, metadata overlap or site Preview renderer.';
}
