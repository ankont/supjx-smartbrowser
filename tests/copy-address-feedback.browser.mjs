async page => {
  const check = (condition, message) => { if (!condition) throw Error(message); };
  await page.goto('http://127.0.0.1:8791?fieldFixture=1');
  const field = page.locator('.sb-selection-field').first();
  const button = field.locator('.resource-selection-path button');
  await button.waitFor();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { async writeText(value) { window.copiedAddress = value; } } });
    Joomla.renderMessages = messages => { window.copyErrors = messages; };
  });
  const address = await field.locator('.resource-selection-path input').inputValue();
  await button.click();
  check(await button.evaluate(element => element.classList.contains('is-copied')), 'Successful copy has no visible feedback');
  check(await button.locator('.fa-check').count() === 1, 'Successful copy did not show a checkmark');
  check(await page.evaluate(() => window.copiedAddress) === address, 'Copied text differs from the displayed address');
  check(await field.locator('[role="status"]').filter({ hasText: 'COM_SMARTBROWSER_COPIED' }).count() === 1, 'Copy feedback is not announced');
  await field.evaluate(async root => SmartBrowser.mountSelectionField(root).setItems([{ selection: { adapter: 'media', id: 'local-images:/b.png' }, usage: {} }]));
  check(!await button.evaluate(element => element.classList.contains('is-copied')), 'Copy feedback leaked to a different resource');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw Error('Clipboard denied'); }; });
  await button.click();
  check(!await button.evaluate(element => element.classList.contains('is-copied')), 'Failed copy reports success');
  check(await page.evaluate(() => Boolean(window.copyErrors?.error?.length)), 'Failed copy did not report an error');
  return 'Address copy success, accessible feedback, resource-change reset and clipboard failure verified';
}
