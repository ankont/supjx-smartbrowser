async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => localStorage.removeItem('smartbrowser.displayMode'));
  await page.goto('http://127.0.0.1:8791?view=browser&frontendFixture=1');
  await page.locator('.sb-browser-title').waitFor();
  await page.evaluate(() => {
    localStorage.removeItem('smartbrowser.displayMode');
    const wrapper = document.createElement('div'); wrapper.id = 'template-surface';
    wrapper.style.cssText = 'background-color:rgb(241, 235, 220);background-image:linear-gradient(45deg, transparent 75%, rgba(30,60,90,.1) 75%);background-size:40px 40px';
    const app = document.getElementById('smartbrowser-app'); app.before(wrapper); wrapper.append(app);
    app.style.setProperty('--original-host-style', 'retained');
  });
  const display = page.locator('.sb-heading-controls .resource-display-toggle');
  await display.click(); // wide
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.sb-browser-header')).backgroundColor === 'rgb(241, 235, 220)');
  await display.click(); // focus
  await page.waitForSelector('#smartbrowser-app[data-sb-focus]');
  const surface = await page.locator('#smartbrowser-app').evaluate(el => ({ colour: getComputedStyle(el).backgroundColor,
    image: getComputedStyle(el).backgroundImage, size: getComputedStyle(el).backgroundSize }));
  if (surface.colour !== 'rgb(241, 235, 220)' || !surface.image.includes('linear-gradient') || surface.size !== '40px 40px') throw Error(JSON.stringify(surface));
  await page.keyboard.press('Escape');
  await page.waitForSelector('#template-surface > #smartbrowser-app:not([data-sb-focus])');
  const reset = await page.locator('#smartbrowser-app').evaluate(el => ({ colour: getComputedStyle(el).backgroundColor,
    snapshot: el.style.getPropertyValue('--sb-focus-background-color'), original: el.style.getPropertyValue('--original-host-style') }));
  if (reset.colour !== 'rgba(0, 0, 0, 0)' || reset.snapshot || reset.original !== 'retained') throw Error('Surface reset failed: ' + JSON.stringify(reset));
  if (await page.locator('.sb-browser-header').evaluate(el => getComputedStyle(el).backgroundColor) !== 'rgb(241, 235, 220)') throw Error('Normal header lost its opaque page-derived background');
  return 'Fullscreen copies the page surface onto an opaque base and restores transparent normal layout and host styles';
}
