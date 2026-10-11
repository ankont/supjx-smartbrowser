import { mountNativeSelection } from './article-media.js';
import { mountSelectionField } from './selection-field.js';

const mounted = new WeakSet();
const options = Joomla.getOptions('com_smartbrowser.image-selectors', {});
function selection(value) {
  if (!value) return null;
  const parsed = window.SmartBrowserMediaValue.parse(value);
  if (parsed.resourceId) return { adapter: 'media', id: parsed.resourceId };
  if (/[\\?#]/.test(value) || value.split('/').includes('..')) throw new Error('Unsupported media value');
  const url = new URL(value, options.siteUrl).href;
  const root = [...options.roots].sort((a, b) => b.url.length - a.url.length).find(root => url.startsWith(root.url));
  if (!root) throw new Error('Unsupported media provider');
  const path = '/' + decodeURIComponent(url.slice(root.url.length));
  if (/[\\?#]/.test(path) || path.split('/').includes('..')) throw new Error('Unsafe media path');
  return { adapter: 'media', id: root.filesystem + ':' + path };
}
function initialize(media) {
  if (mounted.has(media) || media.getAttribute('types') !== 'images') return;
  const field = media.querySelector('.field-media-input');
  const form = field?.form;
  const row = field?.closest('.control-group');
  if (!form || !row || field.matches(':disabled') || field.readOnly || !field.name || row.nextElementSibling?.matches('[data-sb-article-media]')) return;
  let reference;
  try { reference = selection(field.value); } catch { return; }
  const usageFields = {}, nativeNames = { image: field.name }, usage = {};
  const match = /^jform\[(images|params)\]\[(image_intro|image_fulltext|image)\]$/.exec(field.name);
  const accessible = /^(.*)\[imagefile\]$/.exec(field.name);
  if (match || accessible) {
    const candidates = accessible ? { 'media.alt': 'alt_text', 'media.decorative': 'alt_empty' }
      : { 'media.alt': match[2] + '_alt', 'media.decorative': match[2] + '_alt_empty' };
    if (match && match[1] === 'images') Object.assign(candidates, { 'media.caption': match[2] + '_caption', 'media.class': 'float_' + match[2].slice(6) });
    for (const [key, name] of Object.entries(candidates)) {
      const fullName = accessible ? `${accessible[1]}[${name}]` : `jform[${match[1]}][${name}]`;
      const control = form.elements.namedItem(fullName);
      if (!control?.tagName || control.disabled || control.readOnly) continue;
      usageFields[key] = name; nativeNames[name] = fullName;
      usage[key] = control.type === 'checkbox' ? control.checked : control.value;
    }
  }
  const root = document.createElement('div');
  let browseRoot = '';
  try {
    const path = new URL(media.getAttribute('url'), window.location.href).searchParams.get('path') || '';
    if (/^[\w-]+:\//.test(path)) browseRoot = path;
  } catch { /* An absent native browser URL does not introduce a new root restriction. */ }
  root.className = 'sb-selection-field';
  root.dataset.sbArticleMedia = JSON.stringify({ group: 'native', image: 'image', usageFields, nativeNames });
  root.dataset.sbField = JSON.stringify({ ...options, browseRoot, adapter: 'media', allowedAdapters: ['media'], allowedResourceTypes: ['image'],
    multiple: false, maxSelections: 1, homogeneous: true, selectionTarget: 'item', editorDisplay: 'compact',
    preserveUsageOnReplace: true, selectionProfile: Object.fromEntries(Object.entries(usage).map(([key, value]) => [key, { default: value }])) });
  root.innerHTML = '<input type="hidden" data-sb-value><div data-sb-collection></div><p class="text-danger" data-sb-error role="alert" hidden></p>';
  root.querySelector('[data-sb-value]').value = JSON.stringify({ version: 1, items: reference ? [{ selection: reference, usage }] : [] });
  row.after(root);
  mounted.add(media);
  mountNativeSelection(root);
  const instance = mountSelectionField(root);
  field.addEventListener('change', async () => {
    if (root.dataset.sbNativeWriting || !root.isConnected) return;
    try {
      const reference = selection(field.value);
      await instance.setItems(reference ? [{ selection: reference, usage: Object.fromEntries(Object.entries(usageFields).map(([key, name]) => {
        const control = form.elements.namedItem(nativeNames[name]);
        return [key, control.type === 'checkbox' ? control.checked : control.value];
      })) }] : []);
    } catch { /* Do not replace unsupported plugin values with an empty selection. */ }
  });
}
const scan = () => document.querySelectorAll('joomla-field-media').forEach(initialize);
scan();
const observer = new MutationObserver(scan);
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
