import { preferenceStorage } from './userPreferences.js';

export const personalKey = 'supjx.smartbrowser.personal';
export const contextAdapters = ['categories', 'tags', 'menus'];
export const personalDefaults = Object.freeze({ pageSize: null, loadingMode: 'inherit', editorMode: 'inherit', contextItems: 'inherit', integration: 'inherit', pickerStateScope: 'caller', pickerNodeScope: 'caller' });
const choices = { loadingMode: ['inherit', 'all', 'pages', 'smart'], editorMode: ['inherit', 'modal', 'page'], contextItems: ['inherit', 'show', 'hide'], integration: ['inherit', 'smartbrowser', 'native'], pickerStateScope: ['caller', 'adapter'], pickerNodeScope: ['caller', 'adapter'] };
export function personalPreferences(storage = preferenceStorage()) {
  let saved;
  try { saved = JSON.parse(storage?.getItem(personalKey) || '{}'); } catch {}
  return sanitize(saved);
}
function sanitize(saved = {}) {
  const safe = Object.fromEntries(Object.entries(personalDefaults).map(([key, value]) => [key, key === 'pageSize'
    ? Number.isSafeInteger(saved?.pageSize) && saved.pageSize > 0 ? saved.pageSize : null
    : choices[key].includes(saved?.[key]) ? saved[key] : value]));
  safe.contextItemsByAdapter = Object.fromEntries(contextAdapters.map(adapter => [adapter, choices.contextItems.includes(saved?.contextItemsByAdapter?.[adapter]) ? saved.contextItemsByAdapter[adapter] : safe.contextItems]));
  return safe;
}
export function resolveLoadingPreferences(settings, options) {
  return {
    mode: settings.loadingMode === 'inherit' ? options.loadingMode || 'all' : settings.loadingMode,
    pageSize: Number.isSafeInteger(settings.pageSize) && settings.pageSize > 0 ? settings.pageSize
      : Number.isSafeInteger(options.pageSize) && options.pageSize > 0 ? options.pageSize : 50,
  };
}
export const personalContextItems = (settings, adapter) => settings.contextItemsByAdapter?.[adapter?.replace(/^flat-/, '')] || settings.contextItems || 'inherit';
export function pickerScope(options, settings = personalPreferences(), purpose = 'state') {
  return settings[purpose === 'node' ? 'pickerNodeScope' : 'pickerStateScope'] === 'adapter' ? 'shared'
    : encodeURIComponent(options.pickerContext?.viewPreferenceKey || options.selectionHost?.viewPreferenceKey || options.viewPreferenceKey || 'default');
}
export const nodePreferenceKey = (options, storage = preferenceStorage()) => `supjx.smartbrowser.nodes.${options.mode === 'manage' && !options.pickerInstance && !options.pickerContext ? 'manage' : 'picker.' + pickerScope(options, personalPreferences(storage), 'node')}.${options.adapter.replace(/^flat-/, '')}`;
export async function savePersonalPreferences(settings, storage = preferenceStorage()) {
  const safe = sanitize(settings);
  storage.setItem(personalKey, JSON.stringify(safe));
  if (storage.flush && !await storage.flush()) throw new Error('COM_SMARTBROWSER_PERSONAL_SAVE_FAILED');
  return safe;
}
