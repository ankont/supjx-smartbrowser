async page => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:8791');
  await page.setContent(`<!doctype html><html><head><style>body{margin:24px;padding:16px}.d-flex{display:flex}.tox-tinymce-aux{position:relative!important}</style><link rel="stylesheet" href="/package/component/media/css/editor.css"></head><body>
    <div class="com-smartbrowser-editor container-fluid"><form id="adminForm"><div class="smartbrowser-editor-actions d-flex"><button type="button">Save</button></div><div class="smartbrowser-editor-content"><textarea id="articletext"></textarea><div style="height:1000px"></div></div></form></div>
    <script src="/package/component/media/js/editor-viewport.js"></script></body></html>`);
  await page.addScriptTag({ url: '/joomla/media/vendor/tinymce/tinymce.min.js' });
  await page.evaluate(async () => {
    await tinymce.init({ selector: '#articletext', license_key: 'gpl', height: 450, menubar: 'edit insert', toolbar: 'cmscontent bold italic',
      setup(editor) { editor.ui.registry.addMenuButton('cmscontent', { text: 'CMS Content', fetch(callback) { callback([{ type: 'menuitem', text: 'Article', onAction() { window.cmsSelected = true; } }]); } }); },
    });
  });
  await page.getByRole('button', { name: 'CMS Content', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Article', exact: true }).waitFor({ state: 'visible', timeout: 5000 });
  const painted = await page.getByRole('menuitem', { name: 'Article', exact: true }).evaluate(el => {
    const rect = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
  });
  if (!painted) throw Error('CMS menu exists but is clipped behind the fixed editor');
  await page.screenshot({ path: 'build/editor-tinymce-cms-menu.png' });
  await page.getByRole('menuitem', { name: 'Article', exact: true }).click();
  if (!await page.evaluate(() => window.cmsSelected)) throw Error('CMS menu item did not run');
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Undo', exact: false }).waitFor({ state: 'visible', timeout: 5000 });
  return 'Real TinyMCE CMS toolbar menu and native menubar dropdown open and remain interactive in the modal editor.';
}
