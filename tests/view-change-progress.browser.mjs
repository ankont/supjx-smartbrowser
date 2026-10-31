async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791?view=browser&longFixture=1&nativeToolbar=1');
  await page.locator('.resource-browser-item').nth(119).waitFor({ state: 'attached' });
  await page.evaluate(() => {
    window.viewProgress = 0;
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType === 1 && node.matches('.resource-loader')) viewProgress++;
      }
    }).observe(document.querySelector('.resource-main > .resource-browser'), { childList: true });
  });
  const toolbar = page.locator('.resource-main > .resource-toolbar');
  for (const [icon, view] of [['fa-list', '.resource-details-view'], ['fa-th', '.resource-browser-grid']]) {
    const previous = await page.evaluate(() => viewProgress);
    await toolbar.locator(`button:has(> .${icon})`).click();
    await page.locator(view).waitFor();
    if (await page.evaluate(() => viewProgress) <= previous) throw Error('View changed without painting loading status');
  }
  return 'Large list/grid transitions insert loading status in both directions';
}
