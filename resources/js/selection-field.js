import { mountCollection } from './collection.js';
import { selectionFieldValue } from './core/selectionFieldValue.js';
import { articleAnchorSuggestions } from './core/articleAnchors.js';

const mounted = new WeakMap();
export function mountSelectionField(root) {
  if (mounted.has(root)) return mounted.get(root);
  const input = root.querySelector('[data-sb-value]');
  const initialValue = input.value;
  const config = JSON.parse(root.dataset.sbField);
  const row = root.closest('.control-group');
  const label = row?.querySelector(':scope > .control-label');
  const labelWasHidden = label?.hidden;
  if (config.showLabel === false && label) label.hidden = true;
  if (config.fullWidth === true) row?.classList.add('sb-selection-full-width');
  const adapters = config.allowedAdapters || [config.adapter];
  const t = key => window.Joomla?.Text?._(key, key) || key;
  const message = root.querySelector('[data-sb-error]');
  const showError = error => { message.textContent = error ? t('PLG_FIELDS_SMARTBROWSERPICKER_INVALID') : ''; message.hidden = !error; };
  let value, disposed = false;
  try { value = selectionFieldValue(input.value, adapters, config.multiple, config.homogeneous); }
  catch (error) { value = selectionFieldValue('', adapters); showError(error); }
  const persist = () => {
    input.value = value.items.length ? JSON.stringify(value) : '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    showError(null);
  };
  let collection;
  const render = async () => {
    if (collection) return collection.setItems(value.items);
    collection = mountCollection(root.querySelector('[data-sb-collection]'), { ...config, referenceItems: true,
    items: value.items, layout: config.editorDisplay === 'compact' ? 'compact' : 'grid',
    readOnly: config.readOnly, allowOrdering: config.multiple && config.ordering, allowRemove: !config.readOnly, contextActions: false,
    selectedResources: true, informationPanel: config.informationPanel !== false,
    pickerOptions: () => ({ selectionEditorContext: { ...config.selectionEditorContext, suggestions: {
      ...config.selectionEditorContext?.suggestions, anchors: articleAnchorSuggestions(input.form, config.anchorSuggestions)
    }, phoneCountryPrefix: config.phoneCountryPrefix || '' } }),
    defaultResourceActionId: 'collectionReplace',
    onChange(detail) {
      value = selectionFieldValue({ version: 1, items: detail.items }, adapters, config.multiple, config.homogeneous);
      persist();
    },
    onError: showError,
    });
    return collection.ready;
  };
  render().catch(showError);
  const select = root.querySelector('[data-sb-select]'), clear = root.querySelector('[data-sb-clear]');
  const selectClick = async () => {
    if (config.readOnly || disposed || select?.disabled) return;
    if (select) select.disabled = true;
    try { await collection.editSelection(); }
    catch (error) { if (!disposed) showError(error); }
    finally { if (select && !disposed) select.disabled = config.readOnly; }
  };
  const clearClick = () => { if (config.readOnly || disposed) return; value = selectionFieldValue('', adapters); persist(); render().catch(showError); };
  const reset = () => setTimeout(() => { if (disposed) return; input.value = initialValue; try { value = selectionFieldValue(input.value, adapters, config.multiple, config.homogeneous); render().catch(showError); showError(null); } catch (error) { showError(error); } }, 0);
  select?.addEventListener('click', selectClick); clear?.addEventListener('click', clearClick); input.form?.addEventListener('reset', reset);
  const instance = { addToolbarButton: button => collection.addToolbarButton(button), attachPreview: element => collection.attachPreview(element), destroy() { if (disposed) return; disposed = true; select?.removeEventListener('click', selectClick); clear?.removeEventListener('click', clearClick); input.form?.removeEventListener('reset', reset); if (label) label.hidden = labelWasHidden; if (config.fullWidth === true) row?.classList.remove('sb-selection-full-width'); collection.destroy(); mounted.delete(root); } };
  mounted.set(root, instance);
  instance.setNativeAddress = value => collection.setNativeAddress(value);
  instance.exportAddresses = options => collection.exportAddresses(options);
  instance.importAddresses = (text, options) => collection.importAddresses(text, options);
  instance.setItems = items => {
    if (disposed || config.readOnly) return;
    value = selectionFieldValue({ version: 1, items }, adapters, config.multiple, config.homogeneous);
    persist();
    return render();
  };
  return instance;
}
const initialize = target => { if (target.matches?.('[data-sb-field]')) mountSelectionField(target); target.querySelectorAll?.('[data-sb-field]').forEach(mountSelectionField); };
window.SmartBrowser = { ...window.SmartBrowser, mountSelectionField };
initialize(document);
document.addEventListener('joomla:updated', event => initialize(event.target));
const observer = new MutationObserver(records => records.forEach(record => {
  record.removedNodes.forEach(node => { if (node.nodeType !== 1) return; [node, ...node.querySelectorAll('[data-sb-field]')].forEach(root => { if (!root.isConnected) mounted.get(root)?.destroy(); }); });
  record.addedNodes.forEach(node => { if (node.nodeType === 1) initialize(node); });
}));
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('pagehide', () => { observer.disconnect(); document.querySelectorAll('[data-sb-field]').forEach(root => mounted.get(root)?.destroy()); }, { once: true });
