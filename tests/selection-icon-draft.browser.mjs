async page => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable&presentationFixture=1');
  const field = page.locator('.sb-selection-field').nth(2);
  const icon = field.getByLabel('Icon', { exact: true });
  await icon.fill('fas');
  await icon.press('End');
  await icon.press('Space');
  if (await icon.inputValue() !== 'fas ') throw Error('Typing separator was removed from draft');
  await icon.pressSequentially('fa-book');
  await page.waitForFunction(() => JSON.parse(document.querySelectorAll('.sb-selection-field')[2].querySelector('[data-sb-value]').value).items[0].usage['visual.iconOverride'] === 'fas fa-book');
  if (await icon.getAttribute('aria-invalid') === 'true') throw Error('Valid class list rejected');
  const stored = await field.locator('[data-sb-value]').inputValue();
  await icon.fill('fas <invalid>');
  await page.waitForFunction(() => document.querySelectorAll('.sb-selection-field')[2].querySelector('.resource-usage-field input[aria-invalid="true"]'));
  if (await field.locator('[data-sb-value]').inputValue() !== stored) throw Error('Invalid draft leaked into caller storage');
  if (await icon.inputValue() !== 'fas <invalid>') throw Error('Invalid draft lost while editing');
  await icon.fill('fas   fa-star ');
  await page.waitForFunction(() => JSON.parse(document.querySelectorAll('.sb-selection-field')[2].querySelector('[data-sb-value]').value).items[0].usage['visual.iconOverride'] === 'fas fa-star');
  if (await icon.getAttribute('aria-invalid') === 'true') throw Error('Validation did not recover');
  await icon.fill(' ');
  await page.waitForFunction(() => JSON.parse(document.querySelectorAll('.sb-selection-field')[2].querySelector('[data-sb-value]').value).items[0].usage['visual.iconOverride'] === '');
  if (errors.length) throw Error(errors.join('\n'));
  return 'Space-separated icon typing, normalized persistence, invalid draft isolation and recovery passed without runtime errors.';
}
