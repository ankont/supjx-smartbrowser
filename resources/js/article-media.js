import { mountSelectionField } from './selection-field.js';
import ResourceApi from './services/ResourceApi.js';
import createSelectionAddressService from './services/SelectionAddressService.js';

const mounted = new WeakSet();
export function mountNativeSelection(root) {
  if (mounted.has(root)) return;
  const mapping = JSON.parse(root.dataset.sbArticleMedia);
  const config = JSON.parse(root.dataset.sbField);
  const categoryImage = Boolean(mapping.image);
  const image = mapping.group === 'images' || categoryImage;
  const input = root.querySelector('[data-sb-value]');
  const form = input.form;
  const api = new ResourceApi({ ...config, mode: 'manage' });
  const addresses = image ? null : createSelectionAddressService({ api, config });
  const native = name => {
    const field = form.elements.namedItem(mapping.nativeNames?.[name] || `jform[${mapping.group}][${name}]`);
    return field && !field.tagName ? [...field].find(item => item.type === 'checkbox') || field[0] : field;
  };
  const imageClass = mapping.group === 'images' ? (native(`imgclass_${mapping.role}`) ? `imgclass_${mapping.role}` : `float_${mapping.role}`) : null;
  const figureClass = mapping.group === 'images' && imageClass !== `float_${mapping.role}` && native(`float_${mapping.role}`) ? `float_${mapping.role}` : null;
  const names = categoryImage ? [mapping.image, ...Object.values(mapping.usageFields || { 'media.alt': 'image_alt', 'media.decorative': 'image_alt_empty' })] : mapping.group === 'images'
    ? [`image_${mapping.role}`, `image_${mapping.role}_alt`, `image_${mapping.role}_alt_empty`, `image_${mapping.role}_caption`, imageClass, ...(figureClass ? [figureClass] : [])]
    : mapping.slots.flatMap(slot => [`url${slot}`, `url${slot}text`, `target${slot}`]);
  if (names.some(name => !native(name) || native(name).disabled || native(name).readOnly)) {
    root.remove();
    return;
  }
  if (categoryImage) {
    const controls = native(mapping.image).closest('.controls');
    if (controls) controls.append(root);
    else native(mapping.image).closest('.control-group')?.after(root);
  }
  if (image) root.dataset.sbField = JSON.stringify({ ...config, nativeImage: true,
    nativeUsageKeys: categoryImage ? Object.keys(mapping.usageFields || { 'media.alt': '', 'media.decorative': '' }) : ['media.alt', 'media.decorative', 'media.caption', 'media.class', ...(figureClass ? ['media.figureClass'] : [])] });
  const selection = mountSelectionField(root);
  mounted.add(root);
  if (image) {
    const imageField = native(names[0]);
    selection.setNativeAddress?.(imageField.value);
    imageField.addEventListener?.('change', () => selection.setNativeAddress?.(imageField.value));
  }
  for (const name of names) {
    const field = native(name);
    const media = image && name === names[0] ? field.closest('joomla-field-media') : null;
    if (media) {
      media.classList.add('sb-article-image-preview');
      field.closest('.control-group')?.classList.add('sb-article-image-field');
      const moveToolbarButtons = () => media.querySelectorAll('.input-group > :is(button, [role="button"]):not(.button-select):not(.button-clear)').forEach(button => selection.addToolbarButton(button));
      moveToolbarButtons();
      selection.attachPreview(media);
      const observer = new MutationObserver(moveToolbarButtons);
      observer.observe(media, { childList: true, subtree: true });
      window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    } else {
      const row = field.closest('.control-group');
      row?.setAttribute('hidden', '');
      row?.classList?.add('sb-native-selection-hidden');
    }
  }
  let pending = false, failed = false, generation = 0;
  const write = (name, value) => {
    const field = native(name);
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = String(value ?? '');
    const media = image && name === names[0] ? field.closest('joomla-field-media') : null;
    if (media) {
      // Refresh the native preview without depending on Joomla's global media picker result.
      media.validatedUrl = field.value;
      media.updatePreview?.();
      media.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: field.value } }));
    }
    root.dataset.sbNativeWriting = '1';
    try { field.dispatchEvent(new Event('change', { bubbles: true })); }
    finally { delete root.dataset.sbNativeWriting; }
  };
  input.addEventListener('change', async () => {
    const request = ++generation;
    pending = true; failed = false;
    try {
      const entries = JSON.parse(input.value || '{"items":[]}').items;
      const result = await api.collection(entries, { referenceItems: true });
      if (request !== generation) return;
      const resources = new Map(result.resources.map(resource => [JSON.stringify(resource.selection), resource]));
      const values = await Promise.all(entries.map(async entry => {
        const resource = resources.get(JSON.stringify(entry.selection));
        if (!resource || resource.unavailable) throw new Error(Joomla.Text._('PLG_FIELDS_SMARTBROWSERPICKER_INVALID'));
        const url = resource.metadata?.publicUrl || resource.metadata?.url || '';
        if (!image && !url) throw new Error(Joomla.Text._('COM_SMARTBROWSER_LINK_NO_PUBLIC_URL'));
        const address = image ? '' : await addresses.serialize(entry, resource);
        return { resource, usage: entry.usage || {}, url, address };
      }));
      if (request !== generation) return;
      if (image) {
        const value = values[0];
        const prefix = categoryImage ? mapping.image : `image_${mapping.role}`;
        const existing = native(prefix).value;
        const existingId = window.SmartBrowserMediaValue.parse?.(existing)?.resourceId;
        const sameResource = value && existingId && existingId === value.resource.id;
        write(prefix, value ? value.usage['ext.address'] ?? (sameResource ? existing : window.SmartBrowserMediaValue.format(value.resource, 'joomla')) : '');
        if (categoryImage) {
          for (const [key, name] of Object.entries(mapping.usageFields || { 'media.alt': 'image_alt', 'media.decorative': 'image_alt_empty' })) write(name, value?.usage[key] ?? (key === 'media.decorative' ? false : ''));
        } else {
          write(`${prefix}_alt`, value?.usage['media.alt'] || '');
          write(`${prefix}_alt_empty`, value?.usage['media.decorative'] || false);
        }
        if (!categoryImage) {
          write(`${prefix}_caption`, value?.usage['media.caption'] || '');
          write(imageClass, value?.usage['media.class'] || '');
          if (figureClass && value && Object.hasOwn(value.usage, 'media.figureClass')) write(figureClass, value.usage['media.figureClass'] || '');
          else if (figureClass && !value) write(figureClass, '');
        }
      } else mapping.slots.forEach((slot, index) => {
        const value = values[index];
        write(`url${slot}`, value?.address || '');
        write(`url${slot}text`, value?.usage['link.text'] || value?.resource.metadata.linkName || '');
        write(`target${slot}`, value?.usage['link.target'] ?? '');
      });
    } catch (error) {
      if (request !== generation) return;
      failed = true;
      Joomla.renderMessages({ error: [error.message] });
    } finally { if (request === generation) pending = false; }
  });
  form.addEventListener('reset', () => { generation++; pending = false; failed = false; });
  form.addEventListener('submit', event => {
    if (pending || failed) {
      event.preventDefault();
      const busy = document.querySelector('.smartbrowser-editor-busy');
      if (busy) busy.hidden = true;
      Joomla.renderMessages({ error: [Joomla.Text._(pending ? 'COM_SMARTBROWSER_WORKING' : 'PLG_FIELDS_SMARTBROWSERPICKER_INVALID')] });
    }
  }, true);
  // Rehydrate registered extension codecs without changing native fields or marking the editor dirty.
  if (addresses && config.nativeLinkAddresses?.some(raw => /#[a-zA-Z][a-zA-Z0-9]*:\/\//.test(raw))) {
    const revision = generation;
    pending = true;
    const initialEntries = JSON.parse(input.value || '{"items":[]}').items;
    Promise.all(config.nativeLinkAddresses.filter(Boolean).map((raw, index) => addresses.import(raw, [], { append: false })
      .then(result => result.items[0]).catch(() => initialEntries[index])))
      .then(items => { if (generation === revision) return selection.setItems(items.filter(Boolean), { silent: true, initial: true }); })
      .catch(() => {}) // Unavailable saved references remain represented by the server-prepared items.
      .finally(() => { if (generation === revision) pending = false; });
  }
  window.addEventListener('pagehide', () => { addresses?.destroy(); api.destroy(); }, { once: true });
}
for (const root of document.querySelectorAll('[data-sb-article-media]')) mountNativeSelection(root);
