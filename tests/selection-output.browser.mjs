async page => {
  const response = await page.goto('http://127.0.0.1:8791/selection-output-preview.html');
  const source = await response.text();
  if (!source.includes('aspect-ratio: 16 / 9') || !source.includes('data-sb-image-presentation="server"')) throw Error('Presentation was not rendered in PHP');
  if (await page.locator('main li').count() !== 7) throw Error('Missing adapter output');
  if (await page.locator('script').count()) throw Error('Final field output depends on JavaScript');
  const image = page.locator('main img').first();
  await image.evaluate(image => image.decode());
  const box = await image.boundingBox();
  if (Math.abs(box.width / box.height - 16 / 9) > .02) throw Error('Server presentation ratio not visible');
  if (await image.getAttribute('alt') !== 'Example image') throw Error('Alt lost');
  if (await page.locator('a[href="/menu"]').count() !== 2 || await page.locator('a[href="/tag"]').count() !== 2) throw Error('Public node URLs missing');
  if (!await page.getByText('User', { exact: true }).isVisible()) throw Error('User name missing');
  await page.screenshot({ path: 'build/field-output.png', fullPage: true });
  return 'PHP native-like field output is complete before JS: adapter links, user text, image/caption/alt and server image presentation.';
}
