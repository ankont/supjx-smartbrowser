import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
test('frontend publishing fields reuse native definitions and enforce author/audit permissions at rendering and validation', () => {
  const result = spawnSync('php', ['tests/article-publishing-fields.php'], { encoding:'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
