async page => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:8791');
  await page.setContent(`<link rel="stylesheet" href="/joomla/media/templates/administrator/atum/css/template.min.css"><link rel="stylesheet" href="/package/component/media/css/editor.css">
    <div id="toolbar" class="btn-toolbar d-flex" style="gap:12px;width:100%"><button class="btn">Save</button><div id="toolbar-help" class="ms-auto"><button class="btn">Help</button></div></div>
    <div class="com-smartbrowser-editor is-admin-category-page"><form id="adminForm"><div class="smartbrowser-editor-actions"><div class="d-flex gap-2 ms-auto smartbrowser-editor-tools"><a href="#" class="btn smartbrowser-editor-native">Joomla</a></div></div></form></div>`);
  await page.addScriptTag({ url: '/package/component/media/js/editor-fields.js' });
  const state = await page.evaluate(() => {
    const group = document.querySelector('#toolbar > .smartbrowser-editor-tools');
    const help = group.querySelector('#toolbar-help').getBoundingClientRect();
    const native = group.querySelector('.smartbrowser-editor-native').getBoundingClientRect();
    return { gap: native.left - help.right, right: native.right, toolbarRight: document.getElementById('toolbar').getBoundingClientRect().right };
  });
  if (state.gap > 15 || state.gap < 0 || Math.abs(state.right - state.toolbarRight) > 2) throw Error(JSON.stringify(state));
  return 'Help and native Joomla button share one compact right-aligned toolbar group';
}
