async page => {
  await page.goto('http://127.0.0.1:8791');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const type of ['article', 'category', 'tag', 'menu-item', 'user']) {
      for (const view of ['tabs', 'accordion']) {
        await page.setContent(`<!doctype html><html><head>
          <link rel="stylesheet" href="/package/component/media/css/editor.css">
          <style>body{margin:20px;padding:24px}*{box-sizing:border-box}.container-fluid{padding:24px}.row{display:flex;margin-inline:-12px}.d-flex{display:flex}.btn{padding:12px}joomla-tab,joomla-tab-element{display:block} .title-alias{height:140px} [role=tablist]{height:48px} .tall-field{height:1600px}</style>
          </head><body><div class="com-smartbrowser-editor container-fluid is-aligned-editor" data-resource-type="${type}">
          <form id="adminForm"><div class="smartbrowser-editor-actions d-flex"><button type="button" class="btn">Save</button><button type="button" class="btn">Close</button></div>
          <div class="smartbrowser-editor-content"><div class="row title-alias"><label>Title<input id="title"></label></div><div class="main-card"><joomla-tab id="smartbrowserEditorTabs" view="${view}"><div role="tablist">Content</div><joomla-tab-element><div class="tall-field">Content</div><input id="last" aria-label="Last field"></joomla-tab-element></joomla-tab></div></div></form></div>
          <script src="/package/component/media/js/editor-viewport.js"></script></body></html>`);
        await page.waitForFunction(() => document.documentElement.classList.contains('sb-editor-modal-document'));
        const before = await page.locator('.title-alias').boundingBox();
        const toolbar = await page.locator('.smartbrowser-editor-actions').boundingBox();
        const bounds = await page.locator('#adminForm').evaluate(el => ({ left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, width: innerWidth, overflow: el.scrollWidth - el.clientWidth }));
        if (Math.abs(toolbar.y) > 1 || Math.abs(bounds.left) > 1 || Math.abs(bounds.right - bounds.width) > 1 || bounds.overflow > 1) throw Error(`${type}: inset scrollbar or horizontal overflow: ${JSON.stringify(bounds)}`);
        if (before.y - toolbar.y - toolbar.height > 20) throw Error(`${type}: excess title gap`);
        await page.locator('#adminForm').evaluate(el => { el.scrollTop = 500; });
        const result = await page.evaluate(() => ({
          title: document.querySelector('.title-alias').getBoundingClientRect().bottom,
          toolbar: document.querySelector('.smartbrowser-editor-actions').getBoundingClientRect().top,
          panelOverflow: getComputedStyle(document.querySelector('joomla-tab-element')).overflowY,
          scroll: document.querySelector('#adminForm').scrollTop,
          body: document.scrollingElement.scrollTop,
        }));
        if (result.title >= 0 || Math.abs(result.toolbar) > 1 || result.panelOverflow !== 'visible' || result.scroll < 400 || result.body) throw Error(`${type}/${view}/${width}: incorrect scrolling ${JSON.stringify(result)}`);
        await page.getByLabel('Last field').focus();
        const last = await page.getByLabel('Last field').boundingBox();
        if (last.y < 72 || last.y + last.height > 900) throw Error(`${type}: final field unreachable`);
      }
    }
    await page.screenshot({ path: `build/editor-scroll-${width}.png` });
  }
  return 'All five editor types scroll the whole form with a sticky toolbar, compact title gap and reachable final fields; tabs/accordion on desktop/mobile passed.';
}
