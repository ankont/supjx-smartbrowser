async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const bg = locator => locator.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const context of ['nativeToolbar=1', 'frontendFixture=1']) {
    await page.goto('http://127.0.0.1:8791');
    await page.evaluate(() => sessionStorage.setItem('supjx.smartbrowser.media', JSON.stringify({ showInfo: true, activeView: 'grid' })));
    await page.goto(`http://127.0.0.1:8791?view=browser&${context}`);
    await page.locator('.resource-info-panel').waitFor();
    const native = context.startsWith('native');
    const header = page.locator(native ? '.subhead' : '.sb-browser-header');
    const dashboard = header.locator('.resource-dashboard-link');
    const description = header.locator('.sb-browser-description');
    const back = await dashboard.boundingBox(), text = await description.boundingBox();
    if (native) {
      check(Math.abs(back.y + back.height / 2 - text.y - text.height / 2) < 3, 'Back and description do not share a row');
      const options = page.locator('.sb-options-icon');
      const nativeOptions = page.locator('#toolbar > joomla-toolbar-button');
      const manager = page.locator('#sb-native-manager .resource-manager-link');
      for (const control of [options, nativeOptions, manager]) {
        const box = await control.boundingBox();
        check(Math.abs(box.y + box.height / 2 - back.y - back.height / 2) < 3, 'First-row controls wrapped');
      }
      check(await page.locator('#toolbar').evaluate(el => getComputedStyle(el).display) === 'grid', 'Native d-flex defeated the layout');
    } else {
      check(await bg(header) !== 'rgba(0, 0, 0, 0)', 'Frontend header is transparent');
      const title = await header.locator('.sb-browser-title').boundingBox();
      check(Math.abs(text.x - title.x) < 2 && text.y >= title.y + title.height - 1, 'Subtitle is not directly below the title');
    }
    await page.locator('.resource-browser-item').first().click();
    const flat = header.locator('.resource-flat-toggle'), advanced = header.locator('.resource-batch-toggle'), create = header.locator('.resource-action-createNode');
    for (const button of [flat, advanced, create]) {
      check(Math.abs((await button.boundingBox()).height - (await create.boundingBox()).height) < 1, 'Unequal control heights');
    }
    check(await bg(flat) === 'rgb(232, 242, 251)' && await bg(advanced) === await bg(flat), 'Flat/Advanced lost their light blue background');
    await create.hover(); check(await bg(create) === 'rgb(47, 111, 173)', 'Secondary creation hover is not blue');
    const actions = header.locator('.resource-action-menu-toggle');
    await actions.hover(); check(await bg(actions) === 'rgb(36, 55, 79)', 'Actions hover is not dark');
    await actions.click();
    const edit = header.locator('.resource-action-menu .resource-action-edit');
    await edit.hover(); check(await bg(edit) === 'rgb(238, 242, 246)', 'Plain menu hover is not native-like');
    await page.keyboard.press('Escape');
    const manager = page.locator('.resource-manager-link');
    await page.mouse.move(0, 0);
    check(await bg(manager) === 'rgb(23, 61, 98)', 'Native manager is not dark blue');
    await manager.hover(); check(await bg(manager) === 'rgb(47, 111, 173)', 'Native manager hover differs');
    const geometry = await page.evaluate(() => {
      const shell = document.querySelector('.sb-redesigned-browser');
      const rect = selector => shell.querySelector(selector).getBoundingClientRect();
      return { tree: rect('.resource-sidebar').height, info: rect('.resource-info-panel').height,
        handleMiddle: rect('.resource-sidebar-handle').top + 27,
        expectedHandle: parseFloat(shell.style.getPropertyValue('--sb-tree-handle-top')) + 27,
        treeHeight: parseFloat(shell.style.getPropertyValue('--sb-tree-height')),
        infoHeight: parseFloat(shell.style.getPropertyValue('--sb-info-height')) };
    });
    check(Math.abs(geometry.tree - geometry.treeHeight) < 2 && Math.abs(geometry.info - geometry.infoHeight) < 2, 'Panels lost viewport height: ' + JSON.stringify(geometry));
    check(Math.abs(geometry.handleMiddle - geometry.expectedHandle) < 2, 'Tree handle is not centred: ' + JSON.stringify(geometry));
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `build/chrome-${native ? 'backend' : 'frontend'}.png` });
  }
  return 'Native d-flex, two-row geometry, shared heights, hover colours and full-height panes verified';
}
