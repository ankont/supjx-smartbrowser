async page => {
  const bg = locator => locator.evaluate(el => getComputedStyle(el).backgroundColor);
  const check = (condition, message) => { if (!condition) throw Error(message); };
  for (const host of ['nativeToolbar=1', 'frontendFixture=1']) {
    await page.goto('http://127.0.0.1:8791');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('http://127.0.0.1:8791?view=browser&' + host);
    const filter = page.locator('.resource-filter-toggle'), clear = page.locator('.resource-filter-clear');
    await filter.waitFor();
    // Exercise native defaults loaded after the component stylesheet as well.
    await page.addStyleTag({ content: '.subhead .btn{color:#495057;background:white;border:1px solid #bdcbd8}.subhead .btn:not([disabled]):hover{background:#495057}.subhead .btn[disabled]{opacity:.4}.subhead .btn>span{color:#495057}' });
    await page.mouse.move(0, 0);
    check(await bg(filter) === 'rgb(248, 249, 243)', 'Filter default lost');
    check(await clear.isDisabled() && await bg(clear) === 'rgb(164, 175, 189)', 'Disabled Clear lost');
    check(await clear.evaluate(el => getComputedStyle(el).opacity) === '1', 'Native disabled opacity overrides Clear');
    await filter.hover();
    check(await bg(filter) === 'rgb(47, 111, 173)', 'Filter hover lost');
    check(await filter.locator('span').first().evaluate(el => getComputedStyle(el).color) === 'rgb(255, 255, 255)', 'Filter hover icon lost');
    await filter.click(); await page.mouse.move(0, 0);
    check(await bg(filter) === 'rgb(47, 111, 173)', 'Filter open state lost');
    await filter.click(); await page.mouse.move(0, 0);
    check(await filter.evaluate(el => el.matches(':focus') && !el.matches(':hover') && el.getAttribute('aria-expanded') === 'false'), 'Closed mouse-focus case was not exercised');
    check(await bg(filter) === 'rgb(47, 111, 173)', 'Mouse focus after closing Filter lost');
    await filter.evaluate(el => el.blur());
    check(await bg(filter) === 'rgb(248, 249, 243)', 'Blur did not restore Filter default');
    await filter.click(); await page.mouse.move(0, 0);
    await page.locator('.resource-action-filters select').selectOption('published');
    await page.waitForFunction(() => !document.querySelector('.resource-filter-clear').disabled);
    check(await bg(clear) === 'rgb(64, 91, 120)', 'Enabled Clear lost');
    await clear.hover(); check(await bg(clear) === 'rgb(47, 111, 173)', 'Clear hover lost');
    await clear.click(); await page.mouse.move(0, 0);
    await page.waitForFunction(() => document.querySelector('.resource-filter-clear').disabled);
    check(await bg(clear) === 'rgb(164, 175, 189)', 'Clear reset colour lost');
  }
  return 'Filter/Clear default, hover, active, enabled and disabled colours resist late native toolbar styles';
}
