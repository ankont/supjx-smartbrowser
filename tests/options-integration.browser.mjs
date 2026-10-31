async page => {
  await page.goto('http://127.0.0.1:8791');
  for (const prefix of ['jform', 'jform[params]']) {
    await page.setContent(`<fieldset id="fieldset-integration_general"><div class="form-grid">
      <div class="control-group"><div class="control-label"><label>Global Replacement</label></div><div class="controls"><fieldset><div class="switcher"><input type="radio" name="${prefix}[replace_all]" value="1" checked><input type="radio" name="${prefix}[replace_all]" value="0"></div></fieldset></div></div>
      <div class="control-group" id="hint"><div class="alert alert-info">Hint</div></div>
      </div></fieldset><fieldset id="fieldset-integration_navigation">Individual navigation</fieldset>
      <fieldset id="fieldset-integration_display"><legend>General Integrations</legend><div class="control-group" id="menu-visibility"><input name="${prefix}[hide_component_menu]"></div><input name="${prefix}[show_dashboard_icon]"></fieldset>
      <script src="http://127.0.0.1:8791/package/component/media/js/icon-settings.js"></script>`);
    await page.waitForSelector('.sb-integration-legend');
    const check = async hidden => {
      const state = await page.evaluate(() => {
        const menu = document.getElementById('menu-visibility'), hint = document.getElementById('hint');
        return { visible: !!menu.getBoundingClientRect().height, sameGroup: menu.parentElement === hint.parentElement,
          afterReplacement: !!(hint.parentElement.compareDocumentPosition(menu.parentElement) & Node.DOCUMENT_POSITION_FOLLOWING),
          navigationHidden: document.getElementById('fieldset-integration_navigation').hidden };
      });
      if (!state.visible || state.sameGroup || !state.afterReplacement || state.navigationHidden !== hidden) throw Error(JSON.stringify(state));
    };
    await check(true);
    await page.locator(`input[value="0"]`).check();
    await check(false);
  }
  return 'General integrations stay below Replacement and available with either switch state';
}
