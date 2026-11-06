async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const view of ['grid', 'details']) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`http://127.0.0.1:8791/index.php?view=browser&uploadFixture=1&multiple=1&defaultView=${view}`);
    await page.evaluate(() => {
      const original = HTMLInputElement.prototype.click;
      HTMLInputElement.prototype.click = function () {
        // Attach the native file input so Playwright can supply files without an OS dialog.
        if (this.type === 'file') { this.hidden = true; document.body.append(this); }
        else original.call(this);
      };
    });
    const originalHeight = await page.locator('.resource-main > .resource-browser').evaluate(element => element.clientHeight);
    await page.getByRole('button', { name: 'Upload', exact: true }).click();
    await page.locator('input[type=file]').setInputFiles([
      { name: 'zz-upload-a.png', mimeType: 'image/png', buffer: Buffer.from('test') },
      { name: 'zz-upload-b.png', mimeType: 'image/png', buffer: Buffer.from('test') },
    ]);
    const selected = page.locator('.resource-main .selected[data-sb-resource-key]');
    await selected.first().waitFor();
    check(await selected.count() === 2, 'Both uploaded files must be selected');
    await page.waitForFunction(() => {
      const box = document.querySelector('.resource-main > .resource-browser').getBoundingClientRect();
      const bottom = Math.min(box.bottom, document.getElementById('system-message-container').getBoundingClientRect().top);
      return [...document.querySelectorAll('.resource-main .selected[data-sb-resource-key]')].every(element => {
        const rect = element.getBoundingClientRect(); return rect.top >= box.top && rect.bottom <= bottom + 1;
      });
    });
    const messages = await page.locator('#system-message-container').evaluate(element => ({
      parent: element.parentElement.className, bottom: element.getBoundingClientRect().bottom,
      panelTop: document.querySelector('.resource-picker-collection').getBoundingClientRect().top,
      followsResults: element.parentElement.previousElementSibling.classList.contains('smartbrowser-layout'),
    }));
    check(messages.parent === 'sb-browser-messages' && messages.followsResults && Math.abs(messages.bottom - messages.panelTop) <= 1, 'Status must sit immediately above the selection panel');
    check(Math.abs(await page.locator('.resource-main > .resource-browser').evaluate(element => element.clientHeight) - originalHeight) <= 1, 'Floating status must not shrink results');
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForFunction(() => Math.abs(document.querySelector('.smartbrowser-shell').getBoundingClientRect().bottom - innerHeight) <= 2);
      for (const hasMessage of [true, false]) {
        if (!hasMessage) await page.locator('#system-message-container').evaluate(element => element.replaceChildren());
        await page.waitForFunction(() => Math.abs(document.querySelector('.smartbrowser-shell').getBoundingClientRect().bottom - innerHeight) <= 2);
        const geometry = await page.locator('.smartbrowser-shell').evaluate(element => ({
          bottom: element.getBoundingClientRect().bottom, viewport: innerHeight,
          scroll: document.documentElement.scrollHeight,
          results: document.querySelector('.resource-main > .resource-browser').getBoundingClientRect().height,
        }));
        check(Math.abs(geometry.bottom - geometry.viewport) <= 2 && geometry.scroll <= geometry.viewport + 2 && geometry.results > 100, `Picker height ${view}/${width}/${hasMessage}: ${JSON.stringify(geometry)}`);
      }
    }
  }
  check(!errors.length, errors.join('; '));
  return 'Upload selects and reveals both new files in grid/list; status above selection panel and fill height verified before/after dismissal and desktop/mobile resize';
}
