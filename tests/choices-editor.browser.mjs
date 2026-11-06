async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8791/tests/fixtures/choices-editor.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!document.querySelector('#tags').choicesInstance);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const direction of ['ltr', 'rtl']) {
      await page.locator('html').evaluate((element, direction) => { element.dir = direction; }, direction);
      const checkGeometry = async () => {
        const result = await page.locator('#tags .choices__inner').evaluate(element => {
          const input = element.querySelector('input'), box = element.getBoundingClientRect(), rect = input.getBoundingClientRect();
          return { contained: rect.left >= box.left && rect.right <= box.right, border: getComputedStyle(input).borderTopWidth, arrow: getComputedStyle(element, '::after').content, innerScroll: element.scrollWidth, innerWidth: element.clientWidth };
        });
        check(result.contained && result.border === '0px' && result.arrow === '""' && result.innerScroll <= result.innerWidth + 1, `${width}/${direction}: ${JSON.stringify(result)}`);
      };
      await checkGeometry();
      const input = page.locator('#tags input.choices__input--cloned');
      await input.fill('History');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('Enter');
      check(await page.locator('#tags select').evaluate(element => [...element.selectedOptions].some(option => option.value === 'history')), 'Keyboard tag selection failed');
      check(await page.locator('#adminForm').evaluate(element => new FormData(element).getAll('tags[]').includes('history')), 'Native submitted value lost');
      await page.locator('#tags .choices__list--multiple button').click();
      check(await page.locator('#tags select').evaluate(element => element.selectedOptions.length === 0), 'Tag removal failed');
      await page.locator('#tags').evaluate(element => element.choicesInstance.setChoiceByValue('school'));
      await checkGeometry();
      await page.locator('#tags .choices__list--multiple button').click();
    }
  }
  check(await page.locator('.com-smartbrowser-editor .choices').count() === 3, 'Choices initialized twice');
  check(await page.locator('#disabled-tags select').isDisabled(), 'Disabled state changed');
  check(await page.locator('#outside .choices__inner').evaluate(element => getComputedStyle(element, '::after').content) === 'none', 'Styles leaked outside editor');
  check(!errors.length, errors.join('; '));
  return 'Native Joomla Choices single/multiple controls, long placeholder/chips, keyboard select/remove, submitted values and disabled state verified at narrow/wide LTR/RTL widths';
}
