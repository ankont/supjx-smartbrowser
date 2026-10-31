async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8791?view=browser&frontendFixture=1');
  const label = page.locator('.resource-flat-toggle .resource-action-label');
  await label.waitFor({ state: 'visible' });
  await page.setViewportSize({ width: 520, height: 800 });
  await label.waitFor({ state: 'hidden' });
  if (!await page.locator('.resource-flat-toggle').getAttribute('title')) throw Error('Icon-only control lost its tooltip');
  await page.setViewportSize({ width: 1440, height: 900 });
  await label.waitFor({ state: 'visible' });
  return 'Frontend Flat View label follows available toolbar space, preserving the icon tooltip';
}
