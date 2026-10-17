import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIconClasses } from '../resources/js/core/fieldIcons.js';

test('icon input normalizes class separators and leaves invalid characters for validation', () => {
  assert.equal(normalizeIconClasses(' fas   fa-book '), 'fas fa-book');
  assert.equal(normalizeIconClasses('fas\tfa-star'), 'fas fa-star');
  assert.equal(normalizeIconClasses(' '), '');
  assert.equal(normalizeIconClasses(null), '');
  assert.equal(normalizeIconClasses('fas <invalid>'), 'fas <invalid>');
});
