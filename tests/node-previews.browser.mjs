async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&nodePreviewFixture=1');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'node-preview-control'; document.body.replaceChildren(target);
    window.previewEntry = (adapter, id, usage = {}) => ({ selection: { adapter, id }, usage });
    window.nodePreview = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test',
      selectedResources: true, referenceItems: true, multiple: true, allowedAdapters: ['categories', 'tags', 'menus', 'media'], selectionUseData: 'editable',
      selectionProfile: { 'visual.thumbnailOverride': {}, 'visual.iconOverride': {}, 'visual.presentation': {} },
      viewPreferenceKey: 'node-preview-test', items: [previewEntry('categories', 'category:7')], translate: key => Joomla.Text._(key, key) });
    await nodePreview.ready;
  });
  const control = page.locator('#node-preview-control');
  const image = control.locator('.resource-lightweight-visual .asset-image img');
  for (const [adapter, id, query] of [['categories', 'category:7', '?category'], ['tags', 'tag:2', '?tag'], ['menus', 'menu-item:3', '?menu']]) {
    await page.evaluate(async ([adapter, id]) => nodePreview.setItems([previewEntry(adapter, id)]), [adapter, id]);
    await image.waitFor();
    if (!(await image.getAttribute('src')).endsWith(query)) throw Error(`Native node image missing: ${id}`);
    if (await control.locator('.resource-preview-empty').count()) throw Error('Node image replaced by unavailable message');
  }
  await page.evaluate(() => nodePreview.setItems([previewEntry('menus', 'menu-item:4')]));
  await control.locator('.resource-lightweight-visual .asset-identity .fa-heart').waitFor();
  await control.locator('.resource-lightweight-visual .asset-base .fa-folder').waitFor();
  await page.evaluate(() => nodePreview.setItems([previewEntry('menus', 'menu-item:4', { 'visual.iconOverride': 'fas fa-star' })]));
  await control.locator('.resource-lightweight-visual .asset-identity .fa-star').waitFor();
  await page.evaluate(() => nodePreview.setItems([previewEntry('menus', 'menu-item:4', { 'visual.thumbnailOverride': { adapter: 'media', id: 'local-images:/a.png' } })]));
  await image.waitFor();
  if (await image.getAttribute('src') !== '/resources/images/visual-example.svg') throw Error('Thumbnail override did not replace node icon');
  await page.evaluate(() => nodePreview.setItems([previewEntry('categories', 'category:7', { 'visual.presentation': 'icon', 'visual.iconOverride': 'fas fa-star' })]));
  await control.locator('.resource-lightweight-visual .asset-base .fa-star').waitFor();
  if (await image.count()) throw Error('Icon presentation still displays native image');
  await page.screenshot({ path: 'build/node-preview-icon.png' });
  await page.evaluate(() => nodePreview.setItems([previewEntry('tags', 'tag:2')]));
  await image.waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'build/node-preview-mobile.png' });
  return 'Category/tag/menu images, menu icon fallback, thumbnail/icon overrides, icon presentation and desktop/mobile previews passed.';
}
