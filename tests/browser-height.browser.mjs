async page => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://127.0.0.1:8791?view=browser');
  await page.locator('.resource-sidebar').waitFor();
  if (!await page.locator('.resource-browser > .resource-info-panel').count()) await page.getByRole('button', { name: 'Toggle information', exact: true }).click();
  await page.evaluate(() => {
    const header = document.createElement('header');
    header.style.height = '60px';
    document.body.prepend(header);
    window.dispatchEvent(new Event('resize'));
  });
  const checkHeight = async label => {
    await page.waitForTimeout(150);
    const result = await page.evaluate(() => {
      const bottom = selector => document.querySelector(selector).getBoundingClientRect().bottom;
      const style = getComputedStyle(document.getElementById('smartbrowser-app'));
      return { shell: bottom('.smartbrowser-shell'), tree: bottom('.resource-sidebar'),
        browser: bottom('.resource-browser'), info: bottom('.resource-browser > .resource-info-panel'), viewport: innerHeight - parseFloat(style.paddingBottom) - parseFloat(style.borderBottomWidth) };
    });
    for (const key of ['tree', 'browser', 'info']) if (Math.abs(result[key] - result.shell) > 2) throw Error(`${label}: ${key} stops short: ${JSON.stringify(result)}`);
    if (Math.abs(result.shell - result.viewport) > 3) throw Error(`${label}: browser does not fill viewport: ${JSON.stringify(result)}`);
  };
  await checkHeight('normal');
  await page.setViewportSize({ width: 1440, height: 1250 });
  await checkHeight('resize');
  await page.evaluate(() => {
    const root = document.getElementById('smartbrowser-app');
    document.body.append(root);
    root.setAttribute('data-sb-focus', '');
    window.dispatchEvent(new Event('resize'));
  });
  await checkHeight('focus');
  await page.screenshot({ path: 'build/browser-full-height.png' });
  return 'Browser, folders and Information fill available height with a site header, after resizing and in focus mode.';
}
