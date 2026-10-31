async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => {
    window.legacyResult = null;
    SmartBrowserPicker.open({ adapter: 'media', multiple: true, resultFormat: 'usage', url: location.origin + '/index.php?longFixture=1' }).then(result => { window.legacyResult = result; });
  });
  const frame = page.frameLocator('dialog.smartbrowser-picker iframe');
  const drawer = frame.locator('.resource-picker-collection');
  await drawer.waitFor();
  await frame.locator('.resource-main > .resource-browser .resource-browser-item').first().click();
  await drawer.locator(':scope > summary').click();
  await drawer.locator('.smartbrowser-collection').waitFor();
  const geometry = await drawer.evaluate(element => {
    const shell = element.parentElement.getBoundingClientRect();
    const results = element.parentElement.querySelector('.resource-main > .resource-browser');
    results.scrollTop = 200;
    return { bottom: element.getBoundingClientRect().bottom, shellBottom: shell.bottom, scroll: results.scrollTop,
      pageOverflow: document.documentElement.scrollHeight > innerHeight + 2 };
  });
  if (Math.abs(geometry.bottom - geometry.shellBottom) > 2 || geometry.pageOverflow || geometry.scroll <= 0) throw Error(JSON.stringify(geometry));
  const remove = drawer.locator('button[title="Remove"]');
  if (await remove.isDisabled()) await drawer.locator('.resource-browser-item').first().click();
  await remove.click();
  await frame.locator('.resource-main > .resource-browser .resource-browser-item.selected').waitFor({ state: 'detached' });
  await frame.locator('.resource-main > .resource-browser .resource-browser-item').first().click();
  await frame.locator('.resource-picker-select').click();
  await page.waitForFunction(() => window.legacyResult !== null);
  const result = await page.evaluate(() => window.legacyResult);
  if (!Array.isArray(result.selection) || result.selection.length !== 1 || result.selection[0].id !== 'local-images:/long-0.png' || !result.usage || result.items) throw Error('Legacy picker result format changed: ' + JSON.stringify(result));
  return 'Legacy usage picker keeps a fixed bottom drawer and its existing selection/usage result format';
}
