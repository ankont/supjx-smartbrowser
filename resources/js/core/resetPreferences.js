const markerKey = 'supjx.smartbrowser.preferencesResetToken';

export function resetPreferencesIfNeeded(storage, token) {
  if (!token || storage.getItem(markerKey) === token) return false;
  const keys = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith('supjx.smartbrowser.') && key !== markerKey && key !== 'supjx.smartbrowser.editorReturn') keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
  storage.setItem(markerKey, token);
  return true;
}
