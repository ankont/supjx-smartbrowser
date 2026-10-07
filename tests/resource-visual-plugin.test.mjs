import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { imageBackground, resolveResourceVisual, visualDefaults, visualStyles, visualPositions, visualAssets, normalizeVisualSettings, normalizeVisualProfiles, moveVisualLayer, canAnchor } from '../resources/js/core/resourceVisual.js';

test('API dispatches batch visual decoration for roots and browsed resources', async () => {
  const controller = await readFile(new URL('../package/component/admin/src/Controller/ApiController.php', import.meta.url), 'utf8');
  const decorator = await readFile(new URL('../package/component/admin/src/Support/ResourceVisualDecorator.php', import.meta.url), 'utf8');
  assert.match(controller, /ResourceVisualDecorator\(\$this->app\)\)->decorate\(\[/);
  assert.match(controller, /ResourceVisualDecorator\(\$this->app\)\)->decorate\(\$result, \$adapter->getId\(\)\)/);
  assert.match(decorator, /PluginHelper::importPlugin\('smartvisuals'/);
  assert.match(decorator, /onSmartVisualsDecorateResources/);
  assert.match(decorator, /'decorations' => \[\]/);
  assert.doesNotMatch(decorator, /\$resource\['capabilities'\]\s*=/);
});

const resource = Object.freeze({ kind: 'node', type: 'category', icon: 'fas fa-folder', image: '/category.png', badgeIcon: 'fas fa-book' });
const layer = (visual, asset) => visual.layers.find(layer => layer.asset === asset);

test('per-placement sizes are independent and fallback uses the asset own center size', () => {
  const sizes = { center: 'medium', corner: 'small', badge: 'max' };
  for (const [style, extent] of [['center', 50], ['corner', 25], ['badge', 30]]) {
    const settings = { base: { style, sizes, anchor: 'image' }, image: { style: 'center', sizes: { center: 'max' } } };
    assert.equal(layer(resolveResourceVisual(resource, { settings }), 'base').box.width, extent);
    const normalized = normalizeVisualSettings(settings);
    assert.deepEqual(normalized.base.sizes, sizes);
    assert.deepEqual(normalizeVisualSettings(normalized), normalized);
  }
  const settings = { base: { style: 'corner', sizes }, image: { style: 'center', sizes: { center: 'max' } } };
  for (const options of [{ allowImage: false }, { imageFailed: true }]) {
    const fallback = layer(resolveResourceVisual(resource, { settings, ...options }), 'base');
    assert.equal(fallback.style, 'center');
    assert.equal(fallback.box.width, 50);
    assert.equal(fallback.size, 'medium');
  }
  const migrated = normalizeVisualSettings({ base: { style: 'corner', size: 'large' }, image: { style: 'center-max' } });
  assert.equal(migrated.base.sizes.corner, 'large');
  assert.equal(migrated.base.sizes.center, 'medium');
  assert.equal(migrated.image.sizes.center, 'max');
});

test('item layer movement skips hidden identity controls but preserves their settings', () => {
  const initial = normalizeVisualSettings({ order: ['base', 'identity', 'image'], identity: { sizes: { center: 'max' } } });
  const moved = moveVisualLayer(initial, 'base', 1, ['base', 'image']);
  assert.deepEqual(moved.order, ['image', 'identity', 'base']);
  assert.deepEqual(moved.identity, initial.identity);
  assert.deepEqual(moveVisualLayer(moved, 'base', -1, ['base', 'image']), initial);
  assert.deepEqual(moveVisualLayer(initial, 'base', -1, ['base', 'image']), initial);
});

test('maximum images stay centered regardless of aspect ratio and status space', () => {
  for (const imageRatio of [.5, 1, 2]) {
    const settings = { image: { style: 'center', size: 'max' } };
    const visual = resolveResourceVisual(resource, { settings, imageRatio, statusSpace: 15 });
    const box = layer(visual, 'image').box;
    assert.equal(box.x + box.width / 2, 50);
    assert.equal(box.y + box.height / 2, 50);
    const normal = resolveResourceVisual(resource, { settings, imageRatio });
    assert.deepEqual(box, layer(normal, 'image').box);
  }
});

test('statuses do not move or resize centered and corner assets', () => {
  const settings = { base: { style: 'corner', size: 'medium', position: 'top-left' }, image: { style: 'center', size: 'medium' } };
  const normal = resolveResourceVisual(resource, { settings });
  const statuses = resolveResourceVisual(resource, { settings, statusSpace: 12 });
  assert.deepEqual(statuses, normal);
  assert.equal(layer(statuses, 'image').box.y, 25);
  assert.equal(layer(statuses, 'image').box.width, 50);
  assert.deepEqual(layer(statuses, 'base').box, layer(normal, 'base').box);
  assert.equal(layer(statuses, 'base').box.x, 3);
  assert.equal(layer(statuses, 'base').box.y, 3);
  const missing = resolveResourceVisual({ ...resource, image: '' }, { settings });
  assert.equal(layer(missing, 'base').style, 'center');
  assert.equal(layer(missing, 'base').size, 'medium');
  const largeCenter = resolveResourceVisual({ ...resource, image: '' }, { settings: { ...settings, image: { style: 'center', size: 'large' } } });
  assert.equal(layer(largeCenter, 'base').box.width, 50);
  assert.equal(settings.base.style, 'corner');
  const compact = resolveResourceVisual(resource, { settings, compact: true, statusSpace: 12 });
  assert.equal(layer(compact, 'image').box.y, 12.5);
});

test('tree connector ends halfway down the last rendered row, including static nodes', async () => {
  const css = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(css, /\.resource-tree-branch > :is\(button, \.resource-tree-static\):last-child::after \{\s*bottom: 50%;/);
  assert.doesNotMatch(css, /\.resource-tree-branch::before\s*\{/);
});

test('tree base icons share a left edge regardless of badge and folder glyph ratio', () => {
  for (const open of [false, true]) {
    for (const badgeIcon of ['', 'fas fa-home']) {
      const visual = resolveResourceVisual({ kind: 'node', icon: 'fas fa-folder', badgeIcon }, {
        compact: true, alignBaseStart: true, open,
        iconRatios: { 'fas fa-folder': .8, 'fas fa-folder-open': 1.25 },
      });
      assert.equal(layer(visual, 'base').box.x, 0);
    }
  }
  assert.ok(layer(resolveResourceVisual({ kind: 'node', icon: 'fas fa-folder' }, { compact: true }), 'base').box.x > 0);
});

test('compact visuals promote small and medium to large, and large to maximum', () => {
  for (const [size, gridExtent, compactExtent] of [['small', 25, 75], ['medium', 50, 75], ['large', 75, 100], ['max', 100, 100]]) {
    for (const asset of ['base', 'identity', 'image']) {
      const settings = normalizeVisualSettings({ [asset]: { style: 'center', size } });
      assert.equal(layer(resolveResourceVisual(resource, { settings }), asset).box.width, gridExtent);
      assert.equal(layer(resolveResourceVisual(resource, { settings, compact: true }), asset).box.width, compactExtent);
      assert.equal(settings[asset].size, size);
    }
  }
  const badge = resolveResourceVisual(resource, { settings: { identity: { style: 'badge', size: 'small' } }, compact: true });
  assert.equal(layer(badge, 'identity').box.width, 60);
  for (const [size, extent] of [['small', 60], ['medium', 60], ['large', 70], ['max', 70]]) {
    const visual = resolveResourceVisual(resource, { settings: { identity: { style: 'badge', size } }, compact: true });
    assert.equal(layer(visual, 'identity').box.width, extent);
  }
});

test('independent sizes apply to every mode and badges retain their smaller scale', () => {
  for (const [size, extent, badgeExtent] of [['small', 25, 15], ['medium', 50, 20], ['large', 75, 25], ['max', 100, 30]]) {
    for (const style of ['center', 'corner', 'badge']) {
      const settings = { identity: { style, size, anchor: 'base' } };
      const visual = resolveResourceVisual(resource, { settings });
      assert.equal(layer(visual, 'identity').box.width, style === 'badge' ? badgeExtent : extent);
      assert.ok(layer(visual, 'identity').box.x >= 0);
      assert.ok(layer(visual, 'identity').box.x + layer(visual, 'identity').box.width <= 100);
    }
  }
  const legacy = normalizeVisualSettings({ base: { style: 'corner-large' }, image: { style: 'center-max' } });
  assert.equal(legacy.base.style, 'corner');
  assert.equal(legacy.base.size, 'large');
  assert.equal(legacy.image.style, 'center');
  assert.equal(legacy.image.size, 'max');
  assert.equal(normalizeVisualSettings({ identity: { style: 'badge' } }).identity.size, 'small');
  assert.deepEqual(normalizeVisualSettings(legacy), legacy);
});

test('media breadcrumb nodes preserve folder identity when opened in the tree', async () => {
  const breadcrumbView = await readFile(new URL('../resources/js/components/ResourceBreadcrumb.vue', import.meta.url), 'utf8');
  assert.match(breadcrumbView, /v-if="index === 0" :class="rootIcon"/);
  assert.doesNotMatch(breadcrumbView, /v-if="crumb.icon"/);
  const adapter = await readFile(new URL('../package/component/admin/src/Adapter/MediaAdapter.php', import.meta.url), 'utf8');
  const breadcrumb = adapter.slice(adapter.indexOf('public function getBreadcrumb'), adapter.indexOf('public function configureBrowseRoot'));
  assert.equal((breadcrumb.match(/'kind' => 'node', 'icon' => 'fas fa-folder'/g) || []).length, 2);
  const opened = resolveResourceVisual({ kind: 'node', icon: 'fas fa-folder' }, { open: true, compact: true });
  assert.equal(layer(opened, 'base').icon, 'fas fa-folder-open');
});

test('all assets share the same four modes with independent sizes and overlapping centers stay visible', () => {
  for (const asset of visualAssets) {
    for (const style of visualStyles) {
      const settings = normalizeVisualSettings({ [asset]: { style } });
      const visual = resolveResourceVisual(resource, { settings });
      assert.equal(Boolean(layer(visual, asset)), style !== 'hidden', asset + ':' + style);
      if (style !== 'hidden') assert.equal(layer(visual, asset).style, style);
    }
  }
  const visual = resolveResourceVisual(resource, { settings: { base: { style: 'center-large' }, image: { style: 'center', size: 'medium' } } });
  assert.equal(layer(visual, 'base').box.width, 75);
  assert.equal(layer(visual, 'image').box.width, 50);
  assert.equal(layer(visual, 'base').z < layer(visual, 'image').z, true);
});

test('the two reference compositions anchor identity to base or image', () => {
  const first = resolveResourceVisual(resource, { settings: { base: { style: 'center-large' }, image: { style: 'center', size: 'medium' }, identity: { style: 'badge', anchor: 'base', position: 'bottom-right' } } });
  const second = resolveResourceVisual(resource, { settings: { base: { style: 'corner-large', position: 'top-left' }, image: { style: 'center-large' }, identity: { style: 'badge', anchor: 'image', position: 'bottom-right' } } });
  assert.equal(layer(first, 'base').box.width, 75);
  assert.equal(layer(first, 'image').box.width, 50);
  assert.equal(layer(first, 'identity').box.x, 77);
  assert.equal(layer(second, 'base').box.x, 3);
  assert.equal(layer(second, 'base').box.width, 75);
  assert.equal(layer(second, 'identity').box.x, 77);
});

test('image anchors follow the contained image rectangle rather than empty letterbox', () => {
  const settings = { image: { style: 'center-large' }, identity: { style: 'badge', anchor: 'image', position: 'bottom-right' } };
  const wide = resolveResourceVisual(resource, { settings, imageRatio: 2 });
  const tall = resolveResourceVisual(resource, { settings, imageRatio: .5 });
  assert.equal(layer(wide, 'image').box.height, 37.5);
  assert.equal(layer(tall, 'image').box.width, 37.5);
  assert.ok(layer(wide, 'identity').box.y < layer(tall, 'identity').box.y);
  assert.ok(layer(tall, 'identity').box.x < layer(wide, 'identity').box.x);
});

test('corner positions, badge chains, cycles and malformed settings remain stable', () => {
  for (const corner of visualPositions) {
    for (const style of visualStyles) {
      const settings = normalizeVisualSettings({ base: { style, position: corner }, identity: { style: 'badge', anchor: 'base' }, image: { style: 'badge', anchor: 'identity' } });
      assert.deepEqual(normalizeVisualSettings(settings), settings);
      assert.doesNotThrow(() => resolveResourceVisual(resource, { settings }));
    }
  }
  const cycle = { base: { style: 'badge', anchor: 'identity' }, identity: { style: 'badge', anchor: 'image' }, image: { style: 'badge', anchor: 'base' } };
  assert.equal(canAnchor(cycle, 'base', 'identity'), false);
  const normalized = normalizeVisualSettings(cycle);
  assert.equal(normalized.base.style, 'corner');
  assert.doesNotThrow(() => resolveResourceVisual(resource, { settings: normalized }));
  assert.deepEqual(normalizeVisualSettings({ order: ['image', 'image', 'unsafe', {}], base: { style: '<unsafe>', anchor: 'base' } }).order, ['image', 'base', 'identity']);
});

test('layer buttons swap one level without changing style, position or anchor', () => {
  const original = normalizeVisualSettings();
  const moved = moveVisualLayer(original, 'base', 1);
  assert.deepEqual(moved.order, ['image', 'base', 'identity']);
  assert.deepEqual(moved.base, original.base);
  assert.deepEqual(moveVisualLayer(moved, 'base', -1), original);
  assert.deepEqual(moveVisualLayer(original, 'base', -1), original);
});

test('nodes and items have independent profiles across the same rendering API', () => {
  const profiles = normalizeVisualProfiles({ nodes: { image: { style: 'hidden' } }, items: { base: { style: 'hidden' }, identity: { style: 'hidden' } } });
  assert.equal(layer(resolveResourceVisual(resource, { settings: profiles }), 'image'), undefined);
  assert.equal(layer(resolveResourceVisual({ ...resource, kind: 'item' }, { settings: profiles }), 'base'), undefined);
  assert.deepEqual(normalizeVisualProfiles({ baseMode: 'behind', imageMode: 'center' }).nodes.base.style, 'corner');
});

test('missing anchors and failed images fall back without losing open folder identity', () => {
  const visual = resolveResourceVisual(resource, { allowImage: false, open: true, compact: true });
  assert.equal(layer(visual, 'image'), undefined);
  assert.equal(layer(visual, 'base').icon, 'fas fa-folder-open');
  assert.equal(layer(visual, 'identity').anchor, 'image');
  assert.ok(Number.isFinite(layer(visual, 'identity').box.x));
  const fallback = resolveResourceVisual({ ...resource, badgeIcon: '' }, { settings: { base: { style: 'hidden' }, image: { style: 'center-large' } }, imageFailed: true });
  assert.equal(fallback.layers.length, 1);
  assert.equal(fallback.layers[0].asset, 'base');
  assert.deepEqual(resolveResourceVisual({ ...resource, baseMode: 'hidden', imageBackground: 'checkerboard' }), resolveResourceVisual(resource));
});

test('transparency retains native file and identity image semantics', () => {
  assert.equal(imageBackground(resource), 'transparent');
  assert.equal(imageBackground({ kind: 'item', type: 'image' }), 'checkerboard');
  assert.equal(imageBackground(resource, { imageBackground: 'checkerboard' }), 'checkerboard');
});

test('maximum center fills the canvas and medium corner sits between existing sizes', () => {
  const maximum = resolveResourceVisual(resource, { settings: { image: { style: 'center-max' } }, imageRatio: 2 });
  assert.deepEqual(layer(maximum, 'image').box, { x: 0, y: 25, width: 100, height: 50 });
  for (const [style, size] of [['corner-small', 25], ['corner-medium', 50], ['corner-large', 75], ['corner-max', 100]]) {
    assert.equal(layer(resolveResourceVisual(resource, { settings: { base: { style } } }), 'base').box.width, size);
  }
});

test('corners center only when there is no visible central asset, without mutating settings', () => {
  const settings = normalizeVisualSettings({ base: { style: 'corner-large' }, image: { style: 'center-max' } });
  const isolated = resolveResourceVisual(resource, { settings, imageFailed: true });
  assert.equal(layer(isolated, 'base').style, 'center');
  assert.equal(layer(isolated, 'base').box.x, 25);
  assert.equal(layer(isolated, 'base').size, 'medium');
  for (const [corner, center] of [['corner-small', 'center'], ['corner-medium', 'center'], ['corner-large', 'center'], ['corner-max', 'center']]) {
    const visual = resolveResourceVisual({ kind: 'node', icon: 'fas fa-folder' }, { settings: { base: { style: corner } } });
    assert.equal(layer(visual, 'base').style, center);
    for (const compact of [false, true]) {
      const alone = resolveResourceVisual({ kind: 'node', icon: 'fas fa-folder' }, { settings: { base: { style: corner } }, compact });
      const together = resolveResourceVisual(resource, { settings: { base: { style: corner } }, compact });
      assert.equal(layer(alone, 'base').box.width, compact ? 75 : 50);
      assert.equal(layer(alone, 'base').box.height, compact ? 75 : 50);
      assert.ok(layer(together, 'base').box.x >= 0);
    }
  }
  assert.equal(settings.base.style, 'corner');
  assert.equal(layer(resolveResourceVisual(resource, { settings }), 'base').style, 'corner');
});

test('appearance fields use shared preview, independent profiles and single-line controls', async () => {
  const config = await readFile(new URL('../package/component/admin/config.xml', import.meta.url), 'utf8');
  assert.match(config, /name="visual_global" type="visualappearance"/);
  const profile = await readFile(new URL('../resources/js/components/VisualProfileSettings.vue', import.meta.url), 'utf8');
  const editor = await readFile(new URL('../resources/js/components/VisualSettings.vue', import.meta.url), 'utf8');
  const css = await readFile(new URL('../package/component/media/css/visual-settings.css', import.meta.url), 'utf8');
  assert.match(editor, /\['nodes', 'items'\]/);
  assert.match(editor, /adapter \? 'details' : 'div'/);
  assert.match(editor, /labels.adapter_title/);
  assert.match(css, /\.control-group\.sb-appearance-adapter > \.control-label \{ display: none;/);
  const browserCss = await readFile(new URL('../package/component/media/css/smartbrowser.css', import.meta.url), 'utf8');
  assert.match(browserCss, /\.resource-visual-content \{[^}]*inset: 0;/s);
  assert.doesNotMatch(browserCss, /\.visual-grid\.has-status-overlays\s*\{/);
  assert.doesNotMatch(browserCss, /inset: 0 14px 28px/);
  assert.doesNotMatch(editor, /<component[^>]*\sopen[\s=>]/);
  assert.doesNotMatch(profile, /v-model="example"/);
  assert.match(editor, /badgeIcon: kind === 'nodes' \? 'fas fa-book' : ''/);
  assert.doesNotMatch(profile, /v-model="custom"|v-if="!adapter \|\| custom"/);
  assert.match(profile, /custom.value = Boolean\(props.adapter\)/);
  assert.match(profile, /v-for="size in visualSizes"/);
  assert.match(profile, /change\(index, 'size',/);
  assert.match(editor, /<ResourceVisual :resource="example\(kind\)" :settings="effective\(kind\)"/);
  assert.match(profile, /move\(index, -1\)/);
  assert.match(profile, /move\(index, 1\)/);
  assert.match(profile, /in visibleRules"/);
  assert.match(profile, /:disabled="rowIndex === 0"/);
  assert.match(profile, /:disabled="rowIndex === visibleRules.length - 1"/);
  assert.match(profile, /props.kind === 'items' \? \['base', 'image'\]/);
  assert.doesNotMatch(profile, /fas fa-code-branch|sb-rule-indicator/);
  assert.match(profile, /type="number"/);
  assert.match(profile, /labels.z_index/);
  assert.doesNotMatch(editor, /sb-preview-explanation/);
  assert.match(editor, /sb-preview-body/);
  assert.match(css, /input\.sb-rule-z \{[^}]*width: 40px; min-width: 40px;/);
  assert.match(editor, /v-model="available\[kind\]\[asset\]"/);
  assert.match(config, /name="image_background"/);
  assert.ok(editor.indexOf('sb-appearance-previews') > editor.indexOf('</section>'));
  assert.ok(profile.indexOf('sb-appearance-layer-buttons') < profile.indexOf('<select'));
  assert.match(css, /\.sb-appearance-row \{[^}]*flex-wrap: nowrap;[^}]*overflow-x: auto;/s);
});
