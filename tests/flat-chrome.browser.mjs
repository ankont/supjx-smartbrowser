async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const background = locator => locator.evaluate(el => getComputedStyle(el).backgroundColor);
  for (const context of ['nativeToolbar=1', 'frontendFixture=1']) {
    await page.goto('http://127.0.0.1:8791?view=browser&contextualCreation=1&' + context);
    await page.locator('.resource-browser-item').first().waitFor();
    const create = page.locator('.resource-action-createNode');
    if (await background(create) !== 'rgb(255, 255, 255)') throw Error('Secondary node creation must use the ordinary button style');
    if (await background(page.locator('.resource-action-newArticle')) !== 'rgb(255, 255, 255)') throw Error('Contextual New Article must not be green');
    await create.hover();
    if (await background(create) !== 'rgb(47, 111, 173)') throw Error('Secondary node creation hover must use the ordinary blue style');
    const flat = page.locator('.resource-flat-toggle');
    await flat.evaluate(el => { el.classList.add('active'); el.setAttribute('aria-pressed', 'true'); });
    await page.mouse.move(0, 0);
    if (await background(flat) !== 'rgb(47, 111, 173)' || await flat.evaluate(el => getComputedStyle(el).color) !== 'rgb(255, 255, 255)') throw Error('Flat active colours lost');
    await flat.hover();
    if (await background(flat) !== 'rgb(36, 55, 79)') throw Error('Flat hover is not dark');
    const display = page.locator('.sb-heading-controls .resource-display-toggle');
    if (await display.count()) {
      await display.hover();
      if (await background(display) !== 'rgb(36, 55, 79)') throw Error('Display toggle hover differs');
    }
  }
  await page.goto('http://127.0.0.1:8791?view=browser&flatBreadcrumbFixture=1&flatRootFixture=1&adapter=flat-articles');
  await page.locator('.resource-browser-item').first().waitFor();
  const rootTrail = page.locator('.resource-main > .resource-toolbar .resource-breadcrumb button');
  if (await rootTrail.count() !== 1 || await rootTrail.first().getAttribute('title') === 'Categories') throw Error('Flat root presentation was replaced by the regular hierarchy root');
  await page.goto('http://127.0.0.1:8791?view=browser&flatBreadcrumbFixture=1&adapter=flat-articles&flatFromAdapter=articles&flatFromNode=category%3A12&browseRoot=category%3A12');
  await page.locator('.resource-browser-item').first().waitFor();
  const crumbs = page.locator('.resource-main > .resource-toolbar .resource-breadcrumb button');
  if (await crumbs.count() !== 3 || !await crumbs.last().getByText('Current category').count()) throw Error('Full flat breadcrumb missing');
  if (await crumbs.first().getAttribute('title') !== 'All Articles') throw Error('Flat breadcrumb root tooltip does not use the actual flat root label');
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let destination;
  let capture;
  const requested = new Promise(resolve => { capture = resolve; });
  await page.route('**/*', async route => {
    if (!route.request().isNavigationRequest()) return route.continue();
    destination = new URL(route.request().url());
    capture();
    await held;
    await route.fulfill({ contentType: 'text/html', body: 'Flat parent loaded' });
  });
  const progress = page.waitForFunction(() => document.querySelector('.resource-flat-toggle')?.disabled === true
    && !!document.querySelector('.resource-flat-toggle .spinner-border'));
  const click = crumbs.nth(1).click({ noWaitAfter: true });
  await progress;
  await requested;
  release(); await click;
  await page.getByText('Flat parent loaded', { exact: true }).waitFor();
  if (destination.searchParams.get('adapter') !== 'flat-articles' || destination.searchParams.get('browseRoot') !== 'category:7'
    || destination.searchParams.get('flatFromNode') !== 'category:7') throw Error('Parent did not retain flat scope: ' + destination);
  await page.unroute('**/*');
  return 'Backend/frontend creation and toggle colours, full flat breadcrumb, parent scope and visible navigation progress verified';
}
