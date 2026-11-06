import test from 'node:test';
import assert from 'node:assert/strict';
import { browserAvailableHeight } from '../resources/js/core/pickerViewport.js';

const element = (style = {}, bottom = 900, boundary = false, parentElement = null) => ({
  style, parentElement, matches: () => boundary, getBoundingClientRect: () => ({ bottom }),
});
const shell = (parentElement, top, scrollY = 0) => ({ parentElement,
  ownerDocument: { defaultView: { innerHeight: 900, scrollY, getComputedStyle: element => element.style } },
  getBoundingClientRect: () => ({ top }),
});
test('Picker height uses actual dialog bounds, not centered margins or outer page padding', () => {
  const body = element({ paddingBottom: '60px' });
  const dialog = element({ paddingBottom: '20px', borderBottomWidth: '1px', marginBottom: '45px' }, 855, true, body);
  const app = element({ paddingBottom: '4px', borderBottomWidth: '1px' }, 0, false, dialog);
  assert.equal(browserAvailableHeight(shell(app, 70, 300)), 759);
  dialog.style.marginBottom = 'auto';
  assert.equal(browserAvailableHeight(shell(app, 70)), 759);
});
test('Iframe Picker reserves template padding and page browser retains document offset', () => {
  const body = element({ paddingBottom: '20px', marginBottom: '0px' });
  const app = element({ borderBottomWidth: '1px' }, 0, false, body);
  assert.equal(browserAvailableHeight(shell(app, 21)), 858);
  assert.equal(browserAvailableHeight(shell(app, -79, 100)), 858);
});
test('Focus-mode Picker clamps to viewport and never produces negative height', () => {
  const focus = element({ paddingBottom: '12px' }, 1200, true);
  assert.equal(browserAvailableHeight(shell(focus, 40)), 860);
  assert.equal(browserAvailableHeight(shell(focus, 1000)), 0);
});
