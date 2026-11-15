async page => {
 const context = await page.context().browser().newContext({ isMobile: true, hasTouch: true });
 const p = await context.newPage(), checked = [];
 const check = (value, message) => { if (!value) throw Error(message); };
 try {
  for (const mode of ['frontendFixture=1', 'mode=select']) for (const view of ['grid', 'details']) {
   await p.setViewportSize({ width: 390, height: 844 });
   await p.goto('http://127.0.0.1:8791/'); await p.evaluate(() => localStorage.clear());
   await p.goto(`http://127.0.0.1:8791/?view=browser&paginationFixture=1&paginationTotal=125&paginationSize=20&loadingMode=smart&${mode}&defaultView=${view}`);
   await p.locator('.resource-scroll-sentinel').waitFor({ state: 'attached' });
   const pager = p.locator('.resource-pagination');
   check(await pager.evaluate(el => el.parentElement.classList.contains('sb-redesigned-browser')), 'Pager must span the whole browser');
   check(await pager.evaluate(el => Math.abs(el.getBoundingClientRect().width - el.parentElement.getBoundingClientRect().width) < 3), 'Pager width excludes the tree');
   const moreBox = await p.getByRole('button', { name: 'Load more', exact: true }).boundingBox();
   const allBox = await p.getByRole('button', { name: 'Load all', exact: true }).boundingBox();
   check(allBox.x < moreBox.x, 'Load all must precede Load more visually');
   check(await p.locator('.resource-load-label').first().evaluate(el => getComputedStyle(el).display === 'none'), 'Portrait loading labels visible');
   check(await p.getByRole('button', { name: 'Load all', exact: true }).count() === 1, 'Icon-only action has no accessible name');
   const count = () => p.locator('.resource-browser [data-sb-resource-key]').count();
   const before = await count();
   await p.locator('.resource-scroll-sentinel').evaluate(el => {
    let a = el.parentElement;
    while (a && a !== document.body && !(/auto|scroll/.test(getComputedStyle(a).overflowY) && a.scrollHeight > a.clientHeight + 1)) a = a.parentElement;
    if (a && a !== document.body) a.scrollTop = a.scrollHeight;
    else scrollTo(0, document.documentElement.scrollHeight);
   });
   await p.waitForFunction(before => document.querySelectorAll('.resource-browser [data-sb-resource-key]').length > before, before);
   checked.push(`${mode}, ${view}: mobile scroll appends and portrait icons remain accessible`);
  }
  await p.setViewportSize({ width: 1440, height: 900 });
  check(await p.locator('.resource-load-label').first().evaluate(el => getComputedStyle(el).display !== 'none'), 'Desktop labels missing');
  return { checked };
 } finally { await context.close(); }
}
