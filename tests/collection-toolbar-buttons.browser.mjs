async page => {
  await page.goto('http://127.0.0.1:8791?fieldFixture=1&usageMode=editable');
  await page.waitForFunction(() => window.SmartBrowser?.mountCollection);
  return await page.evaluate(async () => {
    const target = document.createElement('div'); document.body.append(target);
    const collection = SmartBrowser.mountCollection(target, {
      selectedResources: true, referenceItems: true, adapter: 'media', allowedAdapters: ['media'],
      apiBaseUrl: location.origin + '/index.php', csrfToken: 'test', items: [], translate: key => key,
    });
    await collection.ready;
    const frame = document.createElement('iframe'); document.body.append(frame);
    const button = frame.contentDocument.createElement('button'); button.type = 'button'; button.textContent = 'Extension';
    frame.contentDocument.body.append(button);
    if (button instanceof HTMLElement) throw Error('Fixture button must originate from another realm');
    let clicks = 0; button.onclick = () => clicks++;
    const remove = collection.addToolbarButton(button);
    button.click();
    if (!target.querySelector('.sb-collection-extra-buttons').contains(button) || clicks !== 1) throw Error('Cross-frame toolbar button was not retained');
    remove();
    let rejected = false;
    try { collection.addToolbarButton({}); } catch { rejected = true; }
    if (!rejected) throw Error('Invalid toolbar arguments accepted');
    collection.destroy();
    collection.addToolbarButton(button)(); // Late media observer callback must be harmless.
    frame.remove(); target.remove();
    return 'Cross-frame toolbar buttons retain handlers; late callbacks after destroy are harmless';
  });
}
