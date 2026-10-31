async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); void SmartBrowserPicker.open({ adapter: 'media', multiple: true, selectionProfile: { 'media.alt': {} }, initialSelection: ['local-images:/a.png'], url: location.origin + '/index.php?infoScrollFixture=1&longFixture=1' }); });
  const frame = page.frameLocator('dialog.smartbrowser-picker iframe');
  await frame.locator('.resource-main > .resource-browser .resource-browser-item').first().click();
  await frame.getByRole('tab', { name: 'Information', exact: true }).click();
  const scroll = frame.locator('.resource-main .resource-info-scroll');
  await scroll.waitFor();
  const before = await scroll.evaluate(el => {
    el.scrollTop = el.scrollHeight;
    return { height: el.clientHeight, full: el.scrollHeight, tabTop: document.querySelector('.resource-info-tabs').getBoundingClientRect().top };
  });
  await page.waitForTimeout(100);
  check(before.full > before.height + 100 && before.height < 900, 'Info has no bounded scrolling viewport: ' + JSON.stringify(before));
  await frame.locator('.resource-main > .resource-browser .resource-browser-item').nth(1).click();
  await page.waitForTimeout(120);
  const after = await scroll.evaluate(el => ({ ratio: el.scrollTop / (el.scrollHeight - el.clientHeight), tabTop: document.querySelector('.resource-info-tabs').getBoundingClientRect().top }));
  check(after.ratio > .98 && Math.abs(after.tabTop - before.tabTop) < 2, 'Info scroll/tab position lost: ' + JSON.stringify(after));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const mobile = await scroll.evaluate(el => {
    const tabs = el.closest('.resource-info-panel').querySelector('.resource-info-tabs');
    const before = tabs.getBoundingClientRect().top;
    el.scrollTop = el.scrollHeight;
    return { height: el.clientHeight, full: el.scrollHeight, tabDelta: tabs.getBoundingClientRect().top - before };
  });
  check(mobile.height > 0 && mobile.full > mobile.height && mobile.tabDelta === 0, 'Mobile information tabs scroll with their body: ' + JSON.stringify(mobile));
  await frame.locator('.resource-picker-cancel').click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => localStorage.setItem('supjx.smartbrowser.media', JSON.stringify({ showInfo: true, activeView: 'details' })));
  await page.goto('http://127.0.0.1:8791?view=browser&longFixture=1&infoScrollFixture=1&nativeToolbar=1');
  await page.locator('.resource-main > .resource-toolbar').getByRole('button', { name: 'List', exact: true }).click();
  await page.locator('.resource-main .resource-details-view thead').waitFor();
  await page.evaluate(() => scrollTo(0, 600));
  await page.waitForTimeout(100);
  const head = await page.evaluate(() => ({ header: document.querySelector('.resource-main .resource-details-view thead').getBoundingClientRect().top, toolbar: document.querySelector('.resource-main > .resource-toolbar').getBoundingClientRect().bottom }));
  check(Math.abs(head.header - head.toolbar) < 2, 'List headers are not sticky below toolbar: ' + JSON.stringify(head));
  return 'Independent info scroll retains relative position; tabs and list headers stay visible';
}
