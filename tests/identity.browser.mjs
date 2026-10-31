async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.setContent(`<link rel="stylesheet" href="/package/component/media/css/identity.css">
    <style>@font-face{font-family:'Font Awesome 6 Free';font-weight:900;src:url('/joomla/media/vendor/fontawesome-free/webfonts/fa-solid-900.woff2')}
    *{box-sizing:border-box}.p-2{padding:.5rem!important}.pt-0{padding-top:0!important}
    body{font:16px Arial}h1{font:40px Georgia}</style>
    <a><span class="p-2 pt-0 icon-sb-brand"></span>Dashboard</a>
    <h1><span class="icon-sb-brand"></span>Dashboard</h1>`);
  await page.evaluate(() => document.fonts.ready);
  for (const icon of await page.locator('.icon-sb-brand').all()) {
    const result = await icon.evaluate(el => {
      const root = getComputedStyle(el), folder = getComputedStyle(el, '::before'), grip = getComputedStyle(el, '::after');
      return { padding: root.padding, folder: folder.position, grip: grip.position, left: parseFloat(folder.left), right: parseFloat(grip.right) };
    });
    if (result.padding !== '0px' || result.folder !== 'absolute' || result.grip !== 'absolute'
      || result.left !== 0 || !(result.right > 0)) throw Error(JSON.stringify(result));
  }
  return 'Shared icon layers retain their viewport despite later Bootstrap menu padding';
}
