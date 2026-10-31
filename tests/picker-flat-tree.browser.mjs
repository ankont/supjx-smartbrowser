async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791?view=browser&flatTreeFixture=1');
  await page.locator('.resource-sidebar-handle').waitFor();
  check(await page.locator('.resource-sidebar').count() === 0, 'Flat tree must start collapsed');
  check((await page.locator('.sb-browser-title').innerText()).trim() === 'Select — Files & Media', 'Picker adapter title');
  check(await page.locator('.sb-browser-heading-leading .resource-picker-select').count() === 1, 'Select must precede title');
  check(await page.locator('.resource-actions .resource-picker-select, .resource-actions .resource-picker-cancel').count() === 0, 'Duplicate picker controls');
  await page.locator('.resource-sidebar-handle').click();
  await page.getByRole('button', { name: 'Child folder', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Files', exact: true }).click();
  await page.waitForURL(url => url.searchParams.get('flatFromNode') === 'local-files:/');
  check(new URL(page.url()).searchParams.get('adapter') === 'flat-media', 'Changing top-level must retain flat view');
  check(await page.locator('.resource-sidebar').count() === 0, 'Tree must start collapsed after navigation');
  await page.goto('http://127.0.0.1:8791');
  await page.locator('#legacy').click();
  const picker = page.frameLocator('.smartbrowser-picker iframe');
  await picker.locator('.sb-heading-controls .resource-picker-cancel').waitFor();
  check(await picker.locator('.resource-actions .resource-picker-cancel').count() === 0, 'Cancel must be in first row');
  await picker.locator('.resource-picker-cancel').click();
  await page.evaluate(() => sessionStorage.clear());
  return 'Flat tree expansion, top-level switching, picker heading and controls passed';
}
