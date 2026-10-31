async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => { sessionStorage.clear(); localStorage.removeItem('smartbrowser.displayMode'); });
  await page.goto('http://127.0.0.1:8791?view=browser&frontendFixture=1&longFixture=1&clippedFixture=1');
  await page.locator('.resource-browser-item').nth(119).waitFor({ state: 'attached' });
  const readings = [];
  for (const y of [0, 100, 300, 800, 1500, 600]) {
    await page.evaluate(y => scrollTo(0, y), y);
    await page.waitForTimeout(120);
    const result = await page.evaluate(() => {
      const shell = document.querySelector('.sb-redesigned-browser');
      const rect = selector => document.querySelector(selector).getBoundingClientRect();
      const header = rect('.sb-browser-header'), rail = rect('.sb-tree-handle-rail'), handle = rect('.resource-sidebar-handle');
      const inset = parseFloat(shell.style.getPropertyValue('--sb-page-inset'));
      const heading = parseFloat(shell.style.getPropertyValue('--sb-heading-height'));
      return { inset, header: header.top, expectedHeader: Math.max(inset - heading, shell.getBoundingClientRect().top),
        toolbar: rect('.resource-main > .resource-toolbar').top, headerBottom: header.bottom,
        handle: handle.top + handle.height / 2,
        expectedHandle: (Math.max(header.bottom, rail.top) + Math.min(innerHeight, rail.bottom)) / 2,
        clipping: getComputedStyle(document.getElementById('template-clip-frame')).overflowY };
    });
    if (result.clipping !== 'clip' || Math.abs(result.header - result.expectedHeader) > 2
      || Math.abs(result.toolbar - result.headerBottom) > 2 || Math.abs(result.handle - result.expectedHandle) > 2
      || (y > 150 && result.inset !== 36)) throw Error(JSON.stringify({ y, ...result }));
    readings.push({ y, handle: result.handle });
  }
  const display = page.locator('.sb-heading-controls .resource-display-toggle');
  await display.click(); await display.click();
  await page.waitForFunction(() => getComputedStyle(document.getElementById('template-clip-frame')).overflowY === 'hidden');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('template-clip-frame')).overflowY === 'clip');
  return { result: 'Clipped template, dynamic fixed menu, forward/back scrolling and focus restoration verified', readings };
}
