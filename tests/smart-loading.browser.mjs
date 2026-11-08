async page => {
  const p = await page.context().newPage(), errors = [], checked = [];
  const check = (value, message) => { if (!value) throw Error(message); };
  p.on('pageerror', error => errors.push(error.message));
  const start = async (extra = '') => {
    await p.goto('http://127.0.0.1:8791/'); await p.evaluate(() => localStorage.clear());
    await p.goto(`http://127.0.0.1:8791/?view=browser&paginationFixture=1&paginationTotal=125&paginationSize=20&loadingMode=smart&${extra}`);
    await p.locator('.resource-pagination').waitFor(); await p.waitForTimeout(150);
  };
  const count = () => p.locator('.resource-browser > :is(.resource-browser-grid, .resource-details-view) [data-sb-resource-key]').count();
  const approachEnd = async () => {
    await p.locator('.resource-scroll-sentinel').evaluate(el => {
      let scroller = el.parentElement;
      while (scroller && scroller !== document.body && !(/auto|scroll/.test(getComputedStyle(scroller).overflowY) && scroller.scrollHeight > scroller.clientHeight + 1)) scroller = scroller.parentElement;
      if (scroller && scroller !== document.body) scroller.scrollTop = scroller.scrollHeight;
      else window.scrollTo(0, document.documentElement.scrollHeight);
    });
  };
  try {
    await p.setViewportSize({ width: 1440, height: 900 });
    for (const extra of ['frontendFixture=1&defaultView=grid', 'nativeToolbar=1&defaultView=details', 'mode=select&defaultView=grid', 'mode=select&defaultView=details']) {
      await start(extra);
      const initial = await count();
      check(initial >= 20 && initial < 125, `Eagerly loaded entire dataset: ${extra}, ${initial}`);
      const first = await p.locator('[data-sb-resource-key="article:1"]').first().elementHandle();
      await approachEnd();
      await p.waitForFunction(before => document.querySelectorAll('.resource-browser > :is(.resource-browser-grid, .resource-details-view) [data-sb-resource-key]').length > before, initial);
      check(await first.evaluate(el => el.isConnected), 'Append replaced the existing resource DOM');
      check(await count() < 125, 'One scroll loaded the entire dataset');
      const ids = await p.locator('.resource-browser [data-sb-resource-key]').evaluateAll(elements => elements.map(el => el.dataset.sbResourceKey));
      check(new Set(ids).size === ids.length, 'Duplicate resource DOM after append');
      check(await p.locator('.resource-pagination').count() === 1, 'Duplicate smart-loading controls');
      checked.push(extra);
    }
    await start('frontendFixture=1&defaultView=grid&failAppend=1');
    const before = await count(); await approachEnd();
    await p.getByText('Temporary failure', { exact: true }).waitFor();
    await p.waitForTimeout(300);
    const attempts = await p.evaluate(() => paginationRequests.filter(r => r.offset > 0).length);
    check(attempts === 1, 'Automatic retry loop after append failure');
    check(await count() === before, 'Failure removed already loaded resources');
    await p.getByRole('button', { name: 'Load more', exact: true }).click();
    await p.waitForFunction(before => document.querySelectorAll('.resource-browser-item').length > before, before);
    checked.push('Failure retains results, stops automatic retry and supports manual retry');
    check(!errors.length, errors.join('\n'));
    return { checked, errors };
  } finally { await p.close(); }
}
