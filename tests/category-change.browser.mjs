async page => {
  for (const custom of [false, true]) {
    await page.goto('http://127.0.0.1:8791');
    await page.setContent(`<form id="adminForm" method="post" action="/editor-submit-fixture?task=${custom ? 'editor.save' : 'article.reload'}" data-reload-url="/editor-submit-fixture?task=editor.reload"><joomla-field-fancy-select data-refresh-section="article" onchange="Joomla.categoryHasChanged(this)"><select id="jform_catid" name="jform[catid]"><option value="1">One</option><option value="2">Two</option></select></joomla-field-fancy-select>${custom ? '<input type="hidden" name="task" value="editor.save">' : ''}</form>`);
    await page.addScriptTag({ url: 'http://127.0.0.1:8791/joomla/media/system/js/core.js' });
    await page.evaluate(() => { Joomla.loadOptions({ 'category-change': 'jform_catid' }); });
    await page.addScriptTag({ url: 'http://127.0.0.1:8791/joomla/media/vendor/choicesjs/js/choices.min.js' });
    await page.addScriptTag({ url: 'http://127.0.0.1:8791/joomla/media/system/js/fields/joomla-field-fancy-select.js' });
    if (custom) {
      await page.addScriptTag({ url: 'http://127.0.0.1:8791/package/component/media/js/editor-fields.js' });
    } else {
      // Evaluate the actual PHP declaration after single-quoted PHP string decoding.
      await page.evaluate(async () => {
        const php = await (await fetch('/package/plugins/system/smartbrowserintegration/src/Extension/Smartbrowserintegration.php')).text();
        const declaration = php.match(/addScriptDeclaration\('([^\n]+const category = [^\n]+)'\);/)[1];
        (0, eval)(declaration.replace(/\\([\\'])/g, '$1'));
        document.dispatchEvent(new Event('DOMContentLoaded'));
        document.dispatchEvent(new Event('DOMContentLoaded'));
      });
    }
    await page.addScriptTag({ url: 'http://127.0.0.1:8791/joomla/media/layouts/js/joomla/form/field/category-change.js' });
    let submission;
    await page.route('**/editor-submit-fixture?*', async route => {
      const request = route.request();
      submission = { task: new URL(request.url()).searchParams.get('task'), fields: [...new URLSearchParams(request.postData())], method: request.method() };
      await route.fulfill({ contentType: 'text/html', body: '<div id="reloaded-editor">Still editing</div>' });
    });
    await page.locator('.choices__inner').click();
    await page.locator('[data-choice-selectable][data-value="2"]').click();
    await page.locator('#reloaded-editor').waitFor();
    const task = custom ? 'editor.reload' : 'article.reload';
    const tasks = submission.fields.filter(([key]) => key === 'task');
    if (submission.task !== task || tasks.length !== 1 || tasks[0][1] !== task || submission.method !== 'POST'
      || new Map(submission.fields).get('jform[catid]') !== '2') throw Error(JSON.stringify({ custom, submission }));
    await page.unroute('**/editor-submit-fixture?*');
  }
  return 'Real Joomla fancy-select and submitform POST category reload, never save, in native and SmartBrowser editors';
}
