async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  const field = page.locator('.sb-selection-field').nth(3);
  await field.locator('.sb-selection-gallery-nav button').last().click();
  const original = await field.locator('[data-sb-value]').inputValue();
  await field.getByRole('button', { name: 'Replace', exact: true }).click();
  const picker = page.frameLocator('dialog.smartbrowser-picker iframe');
  await picker.locator('.resource-picker-collection').waitFor();
  const title = picker.locator('.resource-info-panel h3');
  await title.getByText('First image', { exact: true }).waitFor();
  if (!(await picker.locator('.resource-picker-collection > summary').innerText()).includes('2')) throw Error('Replace did not load all selected items');
  await picker.locator('.resource-actions').getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
  if (await field.locator('[data-sb-value]').inputValue() !== original) throw Error('Cancelling edit changed the selection');
  await field.locator('.sb-preview-selection-actions').getByRole('button', { name: 'Add', exact: true }).click();
  await picker.locator('.resource-picker-collection > summary').waitFor();
  if (!(await picker.locator('.resource-picker-collection > summary').innerText()).includes('0')) throw Error('Add Picker restored previous selections');
  if (await picker.locator('.resource-browser-item.selected, .resource-details-view tbody tr.selected').count()) throw Error('Add Picker has old resources checked');
  await picker.locator('.resource-actions').getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
  await page.evaluate(() => {
    window.originalPickerOpen = SmartBrowserPicker.open;
    SmartBrowserPicker.open = async options => {
      window.addOptions = options;
      return { items: [
        { selection: { adapter: 'media', id: 'local-images:/b.png' }, usage: { 'media.alt': 'Do not overwrite' } },
        { selection: { adapter: 'media', id: 'local-images:/report.pdf' }, usage: {} },
      ] };
    };
  });
  await field.locator('.sb-preview-selection-actions').getByRole('button', { name: 'Add', exact: true }).click();
  await page.waitForFunction(() => JSON.parse(document.querySelectorAll('.sb-selection-field')[3].querySelector('[data-sb-value]').value).items.length === 3);
  const result = JSON.parse(await field.locator('[data-sb-value]').inputValue());
  const previous = JSON.parse(original);
  if (JSON.stringify(result.items.slice(0, 2)) !== JSON.stringify(previous.items)) throw Error('Add modified existing entries');
  const options = await page.evaluate(() => ({ count: addOptions.initialCollection.length, multiple: addOptions.multiple, focus: addOptions.initialFocus }));
  if (options.count || !options.multiple || options.focus) throw Error('Add should open empty without a focused old resource');
  await page.evaluate(() => { SmartBrowserPicker.open = originalPickerOpen; });
  return 'Replace opens all selected items with Information focused on the current item; cancel is safe; Add appends new identities without modifying originals.';
}
