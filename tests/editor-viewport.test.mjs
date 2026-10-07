import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('modal height excludes template offset and tracks viewport resize', () => {
  const listeners = new Map();
  let height;
  let disposed = false;
  const editor = { getBoundingClientRect: () => ({ top: 34 }), style: { setProperty: (key, value) => { height = value; } } };
  const window = { innerHeight: 800, addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) };
  vm.runInNewContext(fs.readFileSync(new URL('../package/component/media/js/editor-viewport.js', import.meta.url), 'utf8'), {
    window, document: { querySelector: () => editor, documentElement: { classList: { add() {} } }, body: {} },
    requestAnimationFrame: callback => { callback(); return 1; }, cancelAnimationFrame() {},
    ResizeObserver: class { observe() {} disconnect() { disposed = true; } },
  });
  assert.equal(height, '766px');
  window.innerHeight = 600;
  listeners.get('resize')();
  assert.equal(height, '566px');
  listeners.get('pagehide')();
  assert.ok(disposed);
  assert.equal(listeners.has('resize'), false);
});
test('standalone editor does not acquire modal sizing or listeners', () => {
  vm.runInNewContext(fs.readFileSync(new URL('../package/component/media/js/editor-viewport.js', import.meta.url), 'utf8'), {
    document: { querySelector: () => null },
  });
});
