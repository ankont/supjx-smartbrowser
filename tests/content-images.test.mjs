import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('content adapters normalize native JSON and already-decoded images without PHP warnings', () => {
  assert.match(execFileSync('php', ['tests/content-images.php'], { encoding: 'utf8' }), /warning-free invalid inputs OK/);
});
