async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable&presentationFixture=1');
  const field = page.locator('.sb-selection-field').nth(2);
  await field.locator('.sb-collection-count-toggle').click();
  await field.getByRole('button', { name: 'Grid', exact: true }).click();
  await field.getByLabel('Icon', { exact: true }).fill('fas fa-star');
  const snapshot = locator => locator.locator('.resource-visual-layer').evaluateAll(layers => layers.map(layer => ({
    classes: layer.className, icon: layer.querySelector('[data-visual-icon]')?.dataset.visualIcon,
    image: layer.querySelector('img')?.getAttribute('src'),
  })));
  for (const mode of ['', 'icon', 'thumbnail', 'both']) {
    await field.getByLabel('Visual presentation', { exact: true }).selectOption(mode);
    await page.waitForTimeout(100);
    const grid = await snapshot(field.locator('.resource-browser-item').first());
    const preview = await snapshot(field.locator('.resource-lightweight-visual'));
    if (!grid.length || JSON.stringify(grid) !== JSON.stringify(preview)) throw Error(`Preview/grid mismatch for ${mode || 'default'}`);
  }
  await page.evaluate(() => {
    window.previewContexts = [];
    SmartBrowserPicker.registerPreviewRenderer({ id: 'test.composition', applies: context => context.resource.type === 'article',
      mount(element, context) { element.textContent = 'Site composition'; previewContexts.push(context.visuals); },
      update(element, context) { previewContexts.push(context.visuals); },
    });
  });
  await field.getByText('Site composition', { exact: true }).waitFor();
  await field.getByLabel('Visual presentation', { exact: true }).selectOption('icon');
  await page.waitForFunction(() => previewContexts.at(-1)?.presentation === 'icon' && previewContexts.at(-1)?.image === '');
  await field.getByLabel('Visual presentation', { exact: true }).selectOption('thumbnail');
  await page.waitForFunction(() => previewContexts.at(-1)?.presentation === 'thumbnail' && previewContexts.at(-1)?.icon === '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'build/selection-preview-composition-mobile.png' });
  await page.evaluate(() => SmartBrowserPicker.unregisterPreviewRenderer('test.composition'));
  await field.locator('.resource-lightweight-visual .resource-visual-image').waitFor();
  return 'Grid/preview compositions match in all four modes; late site renderer, effective mode updates and unregister fallback passed.';
}
