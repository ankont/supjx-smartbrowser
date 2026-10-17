import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
test('selection public URLs use Joomla routing, never fabricated paths or administrator edit URLs', () => {
  assert.match(execFileSync('php', ['tests/selection-address-routing.php'], { encoding: 'utf8' }), /routing.*context OK/);
});
test('address imports use CSRF, existing adapter resolution and server capability/profile validation', () => {
  const controller = readFileSync('package/component/admin/src/Controller/ApiController.php', 'utf8');
  assert.match(controller, /Session::checkToken\('json'\)/);
  assert.match(controller, /\['resolve', 'validate'\]/);
  assert.match(controller, /SelectionFieldSupport::usageValues\(\$resources\[\$index\], \$entry\['usage'\]/);
});
