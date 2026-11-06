async page => {
  const check = (condition, message) => { if (!condition) throw Error(message); };
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791/tests/fixtures/legacy-template-compatibility.html');
  await page.waitForFunction(() => document.querySelector('#dependent').classList.contains('hidden'));
  check(!await page.locator('#dependent').isVisible(), 'Joomla showon hidden class was overridden');
  check(!await page.locator('#explicit-hidden').isVisible(), 'Explicitly hidden form row was overridden');
  await page.locator('#enable-yes').check();
  check(await page.locator('#dependent').isVisible(), 'Showon did not reveal the dependent control');
  await page.locator('#enable-no').check();
  check(!await page.locator('#dependent').isVisible(), 'Showon did not hide the dependent control again');

  const gap = await page.locator('.resource-adapter').evaluate(element => element.querySelector('.resource-adapter-roots').getBoundingClientRect().top - element.querySelector('summary').getBoundingClientRect().bottom);
  check(Math.abs(gap) <= 1, `Tree header gap: ${gap}`);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const direction of ['ltr', 'rtl']) {
      await page.locator('html').evaluate((element, direction) => { element.dir = direction; }, direction);
      const bounds = await page.locator('#adminForm .col-lg-3 .controls').evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect(), parent = element.closest('.options-form').getBoundingClientRect();
        return { left: box.left, right: box.right, parentLeft: parent.left, parentRight: parent.right, viewport: innerWidth };
      }));
      check(bounds.every(box => box.left >= box.parentLeft - 1 && box.right <= box.parentRight + 1 && box.left >= -1 && box.right <= box.viewport + 1), `Sidebar control overflow: ${JSON.stringify({ width, direction, bounds })}`);
    }
  }
  await page.locator('html').evaluate(element => { element.dir = 'ltr'; });
  const centres = await page.locator('.smartbrowser-editor-native, .smartbrowser-editor-size, .resource-display-toggle').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect(), icon = element.firstElementChild.getBoundingClientRect();
    return Math.abs(box.left + box.width / 2 - icon.left - icon.width / 2);
  }));
  check(centres.every(offset => offset < 1), `Icon centring: ${JSON.stringify(centres)}`);
  const wide = await page.evaluate(async () => {
    const { createDisplayMode } = await import('/resources/js/core/displayMode.js');
    const root = document.querySelector('#browser'), controller = createDisplayMode(root);
    controller.set('wide', false);
    const style = getComputedStyle(root), result = { left: parseFloat(style.paddingLeft), right: parseFloat(style.paddingRight) };
    controller.set('normal', false);
    result.restored = !root.hasAttribute('data-sb-wide');
    controller.destroy();
    return result;
  });
  check(wide.left >= 12 && wide.right >= 12 && wide.restored, `Wide view spacing: ${JSON.stringify(wide)}`);
  return 'Tree spacing, wide-view gutters, legacy form offsets, icon centring and native Joomla showon verified';
}
