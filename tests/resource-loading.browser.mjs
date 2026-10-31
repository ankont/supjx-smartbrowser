async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const context of ['nativeToolbar=1', 'frontendFixture=1']) {
    await page.goto('http://127.0.0.1:8791?view=browser&delayedResources=1&' + context);
    await page.locator('.resource-loader[role="status"]').waitFor();
    // Atum defines this as a light/white colour, which used to hide the spinner.
    await page.addStyleTag({ content: ':root { --template-text-light: #fff; }' });
    const pending = await page.evaluate(() => {
      const loader = document.querySelector('.resource-loader');
      const row = document.querySelector('.resource-actions');
      const flat = row.querySelector('.resource-flat-toggle').getBoundingClientRect();
      const style = getComputedStyle(row);
      const edge = row.getBoundingClientRect().right - parseFloat(style.paddingRight);
      return { colour: getComputedStyle(loader).color, text: loader.textContent.trim(),
        busy: loader.parentElement.getAttribute('aria-busy'), right: flat.right, edge,
        loaderTop: loader.getBoundingClientRect().top, loaderBottom: loader.getBoundingClientRect().bottom, viewport: innerHeight };
    });
    if (pending.colour === 'rgb(255, 255, 255)' || !pending.text || pending.busy !== 'true'
      || Math.abs(pending.right - pending.edge) > 2 || pending.loaderBottom <= 0 || pending.loaderTop >= pending.viewport) throw Error(JSON.stringify(pending));
    await page.evaluate(() => releaseResourceLoad());
    await page.locator('.resource-browser-item').first().waitFor();
    if (await page.locator('.resource-loader').count()) throw Error('Loader did not clear after response');
    const right = await page.locator('.resource-flat-toggle').evaluate(el => el.getBoundingClientRect().right);
    if (Math.abs(right - pending.right) > 2) throw Error('Right controls jumped after filters arrived');
  }
  return 'Visible translated loading status and stable right-hand controls while backend/frontend resource responses are pending';
}
