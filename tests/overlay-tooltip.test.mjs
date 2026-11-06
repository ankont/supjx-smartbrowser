import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { overlayTooltip } from '../resources/js/core/overlayTooltip.js';

test('frontend exports missing action translations without overriding host strings', () => {
  assert.match(execFileSync('php', ['tests/browser-language.php'], { encoding: 'utf8' }), /fallback OK/);
});

test('status tooltip includes dates and only advertises permitted actions', () => {
  const status = { label: 'Published and is Current.', tooltipLines: ['Start: 2026-11-01 18:49'] };
  const t = key => ({ JLIB_HTML_PUBLISHED_UNPUBLISH: 'Select to unpublish.' })[key] || key;
  assert.equal(overlayTooltip(status, { id: 'unpublish' }, t), 'Published and is Current.\nStart: 2026-11-01 18:49\nSelect to unpublish.');
  assert.equal(overlayTooltip(status, null, t), 'Published and is Current.\nStart: 2026-11-01 18:49');
});

test('publication state uses unambiguous component labels in all content adapters', () => {
  for (const name of ['ContentAdapter', 'MenuAdapter']) {
    const source = readFileSync(`package/component/admin/src/Adapter/${name}.php`, 'utf8');
    assert.doesNotMatch(source, /Text::_\('J(?:UN)?PUBLISHED'\)/);
    assert.match(source, /COM_SMARTBROWSER_STATE_UNPUBLISHED/);
  }
  const greek = readFileSync('package/component/admin/language/el-GR/com_smartbrowser.ini', 'utf8');
  assert.match(greek, /COM_SMARTBROWSER_STATE_PUBLISHED="Δημοσιευμένο"/);
  assert.match(greek, /COM_SMARTBROWSER_STATE_UNPUBLISHED="Αδημοσίευτο"/);
});
