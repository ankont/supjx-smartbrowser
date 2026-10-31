async page => {
  const check = (condition, message) => { if (!condition) throw Error(message); };
  await page.setViewportSize({ width: 1400, height: 1000 });
  await page.goto('http://127.0.0.1:8791?nativeImageFixture=1');
  for (const role of ['intro', 'fulltext']) {
    const fieldset = page.locator('fieldset[data-sb-native-media]').nth(role === 'intro' ? 0 : 1);
    await fieldset.locator('.resource-usage-editor').waitFor();
    for (const name of [`image_${role}_alt`, `image_${role}_alt_empty`, `image_${role}_caption`, `imgclass_${role}`, `float_${role}`]) {
      check(!await page.locator(`input[name="jform[images][${name}]"]`).isVisible(), `Native duplicate visible: ${name}`);
    }
    const usageInput = label => fieldset.locator('.resource-usage-field').filter({ hasText: label }).locator('input');
    check(await usageInput('Image class').inputValue() === `${role}-image`, 'Image class was not imported');
    check(await usageInput('Image container class').inputValue() === `${role}-figure`, 'Figure class was not imported');
    await usageInput('Image class').fill(`${role}-new-image`);
    await usageInput('Image container class').fill(`${role}-new-figure`);
    await usageInput('Caption').fill(`${role} new caption`);
    await usageInput('Alternative text').fill(`${role} new alt`);
    await page.waitForFunction(role => document.querySelector(`input[name="jform[images][float_${role}]"]`).value === `${role}-new-figure`, role);
    check(await page.locator(`input[name="jform[images][imgclass_${role}]"]`).inputValue() === `${role}-new-image`, 'Image class did not persist to Joomla');
    check(await page.locator(`input[name="jform[images][image_${role}_caption]"]`).inputValue() === `${role} new caption`, 'Caption did not persist to Joomla');
    await page.waitForFunction(role => document.querySelector(`input[name="jform[images][image_${role}_alt]"]`).value === `${role} new alt`, role);
    await usageInput('Decorative image').check();
    await page.waitForFunction(role => document.querySelector(`input[name="jform[images][image_${role}_alt_empty]"]`).checked, role);
    check(await page.locator(`input[name="jform[images][image_${role}]"]`).inputValue() === 'images/a.png#joomlaImage://local-images/a.png', 'Usage edits replaced the native image address');
    const config = await fieldset.locator('[data-sb-field]').evaluate(root => JSON.parse(root.dataset.sbField));
    check(config.nativeUsageKeys.length === 5, 'Native image options incomplete');
  }
  check(await page.locator('[data-sb-error]:visible').count() === 0, 'Usage bridge reported an error');
  return 'Both Joomla image slots: no native duplicates; separate image/figure class and caption values round-trip through the actual generic bridge';
}
