import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveResourceVisual } from '../resources/js/core/resourceVisual.js';
test('configured open icons apply only while the native base is unchanged', () => {
  const resource = { kind: 'node', icon: 'fas fa-cube', closedIcon: 'fas fa-cube', openIcon: 'fas fa-cubes' };
  const options = { open: true, settings: { rules: [{ asset: 'base', style: 'center' }] } };
  assert.equal(resolveResourceVisual(resource, options).layers[0].icon, 'fas fa-cubes');
  assert.equal(resolveResourceVisual({ ...resource, icon: 'fas fa-school' }, options).layers[0].icon, 'fas fa-school');
});
test('icon settings are generic, optional and use one native decorations pipeline', async () => {
  const read = p => readFile(new URL('../' + p, import.meta.url), 'utf8');
  assert.match(await read('package/component/admin/config.xml'), /name="icons"[\s\S]*name="icon_profiles" type="iconprofiles"/);
  const decoration = await read('package/component/admin/src/Support/ResourceVisualDecorator.php');
  assert.ok(decoration.indexOf('IconOptions::resource') < decoration.indexOf("PluginHelper::importPlugin('smartvisuals'"));
  assert.match(await read('package/component/admin/src/Adapter/AdapterRegistry.php'), /'nodeOpenIcon' => \$icons\['open'\]/);
});
