async page => {
  for (const width of [1280, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  const field = page.locator('.sb-selection-field').nth(3);
  await field.locator('.smartbrowser-collection').waitFor();
  await field.evaluate(element => {
    const form = document.createElement('form');
    element.before(form); form.append(element);
    window.unexpectedSubmits = 0;
    form.addEventListener('submit', event => { event.preventDefault(); window.unexpectedSubmits++; });
  });
  const original = await field.locator('[data-sb-value]').inputValue();
  const checkHostValidity = async () => {
    if (!await field.evaluate(element => element.closest('form').reportValidity())) throw Error('Paste controls block host form validation');
  };
  await checkHostValidity();
  await field.locator('.sb-collection-count-toggle').click();
  const info = field.getByRole('button', { name: 'Information', exact: true });
  if (await info.getAttribute('data-info-state') !== 'hidden') throw Error('Opening the list did not hide the preview');
  for (const state of ['side', 'vertical', 'hidden']) {
    await info.click();
    if (await info.getAttribute('data-info-state') !== state) throw Error('Unexpected info-state order');
  }
  await field.getByRole('button', { name: 'Import resource addresses', exact: true }).click();
  const dialog = field.locator('.sb-address-dialog');
  const spacing = await dialog.locator('.sb-address-dialog-body').evaluate(el => ({ padding: getComputedStyle(el).padding, gap: getComputedStyle(el).gap }));
  if (spacing.padding !== '16px' || spacing.gap !== '12px') throw Error('Paste dialog spacing was lost');
  if (await dialog.locator('form').count()) throw Error('Paste contains a nested form');
  await dialog.getByRole('button', { name: 'Import', exact: true }).click();
  await dialog.locator('[role="alert"]').waitFor();
  if (await field.locator('[data-sb-value]').inputValue() !== original) throw Error('Empty paste changed selection');
  await dialog.locator('textarea').fill('not a valid selection address');
  await dialog.getByRole('button', { name: 'Import', exact: true }).click();
  await dialog.locator('[role="alert"]').waitFor();
  if (await page.evaluate(() => window.unexpectedSubmits)) throw Error('Paste submitted the host form');
  if (await field.locator('[data-sb-value]').inputValue() !== original) throw Error('Failed paste changed selection');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.locator('textarea').evaluate(element => { element.value = ''; element.dispatchEvent(new Event('input', { bubbles: true })); });
  await checkHostValidity();
  await field.locator('.sb-collection-count-toggle').click();
  if (await field.locator('.sb-selected-panel').isHidden()) throw Error('Closing list did not restore preview');
  await page.screenshot({ path: `build/selection-safety-${width}.png`, fullPage: true });
  }
  return 'Nested-form Paste safety and list/info transitions OK';
}
