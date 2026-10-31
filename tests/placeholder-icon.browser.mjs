async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => {
    const field = document.createElement('div');
    field.dataset.sbIconField = '';
    field.dataset.default = 'fas fa-ban';
    field.innerHTML = '<span data-icon-preview class="fas fa-ban"></span><input placeholder="fas fa-ban"><button type="button" data-single-icon-reset>Reset icon</button>';
    document.body.prepend(field);
  });
  await page.addScriptTag({ url: 'http://127.0.0.1:8791/package/component/media/js/icon-settings.js' });
  const field = page.locator('[data-sb-icon-field]');
  await field.locator('input').fill('fas fa-image');
  if (await field.locator('[data-icon-preview]').getAttribute('class') !== 'fas fa-image') throw Error('Icon preview not updated');
  await field.getByRole('button', { name: 'Reset icon' }).click();
  if (await field.locator('input').inputValue() !== '' || await field.locator('[data-icon-preview]').getAttribute('class') !== 'fas fa-ban') throw Error('Default icon not restored');
  return 'Unavailable icon preview and reset use the configured default hint';
}
