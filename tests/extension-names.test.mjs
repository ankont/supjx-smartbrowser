import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('extension release metadata is complete and synchronized without renaming technical identities', () => {
  const version = JSON.parse(read('package.json')).version;
  for (const [path, name] of [
    ['pkg_smartbrowser.xml', 'PKG_SMARTBROWSER'],
    ['package/component/smartbrowser.xml', 'COM_SMARTBROWSER'],
    ['package/plugins/fields/smartbrowserpicker/smartbrowserpicker.xml', 'PLG_FIELDS_SMARTBROWSERPICKER'],
    ['package/plugins/system/smartbrowserintegration/smartbrowserintegration.xml', 'PLG_SYSTEM_SMARTBROWSERINTEGRATION'],
  ]) {
    const xml = read(path);
    assert.ok(xml.includes(`<name>${name}</name>`));
    assert.ok(xml.includes(`<version>${version}</version>`));
    assert.ok(xml.includes('<author>SuperSoft — Kontarinis Andreas</author>'));
    assert.match(xml, /<creationDate>\d{4}-\d{2}-\d{2}<\/creationDate>/);
  }
  const assets = JSON.parse(read('package/component/media/joomla.asset.json'));
  assert.equal(assets.version, version);
  for (const asset of assets.assets) assert.equal(asset.version, version);
});

test('extension names agree across runtime and installer translations', () => {
  for (const locale of ['en-GB', 'el-GR']) {
    const names = [
      [`language/${locale}/pkg_smartbrowser`, 'PKG_SMARTBROWSER', 'SuperSoftJx - SmartBrowser', ['.sys.ini']],
      [`package/component/admin/language/${locale}/com_smartbrowser`, 'COM_SMARTBROWSER', 'SuperSoftJx - SmartBrowser', ['.ini', '.sys.ini']],
      [`package/plugins/fields/smartbrowserpicker/language/${locale}/plg_fields_smartbrowserpicker`, 'PLG_FIELDS_SMARTBROWSERPICKER', `${locale === 'el-GR' ? 'Πεδία' : 'Fields'} - SuperSoftJx - SmartBrowser Picker`, ['.ini', '.sys.ini']],
      [`package/plugins/system/smartbrowserintegration/language/${locale}/plg_system_smartbrowserintegration`, 'PLG_SYSTEM_SMARTBROWSERINTEGRATION', locale === 'el-GR' ? 'Σύστημα - SuperSoftJx - Ενσωμάτωση SmartBrowser' : 'System - SuperSoftJx - SmartBrowser Integration', ['.ini', '.sys.ini']],
    ];
    for (const [path, key, value, suffixes] of names) {
      for (const suffix of suffixes) {
        assert.ok(read(path + suffix).split(/\r?\n/).includes(`${key}="${value}"`), path + suffix);
      }
    }
  }
});
