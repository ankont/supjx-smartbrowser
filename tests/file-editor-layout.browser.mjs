async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(async () => {
    const { default: Driver } = await import('/resources/js/adapters/MediaActionDriver.js');
    const resource = { id: 'local-files:/notes.txt', title: 'notes.txt', type: 'document', capabilities: { rename: true }, metadata: { mimeType: 'text/plain', extension: 'txt' } };
    const content = btoa(Array.from({ length: 250 }, (_, index) => `LINE ${index}: beginning must remain visible`).join('\n'));
    const driver = new Driver({ options: {}, execute: async () => ({ kind: 'text', resource, content, revision: 'test' }) }, {}, async () => {}, key => ({ COM_SMARTBROWSER_EDIT_TEXT: 'Edit text', COM_SMARTBROWSER_SAVE_AS_COPY: 'Save as Copy' })[key] || key);
    window.layoutEditor = driver;
    await driver.editMedia(resource);
  });
  await page.getByRole('tab', { name: 'Edit text', exact: true }).click();
  const exitLabel = page.locator('[data-exit-label]');
  if (await exitLabel.textContent() !== 'JCLOSE') throw Error('Unmodified popup must offer Close');
  await page.locator('.smartbrowser-file-text').fill('Edited text');
  if (await exitLabel.textContent() !== 'JCANCEL') throw Error('Modified popup must offer Cancel');
  await page.getByRole('button', { name: 'JRESET', exact: true }).click();
  const box = await page.locator('.smartbrowser-file-text').evaluate(el => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, scroll: el.scrollTop, value: el.value.slice(0, 6), panelTop: el.parentElement.getBoundingClientRect().top, panelBottom: el.parentElement.getBoundingClientRect().bottom }));
  if (box.value !== 'LINE 0' || box.scroll || box.top < box.panelTop || box.bottom > box.panelBottom + 1) throw Error('Text is clipped: ' + JSON.stringify(box));
  const size = page.locator('.smartbrowser-editor-size');
  const centred = await size.evaluate(button => { const b = button.getBoundingClientRect(), icon = button.querySelector('span').getBoundingClientRect(); return Math.abs(b.x + b.width / 2 - icon.x - icon.width / 2) < 1 && Math.abs(b.y + b.height / 2 - icon.y - icon.height / 2) < 1; });
  if (!centred) throw Error('Fullscreen icon not centred');
  await size.hover();
  if (await size.evaluate(el => getComputedStyle(el).backgroundColor) !== 'rgb(36, 55, 79)') throw Error('Fullscreen hover differs from picker');
  await page.getByRole('tab', { name: 'COM_SMARTBROWSER_CONTENT_TAB', exact: true }).click();
  if (!await page.locator('[name="name"]').isVisible() || await page.locator('.smartbrowser-file-text').isVisible()) throw Error('Content tab was replaced by editor');
  await page.evaluate(() => layoutEditor.destroy());
  return 'Text editing has its own tab, starts at the first line, fits its viewport, and fullscreen icon alignment/colours match the picker';
}
