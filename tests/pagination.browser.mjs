async page => {
  const p = await page.context().newPage(), errors = [], checked = [];
  const check = (value, message) => { if (!value) throw Error(message); };
  p.on('pageerror', error => errors.push(error.message));
  try {
    await p.goto('http://127.0.0.1:8791/');
    await p.evaluate(() => localStorage.clear());
    for (const [application, mode] of [['administrator', 'manage'], ['site', 'manage'], ['site', 'select']]) {
      await p.setViewportSize({ width: 1440, height: 900 });
      await p.goto(`http://127.0.0.1:8791/?view=browser&paginationFixture=1&defaultView=grid&application=${application}&mode=${mode}`);
      const pager = p.locator('.resource-pagination');
      await pager.getByRole('button', { name: 'Next page', exact: true }).waitFor();
      check(await pager.count() === 1, 'Duplicate pager');
      check(await pager.innerText() === '1–10 of 25', 'First page range');
      await p.locator('.resource-item-select').first().click();
      await pager.getByRole('button', { name: 'Next page', exact: true }).click();
      await p.waitForFunction(() => document.querySelector('.resource-pagination').textContent.includes('11–20'));
      check(await p.locator('.resource-browser-item').count() === 10, 'Second page size');
      check(await p.locator('.resource-tree-content').innerText().then(text => text.includes('Complete tree')), 'Lost tree entries');
      await pager.getByRole('button', { name: 'Previous page', exact: true }).click();
      await p.waitForFunction(() => document.querySelector('.resource-pagination').textContent.includes('1–10'));
      check(await p.locator('.resource-item-select input').first().isChecked(), 'Lost off-page selection');
      await p.getByRole('button', { name: 'List', exact: true }).click();
      await p.locator('.resource-browser > .resource-details-view').waitFor();
      await pager.getByRole('button', { name: 'Next page', exact: true }).click();
      await p.waitForFunction(() => document.querySelector('.resource-pagination').textContent.includes('11–20'));
      await pager.getByRole('button', { name: 'Next page', exact: true }).click();
      await p.waitForFunction(() => document.querySelector('.resource-pagination').textContent.includes('21–25'));
      check(await pager.getByRole('button', { name: 'Next page', exact: true }).isDisabled(), 'Last-page next enabled');
      for (const width of [768, 390]) {
        await p.setViewportSize({ width, height: 850 });
        await p.waitForTimeout(100);
        check(await pager.count() === 1 && await pager.isVisible(), `Missing mobile pager at ${width}`);
        check(await pager.evaluate(el => Boolean(el.closest('.resource-main'))), 'Mobile pager remained in sidebar');
      }
      checked.push(`${application}/${mode}: grid/list, page selection, boundaries and responsive pager`);
    }
    check(!errors.length, errors.join('\n'));
    return { checked, errors };
  } finally { await p.close(); }
}
