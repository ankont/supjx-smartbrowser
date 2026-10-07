import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('dashboard lists menus before tags', async () => {
  const registry = await readFile(new URL('../package/component/admin/src/Adapter/AdapterRegistry.php', import.meta.url), 'utf8');
  const dashboard = await readFile(new URL('../package/component/admin/src/Support/DashboardProvider.php', import.meta.url), 'utf8');
  const descriptors = registry.slice(registry.indexOf('public function descriptors()'), registry.indexOf('private function canUse'));
  assert.ok(descriptors.indexOf("$this->canUse('menus')") < descriptors.indexOf("$this->canUse('tags')"));
  assert.match(dashboard, /foreach \(\(new AdapterRegistry\(\$this->app\)\)->descriptors\(\) as \$adapter\)/);
});
