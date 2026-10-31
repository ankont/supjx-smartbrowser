async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(async () => {
    localStorage.clear();
    const original = Joomla.getOptions;
    window.preferenceContext = { userId: 123, generation: 'one', values: {}, apiUrl: '/preferences-test', csrfToken: 'test' };
    window.preferenceSaves = [];
    Joomla.getOptions = (key, fallback) => key === 'com_smartbrowser.preferences' ? window.preferenceContext : original(key, fallback);
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      if (url !== '/preferences-test') return originalFetch(url, options);
      const body = JSON.parse(options.body); window.preferenceSaves.push(body);
      return new Response(JSON.stringify({ success: true, data: { saved: true } }), { status: 200 });
    };
    const { mountCollection } = await import('/package/component/media/js/collection.js');
    const target = document.createElement('div'); target.id = 'preference-collection'; document.body.prepend(target);
    window.preferenceCollection = mountCollection(target, { adapter: 'media', referenceItems: true, items: [],
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectedResources: true, informationPanel: false,
      viewPreferenceKey: 'custom.example.selection', translate: key => key });
    await window.preferenceCollection.ready;
  });
  await page.locator('#preference-collection').getByRole('button', { name: 'COM_SMARTBROWSER_DETAILS', exact: true }).click();
  await page.waitForFunction(() => preferenceSaves.some(batch => batch.changes['custom.example.selection'] === 'details'));
  const result = await page.evaluate(async () => {
    const { preferenceStorage } = await import('/resources/js/core/userPreferences.js');
    const preferences = preferenceStorage();
    for (const key of ['smartbrowser.displayMode', 'smartbrowser.editorMaximized', 'smartbrowser.pickerMaximized']) preferences.setItem(key, 'old');
    await preferences.flush();
    const before = preferences.getItem('custom.example.selection');
    preferenceContext = { ...preferenceContext, generation: 'two', values: {} };
    const reset = preferenceStorage();
    const cleared = reset.getItem('custom.example.selection') === null && reset.getItem('smartbrowser.editorMaximized') === null && reset.getItem('smartbrowser.displayMode') === null;
    preferenceCollection.destroy();
    return { before, cleared, actorSupplied: preferenceSaves.some(batch => 'userId' in batch), token: preferenceSaves.every(batch => batch.test === 1) };
  });
  if (result.before !== 'details' || !result.cleared || result.actorSupplied || !result.token) throw Error(JSON.stringify(result));
  return 'Collection UI persists to user-scoped local cache and CSRF-protected patches; reset includes layout and window preferences';
}
