async page => {
  page.setDefaultTimeout(10000);
  const check = (condition, message) => { if (!condition) throw Error(message); };
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const context of ['nativeToolbar=1', 'frontendFixture=1']) {
    await page.goto('http://127.0.0.1:8791');
    await page.evaluate(() => localStorage.setItem('supjx.smartbrowser.media', JSON.stringify({ showInfo: true, activeView: 'grid' })));
    await page.goto(`http://127.0.0.1:8791?view=browser&longFixture=1&${context}`);
    await page.locator('.resource-browser-item').first().waitFor();
    await page.evaluate(() => scrollTo(0, 700));
    await page.waitForTimeout(150);
    const layout = await page.evaluate(() => {
      const header = document.querySelector('.subhead') || document.querySelector('.sb-browser-header');
      const toolbar = document.querySelector('.resource-main > .resource-toolbar');
      const tree = document.querySelector('.resource-tree-content');
      const treeRail = document.querySelector('.resource-sidebar').getBoundingClientRect();
      const infoRail = document.querySelector('.sb-browser-info-rail').getBoundingClientRect();
      const main = document.querySelector('.resource-main').getBoundingClientRect();
      const handle = document.querySelector('.resource-sidebar-handle').getBoundingClientRect();
      return { headerTop: header.getBoundingClientRect().top, headerBottom: header.getBoundingClientRect().bottom,
        toolbarTop: toolbar.getBoundingClientRect().top, treeTop: tree.getBoundingClientRect().top,
        treeBottom: tree.getBoundingClientRect().bottom, height: innerHeight,
        headingHeight: parseFloat(document.querySelector('.sb-redesigned-browser').style.getPropertyValue('--sb-heading-height')),
        railHeight: treeRail.height, treeRailBottom: treeRail.bottom, infoRailBottom: infoRail.bottom, mainBottom: main.bottom,
        handleMiddle: handle.top + handle.height / 2 };
    });
    check(Math.abs(layout.headerTop - ((context.startsWith('frontend') ? 36 : 0) - layout.headingHeight)) < 2, JSON.stringify(layout));
    check(Math.abs(layout.toolbarTop - layout.headerBottom) < 2, 'Toolbar slipped under header: ' + JSON.stringify(layout));
    check(Math.abs(layout.treeTop - layout.headerBottom) < 2 && layout.treeBottom <= layout.height + 2, 'Tree is not accessible: ' + JSON.stringify(layout));
    check(layout.railHeight > layout.height * 2 && Math.abs(layout.treeRailBottom - layout.mainBottom) < 2 && Math.abs(layout.infoRailBottom - layout.mainBottom) < 2, 'Side rails do not fill the complete listing: ' + JSON.stringify(layout));
    check(Math.abs(layout.handleMiddle - (layout.headerBottom + layout.height) / 2) < 2, 'Handle is not centred in the visible rail: ' + JSON.stringify(layout));
    await page.locator('.resource-sidebar-handle').click();
    await page.waitForSelector('.smartbrowser-layout.tree-collapsed');
    const collapsed = await page.locator('.resource-sidebar-handle').boundingBox();
    check(Math.abs(collapsed.y + collapsed.height / 2 - (layout.headerBottom + layout.height) / 2) < 2, 'Collapsed-tree handle lost its centre');
    await page.locator('.resource-sidebar-handle').click();
    await page.waitForSelector('.smartbrowser-layout:not(.tree-collapsed) > .resource-sidebar');
    await page.screenshot({ path: `build/redesign-${context.split('=')[0]}.png` });
  }
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => {
    void SmartBrowserPicker.open({ adapter: 'media', resultFormat: 'collection', multiple: true,
      allowedAdapters: ['media'], url: location.origin + '/index.php?longFixture=1',
      initialCollection: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }] });
  });
  const frame = page.frameLocator('dialog.smartbrowser-picker iframe');
  await frame.locator('.resource-picker-collection > summary').waitFor();
  await frame.locator('.resource-browser-item').nth(119).waitFor({ state: 'attached' });
  const shell = frame.locator('.sb-redesigned-browser');
  const before = await shell.evaluate(element => {
    const results = element.querySelector('.resource-main > .resource-browser');
    results.scrollTop = 100;
    return { height: results.clientHeight, scroll: results.scrollTop,
      footerBottom: element.querySelector('.resource-picker-collection').getBoundingClientRect().bottom,
      shellBottom: element.getBoundingClientRect().bottom };
  });
  await frame.locator('.resource-picker-collection > summary').click();
  await frame.locator('.resource-picker-collection .smartbrowser-collection').waitFor();
  const after = await shell.evaluate(element => {
    const results = element.querySelector('.resource-main > .resource-browser');
    const footer = element.querySelector('.resource-picker-collection');
    return { height: results.clientHeight, scroll: results.scrollTop,
      footerBottom: footer.getBoundingClientRect().bottom,
      resultsBottom: results.getBoundingClientRect().bottom, footerTop: footer.getBoundingClientRect().top,
      pageScroll: element.ownerDocument.documentElement.scrollHeight > element.ownerDocument.defaultView.innerHeight + 2 };
  });
  check(Math.abs(before.footerBottom - before.shellBottom) < 2, 'Footer is not at bottom');
  check(after.height < before.height, 'Opening selection did not reserve space');
  check(Math.abs(after.footerBottom - before.footerBottom) < 2, 'Footer bottom moved');
  check(Math.abs(after.scroll - before.scroll) < 2, 'Selection panel reset result scrolling');
  check(after.resultsBottom <= after.footerTop + 2 && !after.pageScroll, 'Selection overlaps results or scrolls the picker page');
  await page.screenshot({ path: 'build/redesign-picker.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  const mobile = await shell.evaluate(element => {
    const results = element.querySelector('.resource-main > .resource-browser').getBoundingClientRect();
    const footer = element.querySelector('.resource-picker-collection').getBoundingClientRect();
    return { height: results.height, bottom: results.bottom, footerTop: footer.top, footerBottom: footer.bottom,
      viewport: element.ownerDocument.defaultView.innerHeight };
  });
  check(mobile.height > 60 && mobile.bottom <= mobile.footerTop + 2 && mobile.footerBottom <= mobile.viewport + 2, 'Mobile picker lost result space: ' + JSON.stringify(mobile));
  await page.screenshot({ path: 'build/redesign-picker-mobile.png' });
  return 'Backend/frontend sticky chrome and non-overlapping bottom picker drawer verified';
}
