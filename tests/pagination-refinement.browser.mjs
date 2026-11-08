async page => {
  const p = await page.context().newPage(), errors = [], checked = [];
  const check = (value, message) => { if (!value) throw Error(message); };
  p.on('pageerror', error => errors.push(error.message));
  try {
    await p.goto('http://127.0.0.1:8791/');
    await p.evaluate(() => localStorage.clear());
    await p.setViewportSize({ width: 1440, height: 900 });
    for (const scenario of ['nativeToolbar=1', 'frontendFixture=1', 'frontendFixture=1&paginationFlat=1']) {
      await p.goto(`http://127.0.0.1:8791/?view=browser&paginationFixture=1&paginationTotal=125&paginationSize=37&defaultView=grid&uploadFixture=1&${scenario}`);
      const pager = p.locator('.resource-pagination'); await pager.waitFor();
      for (const y of [0, 400, 900, 0]) {
        await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120);
        check(await pager.evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight + 2; }), `Pager left viewport: ${scenario}, ${y}`);
      }
      check(await pager.getAttribute('title') === null, 'Unrelated range tooltip retained');
      check(await p.locator('.resource-grid-select-all').getAttribute('title') !== null, 'Select-all tooltip missing');
      await p.evaluate(() => Joomla.renderMessages({ success: ['Completed'] }));
      await p.waitForTimeout(150);
      check(await pager.evaluate(el => el.getBoundingClientRect().bottom <= innerHeight + 2), 'Message pushed pagination off screen');
      if (scenario.includes('nativeToolbar')) check(await p.locator('#sb-native-preferences').evaluate(el => el.getBoundingClientRect().right <= document.querySelector('.button-options').getBoundingClientRect().left), 'Personal preferences must precede Options');
      checked.push(`${scenario}: pager visible at top and while scrolling`);
    }
    await p.goto('http://127.0.0.1:8791/?view=browser&paginationFixture=1&paginationTotal=125&paginationSize=37&defaultView=grid&mode=select&uploadFixture=1');
    await p.locator('.resource-pagination').waitFor();
    await p.evaluate(() => Joomla.renderMessages({ success: ['Uploaded'] }));
    await p.waitForTimeout(150);
    const overlap = await p.evaluate(() => {
      const message = document.querySelector('#system-message-container').getBoundingClientRect();
      const pager = document.querySelector('.resource-pagination').getBoundingClientRect();
      const footer = document.querySelector('.resource-picker-collection').getBoundingClientRect();
      return message.bottom > pager.top + 2 || pager.bottom > footer.top + 2;
    });
    check(!overlap, 'Floating message overlaps pagination or selected resources');
    checked.push('Picker message, pagination and selected-resource footer do not overlap');
    await p.locator('.resource-item-select').first().click();

    await p.locator('.sb-personal-preferences-button').click();
    const dialog = p.locator('.sb-personal-preferences[open]');
    const size = dialog.locator('input[type=number]');
    const mode = dialog.locator('.sb-personal-group:has(input[type=number]) select');
    await size.fill('7'); await mode.selectOption('pages');
    check(await size.evaluate(input => input.getBoundingClientRect().top === input.closest('section').querySelector('select').getBoundingClientRect().top), 'Page size must sit beside handling mode');
    await dialog.getByRole('button', { name: 'Save & Close', exact: true }).click();
    await p.waitForFunction(() => document.querySelector('.resource-browser-grid')?.querySelectorAll('.resource-browser-item').length === 7);
    check(await p.locator('.resource-pagination').innerText() === 'Items: 1–7 of 125', 'Custom size did not apply immediately');
    check(await p.locator('.resource-item-select input').first().isChecked(), 'Changing size lost the selected item');
    await p.locator('.sb-personal-preferences-button').click();
    await mode.selectOption('all');
    await dialog.getByRole('button', { name: 'Save & Close', exact: true }).click();
    await p.waitForFunction(() => document.querySelectorAll('.resource-browser-item').length === 125);
    check(await p.locator('.resource-pagination').innerText() === 'Items: 125', 'Full-loading count missing');
    check(await p.locator('.resource-sidebar .resource-pagination').count() === 0, 'Count must not appear inside tree');
    check(await p.locator('.resource-item-select input').first().isChecked(), 'Full loading lost the selected item');
    await p.locator('.sb-personal-preferences-button').click();
    await mode.selectOption('pages'); await size.fill('');
    await dialog.getByRole('button', { name: 'Save & Close', exact: true }).click();
    await p.waitForFunction(() => document.querySelector('.resource-pagination')?.textContent.includes('1–37'));
    checked.push('Arbitrary size, full loading and global size apply immediately in the same Picker');
    check(!errors.length, errors.join('\n'));
    return { checked, errors };
  } finally { await p.close(); }
}
