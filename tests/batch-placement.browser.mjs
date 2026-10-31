async page => {
  for (const [adapter, label, choice] of [
    ['menus', 'COM_SMARTBROWSER_BATCH_MENU_PLACEMENT', 'Main menu'],
    ['articles', 'COM_SMARTBROWSER_BATCH_CATEGORY_PLACEMENT', 'Category seven'],
  ]) {
    await page.goto(`http://127.0.0.1:8791?view=browser&adapter=${adapter}&multiple=1&batchFixture=1`);
    await page.locator('.resource-browser-item').first().click();
    await page.locator('.resource-batch-toggle').click();
    await page.getByText(label, { exact: true }).click();
    const select = page.locator('joomla-field-fancy-select').last();
    if (await select.locator('select').isDisabled()) throw Error('Placement select disabled');
    await select.evaluate(el => {
      el.dataset.forwardedClicks = '0';
      el.querySelector('select').addEventListener('click', () => el.dataset.forwardedClicks = String(Number(el.dataset.forwardedClicks) + 1));
    });
    await select.locator('.choices__inner').click();
    const search = select.locator('input[type="search"]');
    await search.click();
    await search.pressSequentially(choice);
    if (!await search.evaluate(el => el === document.activeElement)) throw Error('Mouse cannot focus destination search');
    await select.locator('[data-choice-selectable]').getByText(choice, { exact: true }).click();
    const value = await select.locator('select').inputValue();
    if (!value) throw Error('Placement selection did not update');
    if (await select.getAttribute('data-forwarded-clicks') !== '0') throw Error('Label forwarded a duplicate click to the hidden native select');
  }
  return 'Menu and category placement selects are enabled and selectable';
}
