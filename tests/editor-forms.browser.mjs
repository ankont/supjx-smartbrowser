async page => {
  const check = (value, message) => { if (!value) throw Error(message); };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('http://127.0.0.1:8791/editor-forms.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!document.querySelector('.field-calendar')._joomlaCalendar);
    for (const direction of ['ltr', 'rtl']) {
      await page.locator('html').evaluate((element, direction) => { element.dir = direction; }, direction);
      const labels = await page.locator('.com-smartbrowser-editor .btn-group.radio label').evaluateAll(elements => elements.map(element => ({
        text: element.textContent.trim(), color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor,
      })));
      check(labels.every(label => label.text && label.color !== label.background), `Unreadable labels: ${JSON.stringify(labels)}`);
      const inputs = await page.locator('.com-smartbrowser-editor .btn-group.radio input').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity));
      check(inputs.every(opacity => opacity === '0'), 'Radio circles visible inside buttons');
      await page.locator('label[for="plain1"]').click();
      check(await page.locator('#plain1').isChecked(), 'Standard form-check radio failed');
      await page.locator('label[for="legacy1"]').click();
      check(await page.locator('#legacy1').isChecked(), 'Legacy nested radio label failed');
      const nextSwitcher = await page.locator('.switcher input:not(:checked)').getAttribute('id');
      await page.locator('.switcher input:not(:checked)').click();
      check(await page.locator(`#${nextSwitcher}`).isChecked(), 'Native switcher failed');
      await page.locator('#buttons').evaluate(element => { element.disabled = true; });
      check(await page.locator('#buttons0').isDisabled(), 'Disabled fieldset semantics lost');
      await page.locator('#buttons').evaluate(element => { element.disabled = false; });
      for (const id of ['native-select', 'old-select']) {
        const geometry = await page.locator(`#${id}`).evaluate(element => ({ width: element.offsetWidth, parent: element.parentElement.clientWidth, helpTop: element.nextElementSibling.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom }));
        check(geometry.width > 100 && geometry.width <= geometry.parent && geometry.helpTop >= geometry.bottom, `Select/help layout: ${JSON.stringify(geometry)}`);
      }
      await page.locator('label[for="buttons1"]').click();
      check(await page.locator('#buttons1').isChecked(), 'Label click did not select native radio');
      check(await page.locator('[name="dependent"]').isVisible(), 'Native showon did not update');
      await page.locator('#buttons1').focus();
      await page.keyboard.press('ArrowLeft');
      check(await page.locator('#buttons0').isChecked(), 'Native radio keyboard navigation broke');
      check(!await page.locator('[name="dependent"]').isVisible(), 'Native showon failed to hide field');
      const focused = await page.locator('label[for="buttons0"]').evaluate(element => getComputedStyle(element).outlineStyle);
      check(focused !== 'none', 'Radio keyboard focus not visible');
      await page.locator('#native-select').selectOption('1');
      check(await page.locator('#native-select').inputValue() === '1', 'Native select value lost');
      check(await page.locator('#native-select').evaluate(element => new FormData(element.form).get('featured')) === '1', 'Native form serialization changed');
      await page.getByRole('button', { name: 'Calendar', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.js-calendar').matches(':popover-open'));
      const geometry = await page.locator('.js-calendar').evaluate(element => ({
        box: element.getBoundingClientRect().toJSON(), width: innerWidth, height: innerHeight,
        client: element.clientWidth, scroll: element.scrollWidth,
        formWidth: element.closest('form').clientWidth, formScroll: element.closest('form').scrollWidth,
      }));
      check(geometry.box.left >= 0 && geometry.box.right <= geometry.width && geometry.box.top >= 0 && geometry.box.bottom <= geometry.height, `Calendar outside editor: ${JSON.stringify(geometry)}`);
      check(geometry.scroll <= geometry.client + 1 && geometry.formScroll <= geometry.formWidth + 1, `Calendar horizontal overflow: ${JSON.stringify(geometry)}`);
      await page.waitForTimeout(100);
      const changes = await page.locator('.js-calendar').evaluate(async element => {
        let count = 0;
        const observer = new MutationObserver(records => { count += records.length; });
        observer.observe(element, { attributes: true, attributeFilter: ['style'] });
        await new Promise(resolve => setTimeout(resolve, 100));
        observer.disconnect();
        return count;
      });
      check(changes === 0, 'Calendar positioning has a feedback loop');
      const identity = await page.locator('.field-calendar').evaluate(element => { window.calendarIdentity = element._joomlaCalendar; return !!element._joomlaCalendar; });
      check(identity, 'Native calendar was not initialized');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.js-calendar').hasAttribute('popover'));
      await page.getByRole('button', { name: 'Calendar', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.js-calendar').matches(':popover-open'));
      await page.locator('#adminForm').evaluate(element => { element.scrollTop += 40; });
      await page.waitForTimeout(50);
      await page.locator('.js-calendar [data-action="today"]').click();
      check((await page.locator('#date').inputValue()).length > 0, 'Calendar date selection failed');
      await page.locator('.field-calendar').evaluate(element => element._joomlaCalendar.hide());
      await page.waitForFunction(() => !document.querySelector('.js-calendar').hasAttribute('popover'));
      check(await page.locator('.field-calendar').evaluate(element => element._joomlaCalendar === window.calendarIdentity), 'Calendar instance replaced');
    }
    // Joomla's dynamic form update event must not initialize widgets twice.
    await page.locator('.com-smartbrowser-editor').evaluate(element => element.dispatchEvent(new CustomEvent('joomla:updated', { bubbles: true })));
    check(await page.locator('.js-calendar').count() === 1, 'Duplicate calendar after dynamic initialization');
    await page.locator('.field-calendar').evaluate(element => {
      const replacement = element.cloneNode(true);
      replacement.querySelector('.js-calendar').remove();
      element.replaceWith(replacement);
      replacement.parentElement.dispatchEvent(new CustomEvent('joomla:updated', { bubbles: true }));
    });
    await page.getByRole('button', { name: 'Calendar', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.js-calendar').matches(':popover-open'));
    await page.locator('.field-calendar').evaluate(element => element._joomlaCalendar.hide());
  }
  check(!errors.length, `Console errors: ${errors.join('; ')}`);
  return 'Native Joomla legacy/buttons/switcher layouts, selects, showon, keyboard, submission and calendar clipping/scrolling verified at desktop/mobile widths in LTR/RTL';
}
