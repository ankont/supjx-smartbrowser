async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  await page.evaluate(async () => {
    localStorage.clear();
    const target = document.createElement('div');
    target.id = 'secondary-test'; document.body.replaceChildren(target);
    window.secondaryCollection = SmartBrowser.mountCollection(target, {
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectedResources: true, referenceItems: true,
      multiple: true, allowedAdapters: ['articles', 'media'], selectionUseData: 'editable',
      selectionProfile: { 'visual.presentation': { presentation: 'secondary' }, 'visual.iconOverride': { presentation: 'secondary' } }, viewPreferenceKey: 'secondary-test',
      items: [
        { selection: { adapter: 'articles', id: 'article:1' }, usage: { 'visual.presentation': 'both' } },
        { selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} },
      ], translate: key => Joomla.Text._(key, key),
    });
    await secondaryCollection.ready;
  });
  const root = page.locator('#secondary-test');
  const details = root.locator('.resource-usage-secondary');
  const summary = details.locator('summary');
  await summary.click();
  await page.waitForFunction(() => document.querySelector('.resource-usage-secondary').open);
  const arrow = summary.locator('.resource-usage-secondary-chevron');
  if (await arrow.evaluate(el => getComputedStyle(el).transform) === 'none') throw Error('Open disclosure has no rotated indicator');
  await root.locator('.sb-selection-gallery-nav button').last().click();
  if (!await details.evaluate(el => el.open)) throw Error('Disclosure closed when switching resources');
  await summary.click();
  await page.waitForFunction(() => !document.querySelector('.resource-usage-secondary').open);
  await root.locator('.sb-selection-gallery-nav button').first().click();
  if (await details.evaluate(el => el.open)) throw Error('Closed disclosure reopened when switching resources');
  await root.locator('.sb-collection-count-toggle').click();
  await root.getByRole('button', { name: 'Grid', exact: true }).click();
  const card = root.locator('.resource-browser-item').first();
  await card.locator('.asset-image img').waitFor();
  const order = await card.evaluate(el => ({
    badge: Number(getComputedStyle(el.querySelector('.asset-base')).zIndex),
    image: Number(getComputedStyle(el.querySelector('.asset-image')).zIndex),
  }));
  if (!(order.badge > order.image)) throw Error(`Badge is behind thumbnail: ${JSON.stringify(order)}`);
  await page.screenshot({ path: 'build/selection-secondary-options.png' });
  return 'Disclosure indicator, open/closed state across resource switches and badge-above-image stacking passed.';
}
