import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('file content editing validates permissions, scope, revisions, text and image formats', () => {
  assert.match(execFileSync('php', ['tests/file-editor.php'], { encoding: 'utf8' }), /revision checks OK/);
});
