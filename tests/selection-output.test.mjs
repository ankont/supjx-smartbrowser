import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('PHP field output uses native layouts, generic providers and safe adapter-independent rendering', () => {
  assert.match(execFileSync('php', ['tests/selection-output.php'], { encoding: 'utf8' }), /privacy OK/);
  assert.match(execFileSync('php', ['tests/selection-field-value.php'], { encoding: 'utf8' }), /safe output OK/);
});
