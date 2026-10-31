async page => {
  await page.goto('http://127.0.0.1:8791');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('http://127.0.0.1:8791?view=browser&depthFixture=1');
  await page.locator('.resource-main > .resource-browser .resource-browser-item').first().waitFor();
  await page.locator('.resource-main > .resource-toolbar button:has(> .fa-list)').click();
  const cells = page.locator('.resource-details-view tbody .resource-column-location');
  await cells.first().waitFor();
  if (!(await cells.allTextContents()).some(text => text.includes('Parent » Alpha'))) throw Error('Full location path missing');
  if ((await cells.allTextContents()).some(text => text.includes('⋮'))) throw Error('Obsolete hierarchy markers remain');
  await page.locator('th.resource-column-location button').click();
  await page.waitForFunction(() => document.querySelector('.resource-details-view tbody .resource-column-location')?.textContent.includes('Alpha'));
  const truncated = await cells.first().evaluate(cell => {
    cell.querySelector('.resource-location-path').style.width = '65px';
    const parents = cell.querySelector('.resource-location-parents'), leaf = cell.querySelector('.resource-location-current');
    return { clipped: parents.scrollWidth > parents.clientWidth, leafFits: leaf.scrollWidth <= leaf.clientWidth + 1, title: cell.title };
  });
  if (!truncated.clipped || !truncated.leafFits || !truncated.title.includes('Parent » Alpha')) throw Error('Current node or full tooltip lost: ' + JSON.stringify(truncated));
  return 'Location shows complete Joomla-style paths without implying absent tree rows; hierarchy sorting is retained';
}
