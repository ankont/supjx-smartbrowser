async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(async () => {
    const { mountNativeSelection } = await import('/package/component/media/js/article-media.js');
    const raw = 'https://example.org/frontend/article.html#joomlaItem://article/1?titleOverride=Temporary%20title';
    const form = document.createElement('form');
    form.id = 'link-test';
    const fields = { urla: raw, urlatext: 'Link title', targeta: '1' };
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement('input'); input.name = `jform[urls][${name}]`; input.value = value;
      const row = document.createElement('div'); row.className = 'control-group'; row.append(input); form.append(row);
    }
    const root = document.createElement('div'); root.className = 'sb-selection-field';
    root.dataset.sbArticleMedia = JSON.stringify({ group: 'urls', slots: ['a'] });
    root.dataset.sbField = JSON.stringify({ adapter: 'articles', allowedAdapters: ['articles', 'media'], selectionTarget: 'both', multiple: false,
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectionUseData: 'editable', editorDisplay: 'compact',
      nativeLinkAddresses: [raw], selectionProfile: { 'article.displayedName': {} }, viewPreferenceKey: 'test.article-link-addresses' });
    root.innerHTML = '<input type="hidden" data-sb-value><div data-sb-collection></div><p data-sb-error hidden></p>';
    root.querySelector('[data-sb-value]').value = JSON.stringify({ version: 1, items: [{ selection: { adapter: 'articles', id: 'article:1' }, usage: {} }] });
    form.append(root); document.body.append(form);
    window.linkTestChanges = 0;
    form.addEventListener('change', () => window.linkTestChanges++);
    mountNativeSelection(root);
  });
  const root = page.locator('#link-test .sb-selection-field');
  await page.waitForFunction(() => JSON.parse(document.querySelector('#link-test [data-sb-value]').value).items[0].usage['article.displayedName'] === 'Temporary title');
  if (await page.evaluate(() => window.linkTestChanges) !== 0) throw Error('Reopening marked the editor dirty');
  const input = root.locator('.resource-usage-field input[type="text"]').first();
  await input.fill('Updated title');
  await page.waitForFunction(() => document.querySelector('[name="jform[urls][urla]"]').value.includes('titleOverride=Updated%20title'));
  const url = await page.locator('[name="jform[urls][urla]"]').inputValue();
  if (!url.includes('#joomlaItem://article/1')) throw Error('Typed identity lost on save');
  return 'Native article link rehydrates silently and saves full typed addresses after usage edits';
}
