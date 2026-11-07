async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.locator('#pdf').click();
  const parent = page.frameLocator('dialog.smartbrowser-picker iframe');
  await parent.getByRole('button', { name: 'Change thumbnail', exact: true }).click();
  const nested = parent.frameLocator('dialog.smartbrowser-picker iframe');
  await nested.locator('.resource-main > .resource-toolbar').getByRole('button', { name: 'List', exact: true }).click();
  await nested.locator('.resource-details-view tbody tr').filter({ hasText: 'First image' }).dblclick();
  await parent.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
  await parent.getByRole('button', { name: 'Change thumbnail', exact: true }).click();
  await nested.locator('.resource-main > .resource-browser > .resource-details-view').waitFor();
  check((await nested.locator('.resource-main > .resource-toolbar').getByRole('button', { name: 'List', exact: true }).getAttribute('class')).split(' ').includes('active'), 'Nested thumbnail Picker forgot List');
  check((await parent.locator('.resource-main > .resource-toolbar').locator('button[title="Grid"]').getAttribute('class')).split(' ').includes('active'), 'Thumbnail preference leaked into parent Picker');
  await nested.locator('.resource-picker-cancel').click();
  await parent.locator('.resource-picker-cancel').click();
  await page.evaluate(() => { void SmartBrowserPicker.open({ adapter: 'media', viewPreferenceKey: 'supjx.smartbrowser.thumbnail', defaultView: 'grid' }); });
  await parent.locator('.resource-main > .resource-toolbar').getByRole('button', { name: 'Grid', exact: true }).waitFor();
  check((await parent.locator('.resource-main > .resource-toolbar').locator('button[title="Grid"]').getAttribute('class')).split(' ').includes('active'), 'Explicit caller default was not respected');
  await parent.locator('.resource-picker-cancel').click();
  return 'Nested thumbnail List survives reopening, parent state stays isolated, and explicit caller defaults retain precedence';
}
