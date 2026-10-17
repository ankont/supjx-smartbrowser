async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  const field = page.locator('.sb-selection-field').nth(3);
  await field.locator('.sb-collection-count-toggle').click();
  await field.getByRole('button', { name: 'Grid', exact: true }).click();
  const cards = field.locator('.resource-browser-item');
  await cards.first().locator('.resource-item-menu-toggle').click();
  const menu = cards.first().locator('.resource-item-menu');
  for (const id of ['collectionRemove', 'collectionReplace', 'collectionMoveUp', 'collectionMoveDown', 'collectionCopy', 'collectionImport']) {
    if (await menu.locator(`.resource-action-${id}`).count() !== 1) throw new Error(`Missing context command ${id}`);
  }
  if (await menu.locator('.resource-action-collectionAdd').count()) throw new Error('Add does not belong to the item context menu');
  if (!await menu.locator('.resource-action-collectionMoveUp').isDisabled()) throw new Error('First item can move up');
  if (await menu.locator('.resource-action-collectionMoveDown').isDisabled()) throw new Error('First item cannot move down');
  const before = await field.locator('[data-sb-value]').inputValue();
  await menu.locator('.resource-action-collectionMoveDown').click();
  await page.waitForFunction(previous => document.querySelectorAll('.sb-selection-field')[3].querySelector('[data-sb-value]').value !== previous, before);
  await cards.first().locator('.resource-item-menu-toggle').click();
  if (await cards.first().locator('.resource-action-collectionSort').count()) throw new Error('Ordering sort should stay in the toolbar');
  return 'Selection context menu exposes essential toolbar operations and respects move boundaries.';
}
