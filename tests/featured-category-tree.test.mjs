import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
test('featured category navigation scopes articles recursively without coupling ordinary filters', () => {
  assert.match(execFileSync('php', ['tests/featured-category-tree.php'], { encoding: 'utf8' }), /access scope OK/);
});
