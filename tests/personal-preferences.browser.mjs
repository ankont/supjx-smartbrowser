async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let generation = 'personal-test', values = {};
  await page.route('**/*task=api.preferences*', async route => {
    const payload = route.request().postDataJSON();
    if (payload.operation === 'reset') { values = {}; generation += ':reset'; }
    else for (const [key, value] of Object.entries(payload.changes || {})) { if (value === null) delete values[key]; else values[key] = value; }
    await route.fulfill({ json: { success: true, data: { saved: true, generation } } });
  });
  await page.addInitScript(() => {
    let joomla;
    Object.defineProperty(window, 'Joomla', { configurable: true, get: () => joomla, set(value) {
      const get = value.getOptions;
      const preferences = { userId: 12345, generation: 'personal-test', values: {}, apiUrl: location.origin + '/index.php?task=api.preferences', csrfToken: 'test', editorDefault: 'modal', globalDefaults: { editorMode: 'modal', contextItems: 'mixed', contextItemsByAdapter: { categories: 'show', tags: 'hide', menus: 'show' }, integration: 'partial' } };
      value.getOptions = name => name === 'com_smartbrowser.preferences' ? preferences : get(name);
      const translate = value.Text._;
      value.Text._ = key => window.testMessages?.[key] ?? translate(key);
      joomla = value;
    } });
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const application of ['site', 'administrator']) {
    await page.goto(`http://127.0.0.1:8791/tests/fixtures/picker-profiles.html?view=browser&adapter=menus&historyFixture=1&${application === 'site' ? 'frontendFixture' : 'nativeToolbar'}=1`);
    await page.locator('.resource-history-controls').waitFor();
    if (application === 'site') {
      const historyToggle = page.locator('.resource-history-controls .resource-toolbar-popup > button');
      await historyToggle.click();
      const empty = page.locator('.resource-history-empty');
      check(await empty.isVisible() && await empty.evaluate(element => getComputedStyle(element).textAlign === 'center' && getComputedStyle(element).marginTop === '0px'), 'Empty history must be centered and styled');
      await historyToggle.click();
    }
    const split = await page.locator('.resource-history-controls').evaluate(group => {
      const main = group.querySelector(':scope > button').getBoundingClientRect(), arrow = group.querySelector('.resource-toolbar-popup > button').getBoundingClientRect();
      return { group: group.getBoundingClientRect().width, arrow: arrow.width, gap: arrow.left - main.right, sameTop: Math.abs(arrow.top - main.top) < 1 };
    });
    check(split.group === 62 && split.arrow === 24 && Math.abs(split.gap) <= 1 && split.sameTop, 'History dropdown must be a strip on the main button');
    const language = application === 'site' ? 'el-GR' : 'en-GB';
    const ini = await (await page.request.get(`http://127.0.0.1:8791/package/component/admin/language/${language}/com_smartbrowser.ini`)).text();
    const messages = Object.fromEntries([...ini.matchAll(/^([A-Z0-9_]+)="(.*)"\r?$/gm)].map(match => [match[1], match[2]]));
    messages.JINLINEHELP = 'Toggle Inline Help';
    await page.evaluate(messages => { window.testMessages = messages; }, messages);
    const preferenceButton = page.locator('.sb-personal-preferences-button');
    if (application === 'site') {
      check(await page.locator('.sb-browser-heading').evaluate(heading => {
        const leading = heading.querySelector('.sb-browser-heading-leading').getBoundingClientRect(), controls = heading.querySelector('.sb-heading-controls').getBoundingClientRect();
        return getComputedStyle(heading).paddingTop === '11px' && Math.abs(leading.top + leading.height / 2 - controls.top - controls.height / 2) < 1;
      }), 'Frontend heading controls must be centered with a small top inset');
    }
    check(await preferenceButton.evaluate(button => !!(button.compareDocumentPosition(document.querySelector('.resource-manager-link')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'Preferences must precede native Joomla');
    await preferenceButton.click();
    const dialog = page.locator('.sb-personal-preferences[open]');
    check(await dialog.locator('select').count() === 5, 'Missing preference fields');
    check(await dialog.locator('select').nth(1).locator('option').count() === 3, 'Integration preferences must offer inherit, SmartBrowser and native Joomla');
    await dialog.locator('select').nth(1).selectOption('smartbrowser');
    check(await dialog.locator('select').first().locator('option[value=inherit]').innerText() === `${messages.COM_SMARTBROWSER_PERSONAL_VALUE_INHERIT} (${messages.COM_SMARTBROWSER_PERSONAL_VALUE_MODAL})`, 'Missing effective global setting');
    check(await dialog.locator('button[type=submit]').innerText() === messages.COM_SMARTBROWSER_PERSONAL_SAVE_CLOSE, 'Save label is HTML-escaped');
    check(await dialog.locator('button').last().evaluate(button => button.classList.contains('btn-danger')), 'Cancel must be red');
    check(await dialog.locator('.form-text').count() === 0, 'Inline help should start hidden');
    await dialog.getByRole('button', { name: 'Toggle Inline Help', exact: true }).click();
    check(await dialog.locator('.form-text').count() === 5, 'Inline help did not reveal every field description');
    check(await dialog.locator('.sb-personal-integration-help').innerText() === messages.COM_SMARTBROWSER_PERSONAL_INTEGRATION_DESC, 'Integration warning missing');
    await dialog.locator('select').nth(3).selectOption('adapter');
    await dialog.locator('select').nth(4).selectOption('hide');
    await dialog.locator('button[type=submit]').click();
    check(JSON.parse(values['supjx.smartbrowser.personal']).pickerNodeScope === 'adapter', 'Personal settings did not reach the server');
    const contexts = JSON.parse(values['supjx.smartbrowser.personal']).contextItemsByAdapter;
    check(contexts.menus === 'hide' && contexts.categories === 'inherit', 'Changing menus affected another contextual preference');
    check(JSON.parse(values['supjx.smartbrowser.personal']).integration === 'smartbrowser', 'Explicit SmartBrowser preference was not retained');
    await preferenceButton.click();
    check(await dialog.locator('select').nth(3).inputValue() === 'adapter', 'Reopening lost settings');
    await dialog.locator('button').last().click();
    await page.locator('.resource-history-controls .resource-toolbar-popup > button').click();
    // Navigate through the same public breadcrumb navigation used by history.
    await page.evaluate(() => document.querySelector('.resource-toolbar-popup-panel:popover-open')?.hidePopover());
    const entry = page.locator('.resource-browser-item').filter({ hasText: 'Alpha' });
    // Grid activation uses the component's normal double-click handler.
    await entry.first().dblclick();
    await page.waitForURL(/node=local-images%3A%2FAlpha/);
    await page.locator('.resource-browser-item').filter({ hasText: 'Beta' }).first().dblclick();
    await page.waitForURL(/node=local-images%3A%2FBeta/);
    await page.locator('.resource-history-controls > button').click();
    await page.waitForURL(/node=local-images%3A%2FAlpha/);
    await page.locator('.resource-history-controls > button').click();
    await page.waitForURL(/node=local-images%3A%2FBeta/);
    const currentUrl = page.url();
    const historyToggle = page.locator('.resource-history-controls .resource-toolbar-popup > button');
    await historyToggle.click();
    const clearHistory = page.locator('.resource-history-clear');
    check(await clearHistory.evaluate(button => getComputedStyle(button).borderTopWidth === '0px'), 'Clear history should be a plain footer action');
    await clearHistory.click();
    check(await page.locator('.resource-history-controls > button').isDisabled() && page.url() === currentUrl, 'Clearing history must not navigate');
    await historyToggle.click();
    check(await page.locator('.resource-history-empty').isVisible(), 'Clearing history should empty the dropdown');
    await historyToggle.click();
    await page.evaluate(async () => (await import('/resources/js/core/userPreferences.js')).preferenceStorage().flush());
    const savedHistory = Object.entries(values).find(([key]) => key.startsWith('supjx.smartbrowser.nodes.manage.'));
    check(savedHistory && JSON.parse(savedHistory[1]).trail.length === 1, 'Clearing history must persist while retaining the current location');
    await preferenceButton.click();
    await dialog.locator('.sb-personal-buttons').first().locator('button').first().click();
    check(await page.locator('.resource-history-controls > button').isDisabled(), 'Current view reset retained history');
    await dialog.locator('button').last().click();
  }
  await page.setViewportSize({ width: 390, height: 740 });
  await page.locator('.sb-personal-preferences-button').click();
  check(await page.locator('.sb-personal-preferences[open]').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth), 'Preferences overflow at mobile width');
  await page.locator('.sb-personal-preferences[open] button').last().click();
  await page.setViewportSize({ width: 1280, height: 900 });
  const dashboard = await page.evaluate(() => {
    const toolbar = document.createElement('div'); toolbar.id = 'toolbar';
    toolbar.style.cssText = 'display:flex;justify-content:space-between;width:100%';
    toolbar.innerHTML = '<h2 class="sb-dashboard-toolbar-title">Dashboard</h2><div data-sb-personal-preferences><button class="btn">My preferences</button></div><joomla-toolbar-button style="margin-inline-start:auto"><button class="btn">Options</button></joomla-toolbar-button>';
    document.body.prepend(toolbar);
    const preference = toolbar.querySelector('[data-sb-personal-preferences]').getBoundingClientRect(), options = toolbar.lastElementChild.getBoundingClientRect();
    const result = Math.abs(options.left - preference.right - 12) < 1 && options.right >= toolbar.getBoundingClientRect().right - 2;
    toolbar.remove(); return result;
  });
  check(dashboard, 'Dashboard preferences must be adjacent to right-aligned Options');
  const siteHeading = await page.evaluate(() => {
    const host = document.createElement('div'); host.className = 'smartbrowser-dashboard';
    host.innerHTML = '<header class="sb-dashboard-heading"><h1>Dashboard</h1><div data-sb-personal-preferences><button class="btn sb-personal-preferences-button">≡</button></div></header>';
    document.body.prepend(host);
    const title = host.querySelector('.sb-dashboard-heading').getBoundingClientRect(), button = host.querySelector('button').getBoundingClientRect();
    const headingStyle = getComputedStyle(host.querySelector('.sb-dashboard-heading')), titleStyle = getComputedStyle(host.querySelector('h1'));
    const result = Math.abs(title.top + title.height / 2 - button.top - button.height / 2) < 1 && button.width === 44 && button.height === 44
      && headingStyle.marginBlockStart === '24px' && headingStyle.marginBlockEnd === '24px' && titleStyle.margin === '0px';
    host.remove(); return result;
  });
  check(siteHeading, 'Frontend Dashboard preference button must align vertically with the title');
  await page.evaluate(async () => {
    const host = document.createElement('div'); host.id = 'dashboard-preferences-fixture'; host.dataset.sbPersonalPreferences = ''; document.body.prepend(host);
    await import('/package/component/media/js/personal-preferences.js');
  });
  await page.locator('#dashboard-preferences-fixture > button').click();
  const dashboardDialog = page.locator('.sb-personal-preferences[open]');
  check(await dashboardDialog.locator('select').count() === 7, 'Dashboard must expose all three contextual settings');
  check(await dashboardDialog.locator('.sb-personal-field').filter({ hasText: 'Categories' }).count() === 1, 'Dashboard category setting missing');
  const compact = await dashboardDialog.evaluate(dialog => {
    const rows = [...dialog.querySelectorAll('.sb-personal-group')].map(group => [...group.querySelectorAll('select')].map(select => select.getBoundingClientRect()));
    return rows.map(row => ({ count: row.length, aligned: row.every(rect => Math.abs(rect.top - row[0].top) < 2) }));
  });
  check(compact.map(row => row.count).join(',') === '2,2,3' && compact.every(row => row.aligned), 'Dashboard preferences must use compact 2/2/3 rows');
  await page.setViewportSize({ width: 390, height: 740 });
  check(await dashboardDialog.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth), 'Compact Dashboard overflows on mobile');
  check(await dashboardDialog.locator('.sb-personal-group').first().evaluate(group => {
    const controls = [...group.querySelectorAll('select')].map(select => select.getBoundingClientRect());
    return controls[1].top > controls[0].bottom;
  }), 'Mobile preferences must stack controls');
  await dashboardDialog.locator('button').last().click();
  check(errors.length === 0, errors.join('\n'));
  return { passed: ['Frontend and administrator default preference button placement', 'Server-backed save and reopen', 'Alternating node history', 'Current view reset'], errors };
}
