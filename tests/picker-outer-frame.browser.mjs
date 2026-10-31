async page => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:8791?view=browser&multiple=1&longFixture=1');
  await page.locator('.resource-browser-item').nth(119).waitFor({ state: 'attached' });
  await page.evaluate(() => { document.body.className = 'contentpane component'; window.dispatchEvent(new Event('resize')); });
  await page.waitForTimeout(150);
  for (const size of [{ width: 1280, height: 800 }, { width: 780, height: 540 }]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(150);
    const geometry = await page.evaluate(() => {
      const results = document.querySelector('.resource-main > .resource-browser');
      results.scrollTop = 100;
      return { outer: document.documentElement.scrollHeight, viewport: innerHeight,
        scroll: results.scrollTop, title: parseFloat(getComputedStyle(document.querySelector('.sb-browser-title')).fontSize),
        shellBottom: document.querySelector('.sb-redesigned-browser').getBoundingClientRect().bottom,
        padding: parseFloat(getComputedStyle(document.body).paddingBottom) };
    });
    if (geometry.outer > geometry.viewport + 1 || geometry.shellBottom > geometry.viewport - geometry.padding + 1
      || geometry.scroll <= 0 || geometry.title > 21) throw Error(JSON.stringify(geometry));
  }
  await page.screenshot({ path: 'build/picker-outer-frame.png' });
  return 'Atum component padding leaves no outer scrollbar; result scrolling remains available and picker title stays compact';
}
