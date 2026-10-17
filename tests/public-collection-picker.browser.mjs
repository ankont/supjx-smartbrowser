async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  await page.evaluate(async () => {
    const target = document.createElement('div'); target.id = 'public-selection'; document.body.replaceChildren(target);
    window.changes = []; window.pickerCalls = [];
    window.originalOpen = SmartBrowserPicker.open;
    SmartBrowserPicker.open = async options => { pickerCalls.push(options); return window.nextResult; };
    window.publicCollection = SmartBrowser.mountCollection(target, {
      selectedResources: true, referenceItems: true, adapter: 'media', allowedAdapters: ['media'],
      multiple: true, homogeneous: true, selectionTarget: 'item', pickerUrl: location.origin + '/index.php',
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', selectionUseData: 'editable',
      items: [{ selection: { adapter: 'media', id: 'local-images:/b.png' }, usage: { 'ext.example.data': { keep: true } } }],
      onChange: detail => changes.push(detail), translate: key => Joomla.Text._(key, key),
    });
    await publicCollection.ready;
    window.nextResult = { items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }] };
    await publicCollection.add();
  });
  const result = await page.evaluate(async () => {
    if (pickerCalls[0].initialCollection.length || publicCollection.getItems().length !== 2 || changes.length !== 1 || changes[0].reason !== 'add') throw Error('Default public Add did not work');
    const resource = changes[0].resources.find(item => item.id === 'local-images:/a.png');
    window.nextResult = { items: [publicCollection.getItems()[1]] };
    await publicCollection.editSelection(resource);
    if (pickerCalls[1].initialCollection.length !== 2 || pickerCalls[1].initialFocus.id !== resource.id || !pickerCalls[1].initialInfoOpen) throw Error('Default public Replace did not focus the full collection');
    if (publicCollection.getItems().length !== 1 || changes.length !== 2 || changes[1].reason !== 'replace') throw Error('Replace did not emit complete final selection');
    window.nextResult = null;
    await publicCollection.add();
    if (changes.length !== 2) throw Error('Cancelled Picker emitted a change');
    SmartBrowserPicker.open = originalOpen;
    return 'Public Collection View without Add/Replace callbacks uses shared Picker operations, preserves metadata and emits one complete change per confirmation.';
  });
  return result;
}
