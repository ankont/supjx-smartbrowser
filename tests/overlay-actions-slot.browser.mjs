async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.waitForFunction(() => window.SmartBrowserPicker?.registerVisualOverlay && window.SmartBrowser?.mountCollection);
  await page.evaluate(() => {
    window.actionSlots = { mounts: 0, cleanups: 0 };
    SmartBrowserPicker.registerImagePresentation({ id: 'example.reset', styles: [], apply() {},
      hasChanges: context => Boolean(context.getMetadata('smartcrop.crop')),
      reset: context => context.setMetadata('smartcrop.crop', null) });
    window.removeActionOverlay = SmartBrowserPicker.registerVisualOverlay({
      id: 'example.action-slot',
      mount(layer, context) {
        if (!context.actionsContainer) return;
        actionSlots.mounts++;
        const button = layer.ownerDocument.createElement('button');
        button.type = 'button'; button.className = 'selected';
        button.innerHTML = '<span class="fas fa-scissors" aria-hidden="true"></span><span>4:3</span>';
        button.setAttribute('aria-label', 'Crop 4:3');
        context.actionsContainer.append(button);
        return () => { actionSlots.cleanups++; button.remove(); };
      },
    });
  });
  const field = page.locator('.sb-selection-field').first();
  const slot = field.locator('.resource-lightweight-preview-action');
  await slot.getByRole('button', { name: 'Crop 4:3' }).waitFor();
  const crop = await slot.getByRole('button', { name: 'Crop 4:3' }).boundingBox();
  if (Math.abs(crop.height - 26) > 1 || crop.width <= 26) throw Error('Text action does not use shared sizing');
  const eye = field.locator('.resource-lightweight-eye-action button');
  if (await eye.count()) {
    const box = await eye.boundingBox();
    if (Math.abs(box.width - 26) > 1 || box.x < crop.x + crop.width || Math.abs(crop.y - box.y) > 1) throw Error('Eye/action overlap or misalignment');
  }
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'no-eye-actions'; document.body.append(target);
    window.noEye = SmartBrowser.mountCollection(target, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectedResources: true,
      referenceItems: true, multiple: false, contextActions: false, selectionUseData: 'readonly', selectionProfile: {},
      items: [{ selection: { adapter: 'articles', id: 'article:1' }, usage: {} }], translate: key => Joomla.Text._(key, key) });
    await noEye.ready;
    const withEye = document.createElement('div'); withEye.id = 'with-eye-actions'; document.body.append(withEye);
    window.eyeCollection = SmartBrowser.mountCollection(withEye, { apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectedResources: true,
      referenceItems: true, multiple: false, contextActions: true, resourceActions: [{ id: 'preview', requiresSelection: true, label: 'Preview' }],
      selectionUseData: 'editable',
      items: [{ selection: { adapter: 'articles', id: 'article:1' }, usage: { 'ext.smartcrop.crop': { ratio: '4:3' }, 'ext.example.keep': true } }], translate: key => Joomla.Text._(key, key) });
    await eyeCollection.ready;
  });
  const noEyeSlot = page.locator('#no-eye-actions .resource-lightweight-preview-action');
  await noEyeSlot.getByRole('button', { name: 'Crop 4:3' }).waitFor();
  if (await noEyeSlot.locator('.resource-lightweight-icon-action').count()) throw Error('No-eye test unexpectedly has preview');
  if (await noEyeSlot.locator('button').count() !== 1) throw Error('Unexpected empty action positions');
  const withEyeSlot = page.locator('#with-eye-actions .resource-lightweight-preview-action');
  const nativeEye = page.locator('#with-eye-actions .resource-lightweight-eye-action button');
  await nativeEye.waitFor();
  const eyeBox = await nativeEye.boundingBox();
  const cropBox = await withEyeSlot.getByRole('button', { name: 'Crop 4:3' }).boundingBox();
  if (Math.abs(eyeBox.width - 26) > 1 || eyeBox.x < cropBox.x + cropBox.width || Math.abs(cropBox.y - eyeBox.y) > 1) throw Error('Eye/action overlap or misalignment');
  const reset = withEyeSlot.locator('button').first();
  if (!await reset.locator('.fa-times').count()) throw Error('Reset must be first when crop metadata exists');
  await reset.click();
  await page.waitForFunction(() => eyeCollection.getItems()[0].usage['ext.smartcrop.crop'] === null);
  if (await withEyeSlot.locator('.fa-times').count()) throw Error('Reset remains after reverting preview');
  if (!(await page.evaluate(() => eyeCollection.getItems()[0].usage['ext.example.keep']))) throw Error('Reset removed unrelated metadata');
  await page.evaluate(() => removeActionOverlay());
  await page.waitForFunction(() => !document.querySelector('button[aria-label="Crop 4:3"]'));
  const counts = await page.evaluate(() => actionSlots);
  if (counts.mounts !== counts.cleanups) throw Error(`Orphan actions: ${JSON.stringify(counts)}`);
  await page.screenshot({ path: 'build/preview-action-order.png', fullPage: true });
  return 'Editing actions left, eye right; persisted crop reset, metadata preservation, shared sizing and cleanup passed.';
}
