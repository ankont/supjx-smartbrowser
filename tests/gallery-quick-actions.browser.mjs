async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.removeItem('supjx.smartbrowser.collection.view.multiple-layout'));
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  const control = page.locator('.sb-selection-field').nth(3);
  await control.locator('.sb-selection-gallery-nav').waitFor();
  const stored = () => control.locator('[data-sb-value]').inputValue();
  const before = await stored();
  await control.locator('.sb-selection-gallery-nav button').last().click();
  if (before !== await stored()) throw new Error('Gallery navigation changed selection storage');
  if (await control.locator('.sb-preview-selection-actions button').count() !== 5) throw new Error('Incomplete quick toolbar');
  await control.locator('.sb-preview-selection-actions button').first().click();
  await page.waitForFunction(previous => document.querySelectorAll('.sb-selection-field')[3].querySelector('[data-sb-value]').value !== previous, before);
  const position = await control.locator('.sb-selection-gallery-nav').evaluate(element => getComputedStyle(element).position);
  if (position !== 'absolute') throw new Error('Gallery navigation consumes layout height');
  return 'Gallery navigation preserves storage; quick ordering and five-button toolbar work without extra height.';
}
