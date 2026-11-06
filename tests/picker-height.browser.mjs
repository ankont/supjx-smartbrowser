async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  for (const application of ['administrator', 'site']) {
    for (const scenario of ['', '&emptyFixture=1', '&uploadFixture=1']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('http://127.0.0.1:8791/');
      await page.evaluate(({ application, scenario }) => {
        void SmartBrowserPicker.open({ url: location.origin + '/index.php?application=' + application + scenario, multiple: true, resultFormat: 'collection' });
      }, { application, scenario });
      const picker = page.frameLocator('dialog.smartbrowser-picker iframe');
      await picker.locator('.resource-picker-collection').waitFor();
      if (scenario.includes('uploadFixture')) await picker.locator('.smartbrowser-shell').evaluate(() => Joomla.renderMessages({ success: ['Upload complete'] }));
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 800 });
        for (const maximized of [false, true]) {
          if (maximized) await picker.locator('.resource-display-toggle').click();
          for (const drawerOpen of [false, true]) {
            const drawer = picker.locator('.resource-picker-collection');
            const open = await drawer.evaluate(element => element.open);
            if (open !== drawerOpen) await drawer.locator(':scope > summary').click();
            check(await drawer.evaluate(element => element.open) === drawerOpen, 'Selection drawer did not toggle');
            await page.waitForTimeout(80);
            const result = await picker.locator('.smartbrowser-shell').evaluate(element => ({
              bottom: element.getBoundingClientRect().bottom, viewport: innerHeight, pageHeight: document.documentElement.scrollHeight,
              footer: element.querySelector('.resource-picker-collection').getBoundingClientRect().bottom,
              results: element.querySelector('.resource-main > .resource-browser').getBoundingClientRect().height,
              messageBottom: element.querySelector('#system-message-container')?.getBoundingClientRect().bottom,
              panelTop: element.querySelector('.resource-picker-collection').getBoundingClientRect().top,
            }));
            check(Math.abs(result.bottom - result.viewport) <= 3 && Math.abs(result.footer - result.bottom) <= 2
              && result.pageHeight <= result.viewport + 2 && result.results > 40, `${application}/${scenario}/${width}/${maximized}/${drawerOpen}: ${JSON.stringify(result)}`);
            if (scenario.includes('uploadFixture')) check(Math.abs(result.messageBottom - result.panelTop) <= 1, 'Message must remain above the entire selection panel');
          }
          if (maximized) await picker.locator('.resource-display-toggle').click();
        }
      }
      await picker.locator('.resource-picker-cancel').click();
      await page.locator('dialog.smartbrowser-picker').waitFor({ state: 'detached' });
    }
  }
  return 'Iframe Picker fills normal/maximized windows for empty/few/many resources, desktop/mobile, frontend/administrator, and open/closed selection drawers';
}
