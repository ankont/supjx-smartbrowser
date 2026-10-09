import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('reader visibility is independent of authoring ACL and fails closed per item', () => {
  const result = spawnSync('php', ['tests/read-only-resources.php'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('media/menu/tag policies support public guests and reject restricted resources', () => {
  const result = spawnSync('php', ['tests/read-adapter-policies.php'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('user display names require a verified stored visible host and never expose account metadata', () => {
  const result = spawnSync('php', ['tests/stored-user-read.php'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('frontend preparation and thumbnail references share the reader path; form validation retains authoring ACL', () => {
  const source = readFileSync('package/component/admin/src/Support/SelectionFieldSupport.php', 'utf8');
  assert.match(source, /\$readOnly \?\?=.*isClient\('site'\)/);
  assert.match(source, /self::resolve\(\$override, \$overrideConfig, \$resolver, \$readOnly\)/);
  assert.equal((source.match(/ReadOnlyResources::resolve/g) || []).length, 2);
  const form = readFileSync('package/component/admin/src/Field/SmartbrowserpickerField.php', 'utf8');
  assert.equal((form.match(/prepare\(\$value, \$config, null, false\)/g) || []).length, 2);
});
