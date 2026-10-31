async page => {
  await page.goto('http://127.0.0.1:8791/tests/fixtures/options-background.html');
  await page.waitForFunction(() => document.querySelector('[data-sb-visual-settings]')?.dataset.sbVisualMounted === 'true');
  await page.waitForLoadState('load');
  const input = page.locator('select[name="jform[params][image_background]"]');
  if (await input.count() !== 1) throw Error('Background control duplicated');
  if (!await input.evaluate(el => el.closest('fieldset')?.id === 'thumbnail-options-generated')) throw Error('Params-prefixed control remained outside Thumbnail options');
  await input.selectOption('checkerboard');
  if (await input.inputValue() !== 'checkerboard') throw Error('Background selection stopped working');
  return 'Transparency stays inside Thumbnail options after both visual-settings and icon-settings initialize';
}
