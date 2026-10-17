import { extensionValues, metadataKey, metadataValue } from './extensionMetadata.js';
export function previewExtensionContext(base) {
  const writable = () => { if (base.isReadOnly || base.isCurrent?.() === false) throw new Error('This preview is read-only or no longer active.'); };
  const providers = () => {
    const registry = base.overlayRegistry || globalThis.window?.SmartBrowserPicker;
    return registry?.getImagePresentations?.() || registry?.extensions?.().imagePresentations || registry?.imagePresentations || [];
  };
  const changedProviders = () => providers().filter(provider => {
    try { return typeof provider.reset === 'function' && provider.hasChanges?.(context) === true; }
    catch (error) { console.error(error); return false; }
  });
  const context = { ...base,
    hasPreviewChanges() {
      const values = base.getValues?.() || {};
      return Object.entries(values).some(([key, value]) => key.startsWith('visual.') && value != null && value !== '')
        || Boolean(values['ext.address'] && values['ext.address'] !== base.getDefaultAddress?.())
        || Boolean(base.getDefaultAddress?.() && base.getAddress?.() !== base.getDefaultAddress()) || changedProviders().length > 0;
    },
    async resetPreview() {
      writable();
      for (const provider of changedProviders()) { writable(); await provider.reset(context); }
      // Reset presentation only; unrelated extension metadata and article text remain intact.
      for (const key of Object.keys(base.getValues?.() || {})) {
        writable();
        if (key.startsWith('visual.')) await base.setValue(key, null);
      }
      writable();
      if (base.resetAddress) await base.resetAddress();
      else if (base.getDefaultAddress) await base.setAddress?.(base.getDefaultAddress());
      else await base.setValue?.('ext.address', null);
    },
    getMetadata(namespace) {
      const values = base.getValues?.() || {};
      return namespace == null ? Object.fromEntries(Object.entries(extensionValues(values)).map(([key, value]) => [key.slice(4), metadataValue(value)]))
        : values[metadataKey(namespace)] === undefined ? undefined : metadataValue(values[metadataKey(namespace)]);
    },
    setMetadata(namespace, data) {
      writable();
      const key = metadataKey(namespace), value = metadataValue(data);
      const combined = { ...base.getValues?.(), [key]: value };
      if (Object.keys(combined).length > 100) throw new TypeError('Too many selection properties.');
      metadataValue(combined);
      return base.setValue(key, value);
    },
    setAddress(address) {
      writable();
      const value = String(address || '');
      if (value.length > 2048 || /[\u0000-\u001f\u007f]/.test(value) || /^\s*(?:javascript|data|vbscript):/i.test(value)) throw new TypeError('Invalid preview address.');
      return base.setAddress?.(value);
    },
    setValue(key, value) { writable(); return base.setValue?.(key, value); },
  };
  return context;
}
