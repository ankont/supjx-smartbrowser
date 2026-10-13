async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.removeItem('supjx.smartbrowser.collection.view.single-layout'));
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  const control = page.locator('.sb-selection-field').first();
  await control.locator('.resource-info-panel').waitFor();
  await control.evaluate(element => {
    const media = document.createElement('joomla-field-media');
    media.innerHTML = '<div class="field-media-preview">No image selected.</div>';
    document.body.append(media);
    window.SmartBrowser.mountSelectionField(element).attachPreview(media);
  });
  await control.getByRole('button', { name: 'Remove', exact: true }).click();
  await control.locator('.resource-info-empty').waitFor();
  if (await control.locator('.resource-preview-add').count() !== 1) throw new Error('Missing collapsed empty-selection Add');
  const placeholder = control.locator('.resource-info-panel > h3');
  if (!await placeholder.isVisible()) throw new Error('Missing empty image name placeholder');
  if (await control.locator('.field-media-preview').evaluate(element => getComputedStyle(element).fontSize) !== '0px') throw new Error('Empty message still displayed inside preview');
  await control.locator('.sb-collection-count-toggle').click();
  if (await control.locator('.resource-preview-add').count()) throw new Error('Compact Add shown while Grid/List is open');
  await control.getByRole('button', { name: 'Information', exact: true }).click();
  await control.locator('.panel-right').waitFor();
  if (await control.locator('.resource-info-panel .resource-preview-add, .resource-info-empty .btn').count()) throw new Error('Duplicate Add in side Information');
  if (await control.locator('.sb-selection-empty .btn').count() !== 1) throw new Error('Missing list empty-state selection command');
  if (await placeholder.count() !== 1) throw new Error('Duplicate empty image name placeholder');
  return 'Empty image name remains below preview; compact Add appears only with the list collapsed; side Information has no duplicate Add.';
}
