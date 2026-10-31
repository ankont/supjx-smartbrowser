async page => {
  await page.goto('http://127.0.0.1:8791');
  return page.evaluate(async () => {
    const { mountCollection } = await import('/package/component/media/js/collection.js');
    const wait = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const check = (condition, message) => { if (!condition) throw Error(message); };
    const key = 'test.host-actions.single-layout';
    localStorage.setItem(key, JSON.stringify({ listOpen: false, infoState: 'vertical' }));
    const config = { selectedResources: true, referenceItems: true, adapter: 'media', allowedAdapters: ['media'], multiple: false,
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', viewPreferenceKey: 'test.host-actions',
      items: [{ selection: { adapter: 'media', id: 'local-images:/a.png' }, usage: {} }], allowRemove: true, onAdd: () => {}, translate: key => key };
    const host = document.createElement('div'); document.body.append(host);
    const collection = mountCollection(host, config); await collection.ready; await wait();
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Upload';
    let clicks = 0; button.onclick = () => clicks++;
    document.body.append(button); collection.addToolbarButton(button); await wait();
    check(button.closest('.sb-preview-selection-actions'), 'Host button missing from collapsed preview actions');
    check(button.getBoundingClientRect().width === 28 && button.getBoundingClientRect().height === 28, 'Preview host button does not match compact actions');
    button.click();
    host.querySelector('.sb-collection-count-toggle').click(); await wait();
    check(button.closest('.sb-collection-toolbar'), 'Host button did not return to toolbar');
    button.click();
    host.querySelector('.sb-collection-count-toggle').click(); await wait();
    const plainHost = document.createElement('div'); document.body.append(plainHost);
    const plain = mountCollection(plainHost, { ...config, informationPanel: false }); await plain.ready; await wait();
    check(JSON.parse(localStorage.getItem(key)).listOpen === false, 'Non-collapsible collection overwrote preview preference');
    plain.destroy(); plainHost.remove();
    await collection.setItems([]); await wait();
    check(button.closest('.resource-info-empty'), 'Empty preview does not offer the host action below Select resource');
    check(button.getBoundingClientRect().width > 100 && button.getBoundingClientRect().height >= 40, 'Empty host action should match Select resource');
    button.click(); check(clicks === 3, 'Moving host actions lost their event handlers');
    collection.destroy(); host.remove(); button.remove(); localStorage.removeItem(key);
    return 'Collapsed preference survives panel-less collections; native host actions move between toolbar, preview and empty state without losing handlers';
  });
}
