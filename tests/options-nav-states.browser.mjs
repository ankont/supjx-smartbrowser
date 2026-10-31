async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.setContent(`<link rel="stylesheet" href="/package/component/media/css/smartbrowser.css">
    <h1>SuperSoftJx - SmartBrowser: Options</h1><nav><a id="ours" href="index.php?option=com_config&view=component&component=com_smartbrowser">SuperSoftJx - SmartBrowser</a><a id="other" href="index.php?option=com_config&component=com_content">Articles</a></nav>
    <div class="sb-fixed-publication-state"><div class="switcher"><input type="radio" disabled><label>Yes</label></div></div>`);
  await page.evaluate(async () => {
    const php = await (await fetch('/package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php')).text();
    const declaration = php.match(/addScriptDeclaration\('([^\n]+querySelectorAll[^\n]+SupJx SmartBrowser[^\n]+)'\);/)[1];
    (0, eval)(declaration.replace(/\\([\\'])/g, '$1'));
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
  if (await page.locator('#ours').textContent() !== 'SupJx SmartBrowser' || await page.locator('h1').textContent() !== 'SuperSoftJx - SmartBrowser: Options'
    || await page.locator('#other').textContent() !== 'Articles') throw Error('Options display rename changed another identity');
  const opacity = await page.locator('.switcher').evaluate(el => Number(getComputedStyle(el).opacity));
  if (opacity >= 1 || opacity < .4 || !await page.locator('input').isDisabled()) throw Error('Fixed state is not visibly disabled');
  return 'Options navigation label is scoped; fixed state controls remain disabled and visibly muted';
}
