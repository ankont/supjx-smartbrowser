async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const context of ['nativeToolbar=1', 'frontendFixture=1&clippedFixture=1']) {
    await page.goto('http://127.0.0.1:8791');
    await page.evaluate(() => { localStorage.removeItem('smartbrowser.displayMode'); sessionStorage.clear(); });
    await page.goto('http://127.0.0.1:8791?view=browser&longFixture=1&' + context);
    await page.locator('.resource-browser-item').nth(119).waitFor({ state: 'attached' });
    await page.evaluate(() => scrollTo(0, 800));
    await page.waitForTimeout(150);
    const state = await page.evaluate(() => {
      const shell = document.querySelector('.sb-redesigned-browser');
      const native = document.querySelector('.subhead');
      const rect = el => el.getBoundingClientRect();
      const intro = native ? document.querySelector('#sb-native-intro') : document.querySelector('.sb-browser-heading');
      const actions = document.querySelector('.sb-browser-header .resource-actions');
      const top = native ? 0 : parseFloat(shell.style.getPropertyValue('--sb-page-inset'));
      return { top, introBottom: rect(intro).bottom, actionsTop: rect(actions).top,
        headerBottom: rect(native || document.querySelector('.sb-browser-header')).bottom,
        toolbarTop: rect(document.querySelector('.resource-main > .resource-toolbar')).top,
        background: getComputedStyle(document.querySelector('.sb-browser-header')).backgroundColor };
    });
    if (state.introBottom > state.top + 2 || Math.abs(state.actionsTop - state.top) > 2 || Math.abs(state.toolbarTop - state.headerBottom) > 2) throw Error(JSON.stringify({context, ...state}));
    if (!context.startsWith('native') && state.background === 'rgba(0, 0, 0, 0)') throw Error('Sticky actions expose results underneath');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(150);
    if (!await page.locator('.resource-dashboard-link').isVisible()) throw Error('First row did not return');
  }
  return 'Only the action row stays pinned in backend/frontend; first row scrolls out and opaque frontend chrome hides results';
}
