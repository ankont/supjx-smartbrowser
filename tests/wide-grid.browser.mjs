async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const templates = [
    ['Cassiopeia', '/joomla/media/templates/site/cassiopeia/css/template.css'],
    ['Education Time', '/second-site/templates/education_time/css/template.css'],
  ];
  let cases = 0;
  for (const [template, path] of templates) {
    const response = await page.request.get('http://127.0.0.1:8791' + path);
    check(response.ok(), `Template fixture unavailable: ${template}`);
    const css = await response.text();
    await page.route('**/template-under-test.css', route => route.fulfill({ contentType: 'text/css', body: css }));
    await page.goto('http://127.0.0.1:8791/tests/fixtures/wide-grid.html');
    for (const width of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const results = await page.evaluate(async () => {
        const { createDisplayMode } = await import('/resources/js/core/displayMode.js');
        const results = [];
        for (const root of document.querySelectorAll('.wide-case .smartbrowser')) {
          const ancestors = [];
          for (let element = root; element && element !== document.body; element = element.parentElement) ancestors.push(element);
          const snapshot = () => ancestors.map(element => ({ attrs: [...element.attributes].filter(attr => attr.name !== 'style' || attr.value.trim()).map(attr => [attr.name, attr.value]), box: element.getBoundingClientRect().toJSON() }));
          const controller = createDisplayMode(root);
          controller.set('normal', false);
          const before = snapshot();
          controller.set('wide', false);
          const box = root.getBoundingClientRect();
          const viewport = document.documentElement.clientWidth;
          const symmetric = Math.abs(box.left - (viewport - box.right)) < 1.5;
          const contained = box.left >= -1 && box.right <= viewport + 1;
          const rowChanges = ancestors.filter(element => element.classList.contains('row')).map(element => element.hasAttribute('data-sb-wide-sizing'));
          controller.set('focus', false); controller.set('normal', false); controller.destroy();
          const after = snapshot();
          const restored = before.every((entry, index) => JSON.stringify(entry.attrs) === JSON.stringify(after[index].attrs)
            && ['x', 'y', 'width', 'height'].every(key => Math.abs(entry.box[key] - after[index].box[key]) < 1));
          const differences = restored ? [] : before.flatMap((entry, index) => JSON.stringify(entry) === JSON.stringify(after[index]) ? [] : [{ before: entry, after: after[index] }]).slice(0, 1);
          results.push({ id: root.id, symmetric, contained, restored, differences, rowChanges, left: box.left, right: viewport - box.right });
        }
        return results;
      });
      for (const result of results) {
        check(result.symmetric && result.contained && result.restored && result.rowChanges.every(value => !value), `${template} ${width}px: ${JSON.stringify(result)}`);
        cases++;
      }
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.evaluate(async () => {
      const { createDisplayMode } = await import('/resources/js/core/displayMode.js');
      window.wideResizeTests = ['responsive-browser', 'grid-browser'].map(id => createDisplayMode(document.getElementById(id)));
      window.wideResizeTests.forEach(controller => controller.set('wide', false));
    });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(50);
      const resized = await page.locator('#responsive-browser, #grid-browser').evaluateAll(elements => elements.every(element => {
        const box = element.getBoundingClientRect();
        return Math.abs(box.left - (document.documentElement.clientWidth - box.right)) < 1.5 && box.width >= document.documentElement.clientWidth - 50;
      }));
      check(resized, `${template}: active wide mode failed after resizing to ${width}px`);
    }
    await page.evaluate(() => window.wideResizeTests.forEach(controller => controller.destroy()));
    await page.unroute('**/template-under-test.css');
  }
  return { cases, templates: templates.map(([name]) => name), verified: 'Symmetric gutters, fixed and grid container expansion, focus transition and exact DOM/style/geometry restoration at desktop/tablet/mobile widths' };
}
