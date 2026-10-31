async page => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:8791?view=browser&nativeToolbar=1');
    const native = page.locator('#sb-native-actions');
    await native.locator('.resource-batch-toggle').waitFor();
    await native.locator('.resource-action-createNode').waitFor();
    await native.locator('.resource-filter-buttons').waitFor();
    await page.locator('#sb-native-intro .sb-browser-description').waitFor();
    await page.locator('#sb-native-manager .resource-manager-link').waitFor();
    if (width === 1280) await page.waitForFunction(() => document.querySelector('.sb-options-icon')?.classList.contains('is-expanded'));
    else if (await page.locator('.sb-options-label').isVisible()) throw Error('Options label does not collapse on narrow screen');
    if (width === 1280) {
      const layout = await page.evaluate(() => {
        const row = document.querySelector('#toolbar'), options = document.querySelector('#sb-native-manager');
        const buttons = [...document.querySelector('#sb-native-actions .resource-actions').children];
        return { right: row.getBoundingClientRect().right - options.getBoundingClientRect().right,
          gap: buttons[1].getBoundingClientRect().left - buttons[0].getBoundingClientRect().right,
          flatLabel: !!document.querySelector('.resource-flat-toggle .resource-action-label')?.getBoundingClientRect().width };
      });
      if (Math.abs(layout.right) > 2 || Math.abs(layout.gap - 12) > 1 || !layout.flatLabel) throw Error(JSON.stringify(layout));
    }
    if (await page.locator('#smartbrowser-app .resource-batch-toggle').count()) throw Error('Duplicate Advanced button');
    if (await page.locator('#smartbrowser-app .resource-actions').count()) throw Error('Duplicate inline header');
    if (!await native.locator('.resource-batch-toggle').isDisabled()) throw Error('Advanced enabled without selection');
    await page.locator('.resource-browser-item').first().click();
    if (await native.locator('.resource-batch-toggle').isDisabled()) throw Error('Native toolbar lost reactive selection');
    await native.locator('.resource-action-menu-toggle').click();
    await native.locator('.resource-action-menu').waitFor();
    await page.keyboard.press('Escape');
    if (await native.locator('.resource-action-menu').count()) throw Error('Menu Escape broken');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    if (overflow) throw Error('Native toolbar overflows viewport');
    await page.screenshot({ path: `build/native-toolbar-${width}.png`, fullPage: true });
  }
  await page.goto('http://127.0.0.1:8791?view=browser&nativeToolbar=missing');
  await page.locator('#smartbrowser-app .resource-batch-toggle').waitFor();
  await page.goto('http://127.0.0.1:8791?view=browser');
  await page.locator('#smartbrowser-app .resource-action-menu-toggle').waitFor();
  return 'Native toolbar stays reactive, responsive and singular; missing targets and pickers retain inline controls';
}
