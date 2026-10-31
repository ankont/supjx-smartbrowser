// The HTML fixture is rendered by build/check-native-image-editor.php against a local Joomla.
async page => {
  const check = (condition, message) => { if (!condition) throw Error(message); };
  const html = await (await page.request.get('http://127.0.0.1:8791/build/native-image-editor.html')).text();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791/build/native-image-editor.html');
  await page.waitForFunction(() => window.SmartBrowserImageEditor);
  const initial = await page.evaluate(() => Joomla.getOptions('com_media').contents);
  await page.goto('http://127.0.0.1:8791');
  await page.route(url => url.searchParams.get('view') === 'mediaeditor', route => route.fulfill({ contentType: 'text/html', body: html }));
  await page.evaluate(async content => {
    const { default: Driver } = await import('/resources/js/adapters/MediaActionDriver.js');
    const resource = { id: 'local-images:/joomla_black.png', title: 'joomla_black.png', type: 'image', capabilities: { rename: true, copy: true }, metadata: { mimeType: 'image/png', extension: 'png', url: 'data:image/png;base64,' + content } };
    window.imageEditorCalls = [];
    const api = { options: { apiBaseUrl: location.origin + '/index.php?option=com_smartbrowser' }, async execute(action, ids, payload) {
      imageEditorCalls.push({ action, payload });
      if (action === 'writeFile') content = payload.content;
      return { kind: 'image', content, revision: 'test', resource };
    } };
    window.testImageDriver = new Driver(api, {}, async () => {}, key => key);
    await testImageDriver.editMedia(resource);
  }, initial);
  const frame = page.frameLocator('.smartbrowser-file-image-editor');
  await frame.locator('#jform_crop_x').waitFor({ state: 'attached' });
  await page.waitForFunction(() => document.querySelector('.smartbrowser-file-image-editor')?.contentWindow?.SmartBrowserImageEditor);
  check((await frame.locator('#myTab').evaluate(() => Object.keys(Joomla.MediaManager.Edit.plugins))).sort().join(',') === 'crop,resize,rotate', 'Native image plugins not registered');
  await page.locator('[data-action="apply"]').click();
  check(await page.evaluate(() => !imageEditorCalls.some(call => call.action === 'writeFile')), 'Opening Content must not modify image contents');
  check(await page.locator('#smartbrowser-preview-content [name="name"]').isVisible(), 'Content was replaced by image tools');
  await page.locator('[data-image-tab="attrib-resize"]').click();
  check(await page.locator('.smartbrowser-preview-tabs [data-image-tab]').count() === 3, 'Image tools do not share the main tab bar');
  await frame.locator('#jform_resize_width').fill('120');
  await frame.locator('#jform_resize_width').press('Tab');
  await page.locator('[data-action="apply"]').click();
  await page.waitForFunction(() => imageEditorCalls.some(call => call.action === 'writeFile'));
  check(await page.evaluate(initial => imageEditorCalls.find(call => call.action === 'writeFile').payload.content !== initial, initial), 'Resize was not sent through the host save action');
  await page.locator('[data-image-tab="attrib-rotate"]').click();
  await frame.locator('#jform_rotate_a').fill('90');
  await frame.locator('#jform_rotate_a').press('Tab');
  await page.getByRole('button', { name: 'JRESET', exact: true }).click();
  check(await frame.locator('#myTab').evaluate(() => SmartBrowserImageEditor.getContent()) === await page.evaluate(() => imageEditorCalls.find(call => call.action === 'writeFile').payload.content), 'Reset must restore the last saved image');
  await page.evaluate(() => testImageDriver.destroy());
  await page.unrouteAll({ behavior: 'ignoreErrors' });
  return 'Real Joomla crop/resize/rotate form, image editing, host Apply, Reset and cleanup passed';
}
