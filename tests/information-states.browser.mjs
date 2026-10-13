async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.removeItem('supjx.smartbrowser.collection.view.single-layout'));
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  const control = page.locator('.sb-selection-field').first();
  await control.locator('.sb-collection-count-toggle').click();
  const button = control.getByRole('button', { name: 'Information', exact: true });
  const check = async state => {
    if (await button.getAttribute('data-info-state') !== state) throw new Error(`Expected ${state}`);
    if (await control.locator('.sb-selected-panel').isVisible() !== (state !== 'hidden')) throw new Error('Incorrect panel visibility');
  };
  await check('vertical');
  await button.click(); await check('side');
  await control.locator('.panel-right').waitFor();
  await button.click(); await check('hidden');
  await page.reload(); await check('hidden');
  await control.locator('.sb-collection-count-toggle').click();
  if (!await control.locator('.sb-selected-panel').isVisible()) throw new Error('Collapsed list must reveal Information');
  await control.locator('.panel-top').waitFor();
  await control.locator('.sb-collection-count-toggle').click();
  await check('vertical');
  await page.reload(); await check('vertical');
  await button.click(); await check('side');
  await control.locator('.panel-right').waitFor();
  await button.click(); await check('hidden');
  await button.click(); await check('vertical');
  await control.locator('.panel-top').waitFor();
  if (!await button.evaluate(element => element.classList.contains('info-vertical'))) throw new Error('Missing vertical visual state');
  return 'Three-state cycle, visibility, top/side positioning, distinct vertical style and persisted hidden state passed.';
}
